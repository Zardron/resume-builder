import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Application from '../models/Application.js';

// Get all conversations
export const getConversations = async (req, res) => {
  try {
    const user = req.user;
    const conversations = await Conversation.find({
      'participants.userId': user._id,
    })
      .populate('participants.userId', 'fullName email profile.avatar')
      .populate('relatedTo.applicationId', 'status')
      .sort({ lastMessageAt: -1 })
      .limit(parseInt(req.query.limit) || 50)
      .skip(parseInt(req.query.skip) || 0);

    // Get unread counts
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = conv.unreadCount.get(user._id.toString()) || 0;
        const lastMessage = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .limit(1);

        return {
          ...conv.toObject(),
          unreadCount,
          lastMessage,
        };
      })
    );

    res.json({
      success: true,
      data: conversationsWithUnread,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations',
      error: error.message,
    });
  }
};

// Get conversation by ID
export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const conversation = await Conversation.findById(id)
      .populate('participants.userId', 'fullName email profile.avatar')
      .populate('relatedTo.applicationId', 'status jobPostingId');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      p => p.userId._id.toString() === user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation',
      error: error.message,
    });
  }
};

// Get or create conversation by application
export const getOrCreateConversation = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const user = req.user;

    // Get application
    const application = await Application.findById(applicationId)
      .populate('applicantId')
      .populate('organizationId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check access
    const isApplicant = application.applicantId._id.toString() === user._id.toString();
    const isRecruiter = application.organizationId._id.toString() === user.organizationId?.toString();

    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      'relatedTo.type': 'application',
      'relatedTo.applicationId': applicationId,
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [
          {
            userId: application.applicantId._id,
            role: 'applicant',
          },
          {
            userId: user._id,
            role: isRecruiter ? 'recruiter' : 'applicant',
            organizationId: application.organizationId._id,
          },
        ],
        relatedTo: {
          type: 'application',
          applicationId: application._id,
        },
      });
      await conversation.save();
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation',
      error: error.message,
    });
  }
};

// Get messages in conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user = req.user;

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    const isParticipant = conversation.participants.some(
      p => p.userId.toString() === user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'fullName email profile.avatar')
      .populate('recipientId', 'fullName email')
      .sort({ createdAt: 1 })
      .limit(parseInt(req.query.limit) || 100)
      .skip(parseInt(req.query.skip) || 0);

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        recipientId: user._id,
        readAt: null,
      },
      {
        readAt: new Date(),
      }
    );

    // Update unread count
    conversation.unreadCount.set(user._id.toString(), 0);
    await conversation.save();

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages',
      error: error.message,
    });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { body, subject, attachments } = req.body;
    const user = req.user;

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    const userParticipant = conversation.participants.find(
      p => p.userId.toString() === user._id.toString()
    );

    if (!userParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Find recipient
    const recipient = conversation.participants.find(
      p => p.userId.toString() !== user._id.toString()
    );

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    // Create message
    const message = new Message({
      conversationId,
      senderId: user._id,
      senderRole: userParticipant.role,
      recipientId: recipient.userId,
      recipientRole: recipient.role,
      subject,
      body,
      attachments: attachments || [],
    });

    await message.save();

    // Update conversation
    conversation.lastMessageAt = new Date();
    const currentUnread = conversation.unreadCount.get(recipient.userId.toString()) || 0;
    conversation.unreadCount.set(recipient.userId.toString(), currentUnread + 1);
    await conversation.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Check if user is recipient
    if (message.recipientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    message.readAt = new Date();
    await message.save();

    // Update conversation unread count
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation) {
      conversation.unreadCount.set(req.user._id.toString(), 0);
      await conversation.save();
    }

    res.json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message,
    });
  }
};

// Get message templates
export const getMessageTemplates = async (req, res) => {
  try {
    // Message templates for recruiters
    const templates = [
      {
        id: 'interview-invitation',
        name: 'Interview Invitation',
        subject: 'Interview Invitation - {{jobTitle}}',
        body: 'Hi {{applicantName}},\n\nWe would like to invite you for an interview for the {{jobTitle}} position.\n\nDate: {{interviewDate}}\nTime: {{interviewTime}}\nLocation: {{interviewLocation}}\n\nLooking forward to speaking with you.\n\nBest regards,\n{{recruiterName}}',
        category: 'interview',
      },
      {
        id: 'application-received',
        name: 'Application Received',
        subject: 'Thank you for your application - {{jobTitle}}',
        body: 'Hi {{applicantName}},\n\nThank you for applying for the {{jobTitle}} position. We have received your application and will review it shortly.\n\nWe will be in touch soon.\n\nBest regards,\n{{recruiterName}}',
        category: 'application',
      },
      {
        id: 'offer-letter',
        name: 'Offer Letter',
        subject: 'Job Offer - {{jobTitle}}',
        body: 'Hi {{applicantName}},\n\nWe are pleased to offer you the {{jobTitle}} position.\n\nDetails:\n- Position: {{jobTitle}}\n- Start Date: {{startDate}}\n- Salary: {{salary}}\n\nPlease let us know if you have any questions.\n\nBest regards,\n{{recruiterName}}',
        category: 'offer',
      },
      {
        id: 'rejection',
        name: 'Rejection Notice',
        subject: 'Update on your application - {{jobTitle}}',
        body: 'Hi {{applicantName}},\n\nThank you for your interest in the {{jobTitle}} position. After careful consideration, we have decided to move forward with other candidates.\n\nWe wish you the best in your job search.\n\nBest regards,\n{{recruiterName}}',
        category: 'rejection',
      },
    ];

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Get message templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get message templates',
      error: error.message,
    });
  }
};

// Send message using template
export const sendTemplateMessage = async (req, res) => {
  try {
    const { conversationId, templateId, variables } = req.body;

    // Get template (in production, would fetch from database)
    const templates = {
      'interview-invitation': {
        subject: 'Interview Invitation - {{jobTitle}}',
        body: 'Hi {{applicantName}},\n\nWe would like to invite you for an interview...',
      },
      'application-received': {
        subject: 'Thank you for your application - {{jobTitle}}',
        body: 'Hi {{applicantName}},\n\nThank you for applying...',
      },
      // Add other templates...
    };

    const template = templates[templateId];
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    // Replace variables
    let subject = template.subject;
    let body = template.body;
    Object.keys(variables || {}).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, variables[key]);
      body = body.replace(regex, variables[key]);
    });

    // Get conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Find recipient
    const recipient = conversation.participants.find(
      p => p.userId.toString() !== req.user._id.toString()
    );

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    // Create message
    const message = new Message({
      conversationId,
      senderId: req.user._id,
      senderRole: 'recruiter',
      recipientId: recipient.userId,
      recipientRole: recipient.role,
      subject,
      body,
      isSystemMessage: false,
    });

    await message.save();

    // Update conversation
    conversation.lastMessageAt = new Date();
    const currentUnread = conversation.unreadCount.get(recipient.userId.toString()) || 0;
    conversation.unreadCount.set(recipient.userId.toString(), currentUnread + 1);
    await conversation.save();

    res.status(201).json({
      success: true,
      message: 'Template message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Send template message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send template message',
      error: error.message,
    });
  }
};


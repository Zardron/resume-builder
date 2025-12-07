import SupportTicket from '../models/SupportTicket.js';
import User from '../models/User.js';
import { logError, logInfo } from '../utils/logger.js';

// Create a new support ticket
export const createSupportTicket = async (req, res) => {
  try {
    const user = req.user;
    const { subject, category, priority, description, attachments } = req.body;

    // Validate required fields
    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description are required',
      });
    }

    // Create the support ticket
    const ticket = new SupportTicket({
      userId: user._id,
      userEmail: user.email,
      userName: user.fullName,
      subject,
      category: category || 'general_inquiry',
      priority: priority || 'medium',
      description,
      attachments: attachments || [],
      status: 'open',
    });

    await ticket.save();

    logInfo('Support ticket created', {
      ticketId: ticket._id,
      userId: user._id,
      category: ticket.category,
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    logError('Create support ticket error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error.message,
    });
  }
};

// Get user's support tickets
export const getUserTickets = async (req, res) => {
  try {
    const user = req.user;
    const { status, category, limit = 20, skip = 0 } = req.query;

    const query = { userId: user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await SupportTicket.countDocuments(query);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit),
      },
    });
  } catch (error) {
    logError('Get user tickets error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get support tickets',
      error: error.message,
    });
  }
};

// Get a specific support ticket
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const ticket = await SupportTicket.findById(id)
      .populate('userId', 'fullName email')
      .populate('responses.responderId', 'fullName email role')
      .populate('resolvedBy', 'fullName email')
      .populate('closedBy', 'fullName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      });
    }

    // Check if user owns the ticket or is an admin
    const isOwner = ticket.userId._id.toString() === user._id.toString();
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    logError('Get ticket error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get support ticket',
      error: error.message,
    });
  }
};

// Add a response to a ticket (user can add follow-up, admin can respond)
export const addTicketResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const user = req.user;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      });
    }

    // Check if user owns the ticket or is an admin
    const isOwner = ticket.userId.toString() === user._id.toString();
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Determine responder role
    let responderRole = 'user';
    if (isAdmin) {
      responderRole = user.role === 'super_admin' ? 'super_admin' : 'admin';
    }

    // Add response
    await ticket.addResponse(
      user._id,
      user.fullName,
      responderRole,
      message
    );

    logInfo('Response added to support ticket', {
      ticketId: ticket._id,
      responderId: user._id,
      isAdmin,
    });

    const updatedTicket = await SupportTicket.findById(id)
      .populate('responses.responderId', 'fullName email role');

    res.json({
      success: true,
      message: 'Response added successfully',
      data: updatedTicket,
    });
  } catch (error) {
    logError('Add ticket response error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message,
    });
  }
};

// Admin: Get all support tickets
export const getAllTickets = async (req, res) => {
  try {
    const user = req.user;

    // Only admins can access this
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    const { status, category, priority, userId, limit = 50, skip = 0 } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (userId) {
      query.userId = userId;
    }

    const tickets = await SupportTicket.find(query)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await SupportTicket.countDocuments(query);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit),
      },
    });
  } catch (error) {
    logError('Get all tickets error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get support tickets',
      error: error.message,
    });
  }
};

// Admin: Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    // Only admins can update status
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      });
    }

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    ticket.status = status;

    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
      ticket.resolvedBy = user._id;
    } else if (status === 'closed') {
      ticket.closedAt = new Date();
      ticket.closedBy = user._id;
    }

    await ticket.save();

    logInfo('Support ticket status updated', {
      ticketId: ticket._id,
      newStatus: status,
      updatedBy: user._id,
    });

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket,
    });
  } catch (error) {
    logError('Update ticket status error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket status',
      error: error.message,
    });
  }
};

// Admin: Add internal note
export const addInternalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const user = req.user;

    // Only admins can add internal notes
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Note is required',
      });
    }

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      });
    }

    ticket.internalNotes.push({
      note,
      addedBy: user._id,
      addedAt: new Date(),
    });

    await ticket.save();

    logInfo('Internal note added to support ticket', {
      ticketId: ticket._id,
      addedBy: user._id,
    });

    res.json({
      success: true,
      message: 'Internal note added successfully',
      data: ticket,
    });
  } catch (error) {
    logError('Add internal note error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to add internal note',
      error: error.message,
    });
  }
};

// Get ticket statistics (for admin dashboard)
export const getTicketStatistics = async (req, res) => {
  try {
    const user = req.user;

    // Only admins can access this
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    const stats = {
      total: await SupportTicket.countDocuments(),
      open: await SupportTicket.countDocuments({ status: 'open' }),
      inProgress: await SupportTicket.countDocuments({ status: 'in_progress' }),
      resolved: await SupportTicket.countDocuments({ status: 'resolved' }),
      closed: await SupportTicket.countDocuments({ status: 'closed' }),
      byCategory: {},
      byPriority: {},
    };

    // Get counts by category
    const categories = ['technical_issue', 'account_issue', 'billing_issue', 'feature_request', 'bug_report', 'general_inquiry', 'other'];
    for (const category of categories) {
      stats.byCategory[category] = await SupportTicket.countDocuments({ category });
    }

    // Get counts by priority
    const priorities = ['low', 'medium', 'high', 'urgent'];
    for (const priority of priorities) {
      stats.byPriority[priority] = await SupportTicket.countDocuments({ priority });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logError('Get ticket statistics error:', error, { userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Failed to get ticket statistics',
      error: error.message,
    });
  }
};

// Public contact form (no authentication required)
export const createPublicContact = async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Try to find user by email (optional - for linking if user exists)
    let user = null;
    try {
      user = await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      // User lookup failed, continue without user
    }

    // If user exists, create a support ticket
    if (user) {
      const ticket = new SupportTicket({
        userId: user._id,
        userEmail: user.email,
        userName: user.fullName || name,
        subject,
        category: category || 'general_inquiry',
        priority: 'medium',
        description: message,
        status: 'open',
      });

      await ticket.save();

      logInfo('Public contact form - ticket created for existing user', {
        ticketId: ticket._id,
        userId: user._id,
        email,
      });

      return res.status(201).json({
        success: true,
        message: 'Your message has been received. We will get back to you as soon as possible.',
        data: { ticketId: ticket._id },
      });
    }

    // If no user exists, create a contact record (you might want to create a separate Contact model)
    // For now, we'll log it and return success
    // In a production app, you might want to:
    // 1. Store in a separate Contact collection
    // 2. Send an email notification
    // 3. Create a ticket that can be manually linked to a user later

    logInfo('Public contact form submission', {
      name,
      email,
      subject,
      category: category || 'general_inquiry',
    });

    // TODO: You might want to create a Contact model or send an email here
    // For now, we'll just return success

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you as soon as possible.',
    });
  } catch (error) {
    logError('Public contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: error.message,
    });
  }
};

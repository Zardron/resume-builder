import RecruiterApplication from '../models/RecruiterApplication.js';
import { sendEmail } from '../services/emailService.js';

// Create a new recruiter application
export const createRecruiterApplication = async (req, res) => {
  try {
    const { fullName, email, company, position, message, selectedPlan } = req.body;

    // Validation
    if (!fullName || !email || !company || !position || !message || !selectedPlan) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Check if user already has a pending application
    const existingApplication = await RecruiterApplication.findOne({
      email: email.toLowerCase().trim(),
      status: { $in: ['pending', 'reviewing'] },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending recruiter application',
      });
    }

    // Create application
    const application = new RecruiterApplication({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      company: company.trim(),
      position: position.trim(),
      message: message.trim(),
      selectedPlan,
      status: 'pending',
    });

    await application.save();

    // Send confirmation email to applicant
    try {
      const emailSubject = 'Recruiter Application Received - ResumeIQHub';
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Application Received!</h2>
          <p>Hi ${fullName},</p>
          <p>Thank you for applying to become a recruiter on ResumeIQHub. We have received your application and our admin team will review it shortly.</p>
          <p><strong>Selected Plan:</strong> ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</p>
          <p>You will be contacted via email once your application has been reviewed.</p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Best regards,<br>
            The ResumeIQHub Team
          </p>
        </div>
      `;
      const emailText = `Hi ${fullName},\n\nThank you for applying to become a recruiter on ResumeIQHub. We have received your application and our admin team will review it shortly.\n\nSelected Plan: ${selectedPlan}\n\nYou will be contacted via email once your application has been reviewed.\n\nBest regards,\nThe ResumeIQHub Team`;

      await sendEmail({
        to: email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Recruiter application submitted successfully',
      data: application,
    });
  } catch (error) {
    console.error('Create recruiter application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit recruiter application',
      error: error.message,
    });
  }
};

// Get all recruiter applications (Super Admin only)
export const getRecruiterApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const applications = await RecruiterApplication.find(query)
      .populate('reviewedBy', 'fullName email')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Get recruiter applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recruiter applications',
      error: error.message,
    });
  }
};

// Get single recruiter application
export const getRecruiterApplication = async (req, res) => {
  try {
    const application = await RecruiterApplication.findById(req.params.id)
      .populate('reviewedBy', 'fullName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter application not found',
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error('Get recruiter application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recruiter application',
      error: error.message,
    });
  }
};

// Update recruiter application status (Super Admin only)
export const updateRecruiterApplicationStatus = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    const application = await RecruiterApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter application not found',
      });
    }

    if (!['pending', 'reviewing', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    application.status = status;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    if (reviewNotes) {
      application.reviewNotes = reviewNotes.trim();
    }

    await application.save();

    // Send email notification to applicant
    try {
      let emailSubject, emailHtml, emailText;
      
      if (status === 'approved') {
        emailSubject = 'Recruiter Application Approved - ResumeIQHub';
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10b981;">Application Approved!</h2>
            <p>Hi ${application.fullName},</p>
            <p>Great news! Your recruiter application has been approved. You can now sign in to your account and start using our recruiting features.</p>
            <p><strong>Selected Plan:</strong> ${application.selectedPlan.charAt(0).toUpperCase() + application.selectedPlan.slice(1)}</p>
            <p>If you don't have an account yet, please sign up using the email address you provided: <strong>${application.email}</strong></p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Best regards,<br>
              The ResumeIQHub Team
            </p>
          </div>
        `;
        emailText = `Hi ${application.fullName},\n\nGreat news! Your recruiter application has been approved. You can now sign in to your account and start using our recruiting features.\n\nSelected Plan: ${application.selectedPlan}\n\nIf you don't have an account yet, please sign up using the email address you provided: ${application.email}\n\nBest regards,\nThe ResumeIQHub Team`;
      } else if (status === 'rejected') {
        emailSubject = 'Recruiter Application Update - ResumeIQHub';
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #ef4444;">Application Status Update</h2>
            <p>Hi ${application.fullName},</p>
            <p>We regret to inform you that your recruiter application has not been approved at this time.</p>
            ${reviewNotes ? `<p><strong>Notes:</strong> ${reviewNotes}</p>` : ''}
            <p>If you have any questions, please feel free to contact our support team.</p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Best regards,<br>
              The ResumeIQHub Team
            </p>
          </div>
        `;
        emailText = `Hi ${application.fullName},\n\nWe regret to inform you that your recruiter application has not been approved at this time.\n\n${reviewNotes ? `Notes: ${reviewNotes}\n\n` : ''}If you have any questions, please feel free to contact our support team.\n\nBest regards,\nThe ResumeIQHub Team`;
      } else {
        emailSubject = 'Recruiter Application Status Update - ResumeIQHub';
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Application Status Update</h2>
            <p>Hi ${application.fullName},</p>
            <p>Your recruiter application status has been updated to: <strong>${status.charAt(0).toUpperCase() + status.slice(1)}</strong></p>
            ${reviewNotes ? `<p><strong>Notes:</strong> ${reviewNotes}</p>` : ''}
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Best regards,<br>
              The ResumeIQHub Team
            </p>
          </div>
        `;
        emailText = `Hi ${application.fullName},\n\nYour recruiter application status has been updated to: ${status}\n\n${reviewNotes ? `Notes: ${reviewNotes}\n\n` : ''}Best regards,\nThe ResumeIQHub Team`;
      }

      await sendEmail({
        to: application.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Recruiter application status updated successfully',
      data: application,
    });
  } catch (error) {
    console.error('Update recruiter application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recruiter application status',
      error: error.message,
    });
  }
};

// Delete recruiter application (Super Admin only)
export const deleteRecruiterApplication = async (req, res) => {
  try {
    const application = await RecruiterApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter application not found',
      });
    }

    res.json({
      success: true,
      message: 'Recruiter application deleted successfully',
    });
  } catch (error) {
    console.error('Delete recruiter application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recruiter application',
      error: error.message,
    });
  }
};


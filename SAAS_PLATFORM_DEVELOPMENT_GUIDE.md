# ResumeIQ - Full Recruitment SaaS Platform Development Guide

## 📋 Table of Contents
1. [Platform Overview](#platform-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [User Workflows](#user-workflows)
6. [Key Modules & Features](#key-modules--features)
7. [Onboarding Flows](#onboarding-flows)
8. [Multi-Tenant Organization Support](#multi-tenant-organization-support)
9. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 Platform Overview

ResumeIQ transforms from a resume builder into a **complete recruitment SaaS platform** connecting recruiters and applicants. The platform enables:

- **Recruiters**: Post jobs, screen candidates, manage pipelines, schedule interviews, and collaborate with team members
- **Applicants**: Build professional resumes, discover job opportunities, apply to positions, track application status, and schedule interviews

### Core Value Propositions

**For Recruiters:**
- Streamlined candidate sourcing and screening
- AI-powered resume parsing and matching
- Collaborative hiring workflows
- Comprehensive analytics and reporting
- Team management and role-based access

**For Applicants:**
- Professional resume creation with AI assistance
- Job discovery with personalized recommendations
- Application tracking and status updates
- Direct communication with recruiters
- Interview scheduling integration

---

## 👥 User Roles & Permissions

### Role Hierarchy

```
Super Admin (Platform Owner)
    ↓
Organization Admin (Company Owner)
    ↓
Recruiter Manager (Team Lead)
    ↓
Recruiter (Hiring Manager)
    ↓
Applicant (Job Seeker)
```

### Role Definitions

#### 1. **Super Admin**
- Platform-wide access
- Manage all organizations
- System configuration
- Analytics and reporting
- User management across platform

**Permissions:**
- Full system access
- Create/manage organizations
- View all analytics
- Manage billing and subscriptions
- System settings configuration

#### 2. **Organization Admin**
- Company/team owner
- Manage organization settings
- Invite team members
- Manage billing and subscriptions
- View organization-wide analytics

**Permissions:**
- Manage organization profile
- Invite/remove team members
- Assign roles within organization
- Manage billing and subscriptions
- View all organization data
- Create/edit/delete job postings
- Access all candidates and applications

#### 3. **Recruiter Manager**
- Team leadership role
- Manage recruiters in team
- Oversee hiring pipelines
- Generate team reports
- Approve job postings

**Permissions:**
- View team activity
- Manage assigned recruiters
- Create/edit job postings (requires approval)
- Access all candidates in team pipelines
- Generate team reports
- Schedule interviews
- Send messages to candidates

#### 4. **Recruiter**
- Primary hiring role
- Post and manage jobs
- Screen candidates
- Schedule interviews
- Communicate with applicants

**Permissions:**
- Create/edit own job postings
- View assigned candidates
- Screen and evaluate candidates
- Schedule interviews
- Send messages to candidates
- Update application status
- Add notes and tags to candidates

#### 5. **Applicant**
- Job seeker role
- Build resumes
- Discover and apply to jobs
- Track applications
- Communicate with recruiters

**Permissions:**
- Create/edit resumes
- Browse and search jobs
- Apply to job postings
- View application status
- Schedule interviews
- Send messages to recruiters
- View recommended jobs

---

## 🏗️ System Architecture

### Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Platform Layer                        │
│  (Authentication, Billing, Analytics, Notifications)   │
┌─────────────────────────────────────────────────────────┐
│                  Organization Layer                      │
│  (Team Management, Settings, Permissions, Workspace)     │
┌─────────────────────────────────────────────────────────┐
│              Application Layer                          │
│  ┌──────────────┐         ┌──────────────┐            │
│  │  Recruiter   │         │   Applicant  │            │
│  │   Modules    │◄───────►│   Modules    │            │
│  └──────────────┘         └──────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- Node.js + Express
- MongoDB (with multi-tenant data isolation)
- JWT Authentication
- Socket.io (real-time features)
- Redis (caching and sessions)

**Frontend:**
- React + Vite
- React Router
- Context API / Redux (state management)
- Socket.io Client
- React Query (data fetching)

**Third-Party Integrations:**
- Stripe (payments)
- SendGrid (email)
- Twilio (SMS/phone)
- Calendly API (interview scheduling)
- AWS S3 (file storage)
- OpenAI API (AI features)

---

## 💾 Database Schema

### New Models Required

#### 1. **Organization Model**
```javascript
{
  name: String,
  slug: String, // unique identifier
  industry: String,
  size: String, // 'startup', 'small', 'medium', 'large', 'enterprise'
  website: String,
  logo: String,
  subscription: {
    plan: String, // 'starter', 'professional', 'enterprise'
    status: String,
    seats: Number, // number of team members
    startDate: Date,
    endDate: Date
  },
  settings: {
    branding: {
      primaryColor: String,
      logo: String,
      customDomain: String
    },
    features: {
      aiScreening: Boolean,
      advancedAnalytics: Boolean,
      apiAccess: Boolean,
      customWorkflows: Boolean
    }
  },
  billing: {
    stripeCustomerId: String,
    billingEmail: String,
    address: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **TeamMember Model**
```javascript
{
  organizationId: ObjectId,
  userId: ObjectId,
  role: String, // 'admin', 'manager', 'recruiter'
  department: String,
  permissions: {
    canPostJobs: Boolean,
    canViewAllCandidates: Boolean,
    canManageTeam: Boolean,
    canViewAnalytics: Boolean,
    canManageBilling: Boolean
  },
  invitedBy: ObjectId,
  invitedAt: Date,
  joinedAt: Date,
  status: String, // 'pending', 'active', 'inactive'
  lastActive: Date
}
```

#### 3. **JobPosting Model**
```javascript
{
  organizationId: ObjectId,
  postedBy: ObjectId, // recruiter ID
  title: String,
  description: String,
  requirements: [String],
  location: {
    type: String, // 'remote', 'hybrid', 'onsite'
    city: String,
    state: String,
    country: String,
    coordinates: [Number] // [longitude, latitude]
  },
  employmentType: String, // 'full-time', 'part-time', 'contract', 'internship'
  salary: {
    min: Number,
    max: Number,
    currency: String,
    period: String // 'hourly', 'monthly', 'yearly'
  },
  department: String,
  experienceLevel: String, // 'entry', 'mid', 'senior', 'executive'
  skills: [String],
  status: String, // 'draft', 'active', 'paused', 'closed', 'archived'
  publishedAt: Date,
  expiresAt: Date,
  applicationCount: Number,
  viewCount: Number,
  screeningCriteria: {
    minExperience: Number,
    requiredSkills: [String],
    educationLevel: String
  },
  aiMatchingEnabled: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **Application Model**
```javascript
{
  jobPostingId: ObjectId,
  applicantId: ObjectId,
  organizationId: ObjectId,
  resumeId: ObjectId,
  status: String, // 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'
  stage: String, // custom pipeline stage
  appliedAt: Date,
  screeningScore: Number, // AI-generated match score
  recruiterNotes: [{
    recruiterId: ObjectId,
    note: String,
    createdAt: Date
  }],
  tags: [String],
  rating: Number, // 1-5 stars
  interviewSchedule: [{
    type: String, // 'phone', 'video', 'onsite'
    scheduledAt: Date,
    duration: Number, // minutes
    interviewerId: ObjectId,
    meetingLink: String,
    status: String // 'scheduled', 'completed', 'cancelled'
  }],
  offer: {
    amount: Number,
    currency: String,
    startDate: Date,
    status: String // 'pending', 'accepted', 'rejected'
  },
  source: String, // 'platform', 'referral', 'external'
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **Message Model**
```javascript
{
  conversationId: ObjectId,
  senderId: ObjectId,
  senderRole: String, // 'recruiter', 'applicant'
  recipientId: ObjectId,
  recipientRole: String,
  subject: String,
  body: String,
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  readAt: Date,
  createdAt: Date
}
```

#### 6. **Conversation Model**
```javascript
{
  participants: [{
    userId: ObjectId,
    role: String,
    organizationId: ObjectId // null for applicants
  }],
  relatedTo: {
    type: String, // 'application', 'general'
    applicationId: ObjectId // if type is 'application'
  },
  lastMessageAt: Date,
  unreadCount: {
    [userId]: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 7. **Interview Model**
```javascript
{
  applicationId: ObjectId,
  jobPostingId: ObjectId,
  applicantId: ObjectId,
  organizationId: ObjectId,
  interviewers: [{
    userId: ObjectId,
    role: String // 'primary', 'secondary'
  }],
  type: String, // 'phone', 'video', 'onsite', 'panel'
  scheduledAt: Date,
  duration: Number, // minutes
  timezone: String,
  location: String, // physical or video link
  meetingLink: String,
  status: String, // 'scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'
  feedback: [{
    interviewerId: ObjectId,
    rating: Number,
    notes: String,
    recommendation: String, // 'hire', 'maybe', 'no-hire'
    submittedAt: Date
  }],
  reminders: [{
    sentAt: Date,
    type: String // 'email', 'sms'
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 8. **Analytics Model**
```javascript
{
  organizationId: ObjectId,
  date: Date,
  metrics: {
    jobs: {
      posted: Number,
      active: Number,
      closed: Number,
      views: Number
    },
    applications: {
      received: Number,
      byStatus: {
        applied: Number,
        screening: Number,
        interview: Number,
        offer: Number,
        rejected: Number
      },
      averageTimeToHire: Number // days
    },
    candidates: {
      new: Number,
      inPipeline: Number,
      hired: Number
    },
    team: {
      activeRecruiters: Number,
      messagesSent: Number,
      interviewsScheduled: Number
    }
  },
  createdAt: Date
}
```

### Updated Models

#### **User Model** (Extended)
```javascript
{
  // ... existing fields ...
  userType: String, // 'applicant', 'recruiter', 'both'
  organizationId: ObjectId, // null for applicants
  applicantProfile: {
    skills: [String],
    experience: Number, // years
    education: [Object],
    preferredLocations: [String],
    preferredJobTypes: [String],
    salaryExpectation: {
      min: Number,
      currency: String
    },
    availability: String, // 'immediate', '2-weeks', '1-month', 'flexible'
    linkedInUrl: String,
    portfolioUrl: String,
    githubUrl: String
  },
  recruiterProfile: {
    department: String,
    specialization: [String],
    hiringGoals: Number, // positions to fill
    currentPipeline: Number
  }
}
```

#### **Resume Model** (Extended)
```javascript
{
  // ... existing fields ...
  isApplicationResume: Boolean, // used in job applications
  applications: [ObjectId], // application IDs using this resume
  aiParsedData: {
    skills: [String],
    experience: Number,
    education: [Object],
    certifications: [String]
  }
}
```

---

## 🔄 User Workflows

### Recruiter Workflow

#### 1. **Onboarding & Setup**
```
Registration → Email Verification → Organization Creation/Join → 
Profile Setup → Team Invitation → Subscription Selection → Dashboard
```

**Steps:**
1. Recruiter registers with email/password
2. Receives verification email
3. Chooses to create new organization or join existing
4. If creating: Sets organization name, industry, size
5. Completes recruiter profile (department, specialization)
6. Invites team members (optional)
7. Selects subscription plan
8. Completes payment
9. Redirected to recruiter dashboard

#### 2. **Job Posting Workflow**
```
Create Job → Fill Details → Set Screening Criteria → 
Review & Publish → Monitor Applications → Screen Candidates
```

**Detailed Steps:**
1. Click "Post New Job" from dashboard
2. Fill job details form:
   - Job title, description, requirements
   - Location (remote/hybrid/onsite)
   - Employment type, salary range
   - Required skills, experience level
   - Department, team
3. Configure screening criteria:
   - Minimum experience
   - Required skills
   - Education requirements
   - Enable AI matching
4. Preview job posting
5. Save as draft or publish immediately
6. Job appears in active listings
7. Receive notifications for new applications

#### 3. **Candidate Screening Workflow**
```
View Applications → AI Match Scores → Filter & Sort → 
Review Resumes → Add Notes/Tags → Move to Next Stage
```

**Detailed Steps:**
1. View applications in pipeline view
2. See AI-generated match scores
3. Filter by status, score, skills, experience
4. Click candidate to view full profile
5. Review resume, application answers
6. Add internal notes (visible to team)
7. Tag candidate (e.g., "Strong Technical", "Cultural Fit")
8. Rate candidate (1-5 stars)
9. Move to next stage:
   - Screening → Interview
   - Interview → Offer
   - Any stage → Rejected
10. Send automated status update to candidate

#### 4. **Interview Scheduling Workflow**
```
Select Candidate → Choose Interview Type → 
Select Interviewers → Pick Time Slot → Send Invitation → 
Candidate Confirms → Reminders Sent → Conduct Interview → 
Submit Feedback
```

**Detailed Steps:**
1. From candidate profile, click "Schedule Interview"
2. Select interview type (phone/video/onsite)
3. Choose interviewers from team
4. Pick available time slot (calendar integration)
5. Add interview details (duration, location/link)
6. System sends invitation to candidate
7. Candidate receives email with calendar invite
8. Candidate confirms or requests reschedule
9. System sends reminders (24h, 1h before)
10. Interview conducted
11. Interviewers submit feedback and rating
12. System updates application status based on feedback

#### 5. **Team Collaboration Workflow**
```
Invite Team Member → Assign Role → Set Permissions → 
Share Candidates → Collaborate on Hiring → View Team Activity
```

**Detailed Steps:**
1. Admin/Manager clicks "Invite Team Member"
2. Enters email and selects role
3. System sends invitation email
4. New member accepts and creates account
5. Assigned to department/team
6. Team members can:
   - Share candidates with each other
   - Add collaborative notes
   - Assign candidates to specific recruiters
   - View team pipeline
   - Generate team reports

### Applicant Workflow

#### 1. **Onboarding & Profile Setup**
```
Registration → Email Verification → Choose User Type → 
Build Resume → Complete Profile → Browse Jobs
```

**Detailed Steps:**
1. Applicant registers with email/password
2. Receives verification email
3. Chooses "I'm looking for jobs" during onboarding
4. Guided through resume builder:
   - Personal information
   - Work experience
   - Education
   - Skills
   - Certifications
5. Completes applicant profile:
   - Preferred job types
   - Preferred locations
   - Salary expectations
   - Availability
   - Social links (LinkedIn, GitHub, Portfolio)
6. Profile is now searchable by recruiters
7. Redirected to applicant dashboard

#### 2. **Job Discovery Workflow**
```
Browse Jobs → Apply Filters → View Job Details → 
Check Match Score → Save or Apply
```

**Detailed Steps:**
1. View job feed on dashboard
2. See recommended jobs based on profile
3. Apply filters:
   - Location (remote/hybrid/onsite)
   - Job type (full-time/part-time/contract)
   - Experience level
   - Salary range
   - Industry
   - Skills
4. Click job to view details
5. See AI-generated match score
6. View company profile
7. Options:
   - Apply now (uses primary resume)
   - Save for later
   - Share job
   - Set job alert

#### 3. **Application Workflow**
```
Select Resume → Answer Questions → Review Application → 
Submit → Track Status → Receive Updates
```

**Detailed Steps:**
1. Click "Apply" on job posting
2. Select which resume to use (or create new)
3. Answer job-specific questions (if any)
4. Add cover letter (optional)
5. Review application summary
6. Submit application
7. Receive confirmation email
8. Application appears in "My Applications"
9. Status updates:
   - Applied → Screening
   - Screening → Interview
   - Interview → Offer/Rejected
10. Receive email notifications for status changes
11. View recruiter messages in application thread

#### 4. **Interview Management Workflow**
```
Receive Invitation → View Details → Accept/Reschedule → 
Prepare → Attend Interview → Wait for Feedback
```

**Detailed Steps:**
1. Receive email/SMS interview invitation
2. View interview details in dashboard:
   - Date, time, timezone
   - Interview type and location/link
   - Interviewer names
   - Job details
3. Accept invitation or request reschedule
4. If reschedule: Select alternative time slots
5. Receive calendar invite
6. Get reminders (24h, 1h before)
7. Access interview preparation tips
8. Attend interview
9. Receive thank you email
10. Wait for feedback/next steps

#### 5. **Application Tracking Workflow**
```
View All Applications → Filter by Status → 
Check Details → Message Recruiter → Update Resume
```

**Detailed Steps:**
1. View "My Applications" page
2. See all applications with current status
3. Filter by:
   - Status (applied, interview, offer, etc.)
   - Date applied
   - Company
4. Click application to view:
   - Current status and stage
   - Timeline of updates
   - Messages from recruiter
   - Interview schedule
   - Job details
5. Send message to recruiter
6. Update resume and re-apply if needed
7. Withdraw application if needed

---

## 🎨 Key Modules & Features

### Module 1: Recruiter Dashboard

**Purpose:** Central hub for recruiters to manage all hiring activities

**Key Components:**
- **Pipeline Overview**: Visual kanban board showing candidates by stage
- **Active Job Postings**: List of all active jobs with metrics
- **Recent Applications**: Latest applications with match scores
- **Team Activity Feed**: Recent actions by team members
- **Quick Stats**: Applications received, interviews scheduled, offers sent
- **Upcoming Interviews**: Calendar widget showing next interviews
- **Action Items**: Tasks requiring attention (review applications, schedule interviews)

**Features:**
- Drag-and-drop pipeline management
- Real-time updates via WebSocket
- Quick filters and search
- Export data to CSV/Excel
- Customizable dashboard widgets

**API Endpoints:**
```
GET /api/recruiter/dashboard/stats
GET /api/recruiter/dashboard/pipeline
GET /api/recruiter/dashboard/activity
GET /api/recruiter/dashboard/upcoming-interviews
```

### Module 2: Applicant Dashboard

**Purpose:** Central hub for applicants to manage job search and applications

**Key Components:**
- **Recommended Jobs**: AI-powered job recommendations
- **My Applications**: All applications with status tracking
- **Saved Jobs**: Bookmarked job postings
- **Application Status Chart**: Visual breakdown of application statuses
- **Upcoming Interviews**: Scheduled interviews calendar
- **Messages**: Unread messages from recruiters
- **Profile Completeness**: Progress indicator for profile/resume

**Features:**
- Job recommendations based on profile
- Application status timeline
- Quick apply functionality
- Resume analytics (views, downloads)
- Job alerts and notifications

**API Endpoints:**
```
GET /api/applicant/dashboard/overview
GET /api/applicant/dashboard/recommended-jobs
GET /api/applicant/dashboard/applications
GET /api/applicant/dashboard/stats
```

### Module 3: Team Management

**Purpose:** Manage organization team members, roles, and permissions

**Key Components:**
- **Team Members List**: All team members with roles and status
- **Invite Members**: Form to invite new team members
- **Role Management**: Assign and modify roles
- **Permission Settings**: Granular permission controls
- **Department Management**: Organize team by departments
- **Activity Log**: Track team member actions

**Features:**
- Bulk invite via CSV
- Role templates (Admin, Manager, Recruiter)
- Custom permission sets
- Team member activity tracking
- Department-based access control
- Export team roster

**API Endpoints:**
```
GET /api/organizations/:orgId/team
POST /api/organizations/:orgId/team/invite
PUT /api/organizations/:orgId/team/:memberId/role
DELETE /api/organizations/:orgId/team/:memberId
GET /api/organizations/:orgId/team/activity
```

### Module 4: Job Posting & Management

**Purpose:** Create, edit, and manage job postings

**Key Components:**
- **Job Creation Form**: Comprehensive form with all job details
- **Job List View**: All job postings with status and metrics
- **Job Editor**: Edit existing job postings
- **Screening Criteria Setup**: Configure AI matching parameters
- **Job Analytics**: Views, applications, conversion rates
- **Duplicate Job**: Quick way to create similar postings

**Features:**
- Rich text editor for job descriptions
- Job templates for common roles
- ATS-friendly formatting
- Multi-language support
- Job posting scheduling
- SEO optimization
- Social media sharing
- Application form builder

**API Endpoints:**
```
GET /api/jobs
POST /api/jobs
GET /api/jobs/:id
PUT /api/jobs/:id
DELETE /api/jobs/:id
POST /api/jobs/:id/duplicate
GET /api/jobs/:id/analytics
POST /api/jobs/:id/publish
POST /api/jobs/:id/pause
```

### Module 5: Candidate Screening

**Purpose:** Screen, evaluate, and manage candidates through hiring pipeline

**Key Components:**
- **Pipeline View**: Kanban board with stages
- **Candidate List**: Filterable list of all candidates
- **Candidate Profile**: Detailed candidate view
- **Resume Viewer**: PDF/document viewer with annotations
- **Screening Tools**: Scorecards, notes, tags, ratings
- **Bulk Actions**: Move multiple candidates, send emails
- **AI Matching**: Automated candidate-job matching scores

**Features:**
- AI-powered resume parsing
- Skill extraction and matching
- Experience verification
- Reference checking integration
- Candidate comparison tool
- Custom pipeline stages
- Automated screening rules
- Candidate search and filters
- Export candidate data

**API Endpoints:**
```
GET /api/applications
GET /api/applications/:id
PUT /api/applications/:id/status
POST /api/applications/:id/notes
POST /api/applications/:id/tags
POST /api/applications/:id/rating
GET /api/applications/:id/ai-match
POST /api/applications/bulk-action
```

### Module 6: Interview Scheduling

**Purpose:** Schedule, manage, and conduct interviews

**Key Components:**
- **Scheduling Calendar**: View all scheduled interviews
- **Interview Creation Form**: Schedule new interviews
- **Interview Details**: Full interview information
- **Interviewer Assignment**: Assign team members
- **Time Slot Picker**: Available time selection
- **Interview Feedback Form**: Submit post-interview feedback
- **Video Integration**: Embedded video call links

**Features:**
- Calendar integration (Google, Outlook)
- Automated timezone handling
- Interview reminder emails/SMS
- Video conferencing integration (Zoom, Teams, Meet)
- Interview feedback templates
- Panel interview support
- Interview recording (with consent)
- Rescheduling workflow
- Interview analytics

**API Endpoints:**
```
GET /api/interviews
POST /api/interviews
GET /api/interviews/:id
PUT /api/interviews/:id
DELETE /api/interviews/:id
POST /api/interviews/:id/reschedule
POST /api/interviews/:id/feedback
GET /api/interviews/calendar/:userId
```

### Module 7: Messaging & Communication

**Purpose:** Facilitate communication between recruiters and applicants

**Key Components:**
- **Inbox**: All conversations
- **Conversation Thread**: Message history
- **Message Composer**: Send new messages
- **Templates**: Pre-written message templates
- **Notifications**: Unread message indicators
- **File Attachments**: Share documents

**Features:**
- Real-time messaging (WebSocket)
- Email integration (messages sent as emails)
- SMS notifications (optional)
- Message templates library
- File sharing (resumes, documents)
- Read receipts
- Message search
- Automated messages (status updates)
- Typing indicators

**API Endpoints:**
```
GET /api/conversations
GET /api/conversations/:id
POST /api/conversations/:id/messages
PUT /api/messages/:id/read
GET /api/messages/templates
POST /api/messages/send-template
```

### Module 8: Billing & Subscription Management

**Purpose:** Manage organization subscriptions and billing

**Key Components:**
- **Subscription Overview**: Current plan and usage
- **Plan Comparison**: Available subscription tiers
- **Billing History**: Past invoices and payments
- **Payment Methods**: Manage credit cards
- **Usage Metrics**: Seats used, features used
- **Upgrade/Downgrade**: Change subscription plan
- **Invoice Management**: Download invoices

**Features:**
- Multiple subscription tiers
- Per-seat pricing
- Usage-based billing options
- Automatic invoice generation
- Payment method management
- Billing email notifications
- Prorated upgrades/downgrades
- Annual/monthly billing options
- Enterprise custom pricing

**API Endpoints:**
```
GET /api/organizations/:orgId/billing/subscription
GET /api/organizations/:orgId/billing/plans
POST /api/organizations/:orgId/billing/subscribe
PUT /api/organizations/:orgId/billing/update-plan
GET /api/organizations/:orgId/billing/invoices
GET /api/organizations/:orgId/billing/payment-methods
POST /api/organizations/:orgId/billing/payment-methods
```

### Module 9: Analytics & Reporting

**Purpose:** Track hiring metrics and generate insights

**Key Components:**
- **Dashboard Overview**: Key metrics at a glance
- **Hiring Funnel**: Visual pipeline conversion rates
- **Time-to-Hire**: Average hiring timeline
- **Source Analytics**: Where candidates come from
- **Team Performance**: Recruiter activity and success
- **Job Performance**: Best performing job postings
- **Custom Reports**: Build custom analytics
- **Export Options**: PDF, CSV, Excel exports

**Features:**
- Real-time metrics
- Historical trend analysis
- Custom date ranges
- Comparative analytics (period over period)
- Predictive analytics (AI-powered)
- Automated report generation
- Scheduled report emails
- Data visualization (charts, graphs)
- Benchmark comparisons

**API Endpoints:**
```
GET /api/analytics/overview
GET /api/analytics/hiring-funnel
GET /api/analytics/time-to-hire
GET /api/analytics/source-analytics
GET /api/analytics/team-performance
GET /api/analytics/job-performance
POST /api/analytics/custom-report
GET /api/analytics/export
```

---

## 🚀 Onboarding Flows

### Recruiter Onboarding

**Step 1: Registration**
- Email and password
- Full name
- Phone number (optional)

**Step 2: Email Verification**
- Verification email sent
- Click link to verify
- Redirected to organization setup

**Step 3: Organization Setup**
- Create new organization OR join existing
- If creating:
  - Organization name
  - Industry
  - Company size
  - Website (optional)
  - Logo upload (optional)
- If joining:
  - Enter invitation code or accept email invite

**Step 4: Role Assignment**
- If creating org: Automatically assigned Admin role
- If joining: Assigned role by inviter

**Step 5: Profile Completion**
- Department
- Job title
- Specialization areas
- Profile photo (optional)

**Step 6: Subscription Selection**
- View available plans
- Select plan (Starter/Professional/Enterprise)
- Enter payment information
- Complete subscription

**Step 7: Team Invitation (Optional)**
- Invite team members
- Assign roles
- Send invitations

**Step 8: First Job Posting (Guided)**
- Interactive tutorial
- Create first job posting
- Learn pipeline management
- Complete onboarding

**Step 9: Dashboard Access**
- Redirected to recruiter dashboard
- Tooltips for key features
- Sample data (if no real data yet)

### Applicant Onboarding

**Step 1: Registration**
- Email and password
- Full name
- User type selection ("I'm looking for jobs")

**Step 2: Email Verification**
- Verification email sent
- Click link to verify
- Redirected to resume builder

**Step 3: Resume Creation (Guided)**
- Step-by-step resume builder
- Personal information
- Work experience
- Education
- Skills
- Certifications
- Choose template
- Preview and save

**Step 4: Profile Completion**
- Preferred job types
- Preferred locations
- Salary expectations
- Availability
- Social links (LinkedIn, GitHub, Portfolio)
- Upload profile photo

**Step 5: Job Preferences**
- Industries of interest
- Skills to highlight
- Job alerts setup

**Step 6: First Job Application (Optional)**
- Browse recommended jobs
- Apply to a job (guided)
- Learn application tracking

**Step 7: Dashboard Access**
- Redirected to applicant dashboard
- See recommended jobs
- View profile completeness
- Complete onboarding

---

## 🏢 Multi-Tenant Organization Support

### Data Isolation Strategy

**Organization-Based Isolation:**
- All data scoped to `organizationId`
- Users belong to one organization (or none for applicants)
- Queries filtered by organization
- Cross-organization data access prevented

**Implementation:**
```javascript
// Middleware to ensure organization isolation
const ensureOrganizationAccess = async (req, res, next) => {
  const user = req.user;
  const orgId = req.params.orgId || req.body.organizationId;
  
  if (user.organizationId.toString() !== orgId.toString()) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  req.organizationId = orgId;
  next();
};
```

### Organization Features

**1. Custom Branding**
- Custom logo
- Brand colors
- Custom email templates
- White-label options (Enterprise)

**2. Organization Settings**
- Default job posting templates
- Custom application questions
- Workflow stages configuration
- Email signature
- Notification preferences

**3. Organization Analytics**
- Organization-wide metrics
- Department-level analytics
- Team performance tracking
- Custom reports

**4. Organization Billing**
- Centralized billing
- Seat management
- Usage tracking
- Invoice generation

### Scaling Considerations

**Database:**
- Index on `organizationId` for all collections
- Sharding strategy for large organizations
- Read replicas for analytics queries

**Caching:**
- Organization settings cached in Redis
- User permissions cached
- Frequently accessed data cached

**API Rate Limiting:**
- Per-organization rate limits
- Per-user rate limits
- Feature-based limits (based on subscription)

**Background Jobs:**
- Queue system for email sending
- Scheduled jobs for analytics
- Batch processing for large operations

---

## 📅 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Update User model with userType and organization fields
- [ ] Create Organization model
- [ ] Create TeamMember model
- [ ] Implement organization creation/joining
- [ ] Update authentication to support organizations
- [ ] Create basic recruiter and applicant dashboards
- [ ] Implement role-based access control

### Phase 2: Job Posting System (Weeks 5-8)
- [ ] Create JobPosting model
- [ ] Build job posting creation form
- [ ] Implement job listing page
- [ ] Add job search and filters
- [ ] Create job detail page
- [ ] Implement job editing and management
- [ ] Add job analytics

### Phase 3: Application System (Weeks 9-12)
- [ ] Create Application model
- [ ] Build application submission flow
- [ ] Implement application tracking for applicants
- [ ] Create recruiter pipeline view
- [ ] Add candidate screening tools
- [ ] Implement AI matching
- [ ] Add notes, tags, and ratings

### Phase 4: Communication (Weeks 13-16)
- [ ] Create Message and Conversation models
- [ ] Build messaging interface
- [ ] Implement real-time messaging (WebSocket)
- [ ] Add email integration
- [ ] Create message templates
- [ ] Implement notifications

### Phase 5: Interview Scheduling (Weeks 17-20)
- [ ] Create Interview model
- [ ] Build scheduling interface
- [ ] Integrate calendar APIs
- [ ] Implement video conferencing
- [ ] Add interview feedback system
- [ ] Create interview reminders

### Phase 6: Team Management (Weeks 21-24)
- [ ] Build team member management UI
- [ ] Implement invitation system
- [ ] Create role and permission management
- [ ] Add department organization
- [ ] Implement activity logging
- [ ] Build team analytics

### Phase 7: Analytics & Reporting (Weeks 25-28)
- [ ] Create Analytics model
- [ ] Build analytics dashboard
- [ ] Implement data visualization
- [ ] Create custom report builder
- [ ] Add export functionality
- [ ] Implement scheduled reports

### Phase 8: Billing & Subscriptions (Weeks 29-32)
- [ ] Integrate Stripe for payments
- [ ] Build subscription management UI
- [ ] Implement plan upgrades/downgrades
- [ ] Create invoice system
- [ ] Add usage tracking
- [ ] Implement billing notifications

### Phase 9: Advanced Features (Weeks 33-36)
- [ ] AI-powered resume parsing
- [ ] Advanced candidate matching
- [ ] Automated screening rules
- [ ] Integration APIs (ATS systems)
- [ ] Mobile app (optional)
- [ ] Advanced analytics (predictive)

### Phase 10: Polish & Launch (Weeks 37-40)
- [ ] Performance optimization
- [ ] Security audit
- [ ] User testing
- [ ] Documentation
- [ ] Marketing site updates
- [ ] Beta launch
- [ ] Production launch

---

## 🔐 Security Considerations

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement data retention policies
- GDPR compliance features
- Data export and deletion capabilities

### Access Control
- Role-based access control (RBAC)
- Organization-level data isolation
- API rate limiting
- IP whitelisting (Enterprise)
- Two-factor authentication (2FA)

### Compliance
- GDPR compliance
- SOC 2 preparation
- Data processing agreements
- Privacy policy integration
- Terms of service enforcement

---

## 📊 Success Metrics

### Recruiter Metrics
- Time-to-hire reduction
- Application-to-hire conversion rate
- Candidate quality scores
- Team productivity metrics
- Cost-per-hire

### Applicant Metrics
- Application success rate
- Interview conversion rate
- Time-to-application
- Profile completeness
- Resume views

### Platform Metrics
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User retention rate
- Subscription conversion rate
- Net Promoter Score (NPS)

---

## 🎯 Next Steps

1. **Review and prioritize features** based on business goals
2. **Set up development environment** with new database models
3. **Create detailed technical specifications** for each module
4. **Design UI/UX mockups** for new pages
5. **Set up project management** (Jira, Trello, etc.)
6. **Begin Phase 1 implementation**

---

This comprehensive guide provides the foundation for transforming ResumeIQ into a full-featured recruitment SaaS platform. Each module can be developed incrementally, allowing for iterative improvements and user feedback integration.


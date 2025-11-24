# Role-Based Pages Organization

**Date:** January 2025  
**Purpose:** Reorganize pages folder based on user roles for better maintainability and clarity

---

## ✅ Completed Changes

### New Folder Structure

The pages folder has been reorganized into role-based folders:

```
pages/
├── applicant/          # Job seeker/applicant pages
│   ├── ApplicantDashboard.jsx
│   ├── Builder.jsx
│   ├── ExistingResumeBuilder.jsx
│   ├── ResumeBuilder.jsx
│   ├── Profile.jsx
│   ├── Settings.jsx
│   ├── PurchaseCredits.jsx
│   ├── Subscription.jsx
│   ├── Dashboard.jsx (index)
│   └── forms/          # Resume form components
│
├── recruiter/          # Recruiter-specific pages
│   ├── RecruiterDashboard.jsx
│   ├── RecruiterLayout.jsx
│   ├── JobsList.jsx
│   ├── CandidatesPipeline.jsx
│   ├── InterviewsCalendar.jsx
│   ├── MessagesInbox.jsx
│   ├── RecruiterApplications.jsx
│   └── AnalyticsDashboard.jsx
│
├── organization/       # Team/Organization management
│   ├── TeamManagement.jsx
│   └── OrganizationSettings.jsx
│
├── admin/              # Super admin pages
│   ├── AdminLayout.jsx
│   ├── CreateAccounts.jsx
│   ├── Recruiters.jsx
│   └── PlatformAnalytics.jsx
│
├── auth/               # Authentication pages (shared)
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── VerifyEmail.jsx
│   └── ApplyAsRecruiter.jsx
│
├── public/             # Public pages (shared)
│   ├── Home.jsx
│   ├── NotFound.jsx
│   └── RecruiterBenefits.jsx
│
├── constants/          # Shared constants
│   └── resumeBuilderConstants.js
│
└── Layout.jsx          # Main layout component
```

---

## 📋 Role-Based Organization

### Applicant (Job Seeker)
- **Dashboard:** Main applicant dashboard
- **Resume Building:** Builder, ResumeBuilder, ExistingResumeBuilder
- **Profile & Settings:** Profile, Settings
- **Credits & Subscription:** PurchaseCredits, Subscription

### Recruiter
- **Dashboard:** RecruiterDashboard with analytics
- **Job Management:** JobsList, CandidatesPipeline
- **Communication:** MessagesInbox, InterviewsCalendar
- **Applications:** RecruiterApplications
- **Layout:** RecruiterLayout (with sidebar)

### Organization
- **Team Management:** TeamManagement
- **Settings:** OrganizationSettings

### Super Admin
- **Platform Management:** CreateAccounts, Recruiters
- **Analytics:** PlatformAnalytics
- **Layout:** AdminLayout (with sidebar)

---

## 🔄 Import Path Updates

All import paths have been updated to reflect the new structure:

### Before:
```javascript
import Dashboard from './pages/dashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
```

### After:
```javascript
import Dashboard from './pages/applicant/Dashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
```

---

## ✅ Benefits

1. **Clear Role Separation:** Easy to identify which pages belong to which role
2. **Better Maintainability:** Related pages are grouped together
3. **Scalability:** Easy to add new role-specific pages
4. **Developer Experience:** Predictable file locations based on user role
5. **Code Organization:** Logical grouping improves code navigation

---

## 📝 Notes

- Forms folder moved to `applicant/forms/` as they're primarily used for resume building
- Constants moved to `pages/constants/` for shared access
- Layout components remain at root level for shared use
- Auth and public pages remain separate as they're shared across roles


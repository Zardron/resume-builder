# Role-Based Permissions Reference

This document outlines the permissions for each role based on the SAAS_PLATFORM_DEVELOPMENT_GUIDE.md.

## Super Admin
**Platform-wide access, manages all organizations**

### Can Access:
- ✅ Dashboard (platform-wide)
- ✅ Analytics (platform-wide)
- ✅ Team Management (all organizations)
- ✅ Organization Management (all organizations)
- ✅ System Configuration
- ✅ User Management (platform-wide)

### Cannot Access:
- ❌ Job Postings
- ❌ Candidates
- ❌ Interviews
- ❌ Messages (recruiter-applicant)
- ❌ Billing (organization-specific)

---

## Organization Admin
**Company/team owner, manages organization settings**

### Can Access:
- ✅ Dashboard
- ✅ Job Postings (create/edit/delete all)
- ✅ Candidates (access all in organization)
- ✅ Interviews (schedule and manage)
- ✅ Messages (send to candidates)
- ✅ Analytics (organization-wide)
- ✅ Team Management (invite/remove members, assign roles)
- ✅ Organization Settings (manage profile, branding)
- ✅ Billing (manage subscriptions and payments)

---

## Recruiter Manager
**Team leadership role, manages recruiters in team**

### Can Access:
- ✅ Dashboard
- ✅ Job Postings (create/edit, requires approval)
- ✅ Candidates (access all in team pipelines)
- ✅ Interviews (schedule and manage)
- ✅ Messages (send to candidates)
- ✅ Analytics (team reports)
- ✅ Team Management (manage assigned recruiters)

### Cannot Access:
- ❌ Organization Settings
- ❌ Billing

---

## Recruiter
**Primary hiring role, posts and manages jobs**

### Can Access:
- ✅ Dashboard
- ✅ Job Postings (create/edit own)
- ✅ Candidates (view assigned)
- ✅ Interviews (schedule)
- ✅ Messages (send to candidates)
- ✅ Analytics (own activity)

### Cannot Access:
- ❌ Team Management
- ❌ Organization Settings
- ❌ Billing

---

## Applicant
**Job seeker role**

### Can Access:
- ✅ Dashboard
- ✅ Resume Builder
- ✅ Browse Jobs
- ✅ Apply to Jobs
- ✅ My Applications (track status)
- ✅ Interviews (view and manage own)
- ✅ Messages (send to recruiters)
- ✅ Credits & Subscription

### Cannot Access:
- ❌ Job Postings (create/edit)
- ❌ Candidates
- ❌ Team Management
- ❌ Organization Settings
- ❌ Billing


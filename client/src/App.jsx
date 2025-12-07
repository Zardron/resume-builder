import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalBackground from './components/common/GlobalBackground';
import ToastContainer from './components/ui/ToastContainer';
import Breadcrumbs from './components/layout/Breadcrumbs';
import LoadingSkeleton from './components/ui/LoadingSkeleton';
import ProtectedRoute from './components/routes/ProtectedRoute';
import GuestRoute from './components/routes/GuestRoute';
import MaintenanceModeWrapper from './components/common/MaintenanceModeWrapper';
import RouteTracker from './components/common/RouteTracker';
import UserActivityTracker from './components/common/UserActivityTracker';
import { SidebarProvider } from './contexts/SidebarContext';
import { AppProvider } from './contexts/AppContext';
import 'animate.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/public/Home'));
const Layout = lazy(() => import('./pages/Layout'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/applicant/Dashboard'));
const Builder = lazy(() => import('./pages/applicant/Builder'));
const PurchaseCredits = lazy(() => import('./pages/applicant/PurchaseCredits'));
const Subscription = lazy(() => import('./pages/applicant/Subscription'));
const UpgradeSubscription = lazy(() => import('./pages/applicant/UpgradeSubscription'));
const Profile = lazy(() => import('./pages/applicant/Profile'));
const Settings = lazy(() => import('./pages/applicant/Settings'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const RecruiterBenefits = lazy(() => import('./pages/public/RecruiterBenefits'));
const ContactSupport = lazy(() => import('./pages/public/ContactSupport'));
const ApplyAsRecruiter = lazy(() => import('./pages/auth/ApplyAsRecruiter'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Recruiter pages
const RecruiterDashboard = lazy(() => import('./pages/recruiter/RecruiterDashboard'));
const JobsList = lazy(() => import('./pages/recruiter/JobsList'));
const CreateJob = lazy(() => import('./pages/recruiter/CreateJob'));
const JobDetail = lazy(() => import('./pages/recruiter/JobDetail'));
const EditJob = lazy(() => import('./pages/recruiter/EditJob'));
const CandidatesPipeline = lazy(() => import('./pages/recruiter/CandidatesPipeline'));
const CandidateDetail = lazy(() => import('./pages/recruiter/CandidateDetail'));
const InterviewsCalendar = lazy(() => import('./pages/recruiter/InterviewsCalendar'));
const ScheduleInterview = lazy(() => import('./pages/recruiter/ScheduleInterview'));
const InterviewDetail = lazy(() => import('./pages/recruiter/InterviewDetail'));
const MessagesInbox = lazy(() => import('./pages/recruiter/MessagesInbox'));
const Conversation = lazy(() => import('./pages/recruiter/Conversation'));
const AnalyticsDashboard = lazy(() => import('./pages/recruiter/AnalyticsDashboard'));
const RecruiterApplications = lazy(() => import('./pages/recruiter/RecruiterApplications'));
const RecruiterLayout = lazy(() => import('./pages/recruiter/RecruiterLayout'));
const Billing = lazy(() => import('./pages/recruiter/Billing'));

// Organization pages
const TeamManagement = lazy(() => import('./pages/organization/TeamManagement'));
const OrganizationSettings = lazy(() => import('./pages/organization/OrganizationSettings'));

// Super Admin pages
const PlatformAnalytics = lazy(() => import('./pages/admin/PlatformAnalytics'));
const Recruiters = lazy(() => import('./pages/admin/Recruiters'));
const SystemConfiguration = lazy(() => import('./pages/admin/SystemConfiguration'));
const CreateRecruiterAccount = lazy(() => import('./pages/admin/CreateRecruiterAccount'));
const CreateTeamOrganizationAccount = lazy(() => import('./pages/admin/CreateTeamOrganizationAccount'));
const SuperAdminLogin = lazy(() => import('./pages/admin/SuperAdminLogin'));
const LoginAttempts = lazy(() => import('./pages/admin/LoginAttempts'));
const SecurityLogs = lazy(() => import('./pages/admin/SecurityLogs'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const ClientLogs = lazy(() => import('./pages/admin/ClientLogs'));
const LogManagement = lazy(() => import('./pages/admin/LogManagement'));

// Applicant pages
const ApplicantDashboard = lazy(() => import('./pages/applicant/ApplicantDashboard'));
const BrowseJobs = lazy(() => import('./pages/applicant/BrowseJobs'));
const ApplicantJobDetail = lazy(() => import('./pages/applicant/JobDetail'));
const MyApplications = lazy(() => import('./pages/applicant/MyApplications'));
const ApplicationDetail = lazy(() => import('./pages/applicant/ApplicationDetail'));
const MyInterviews = lazy(() => import('./pages/applicant/MyInterviews'));
const ApplicantInterviewDetail = lazy(() => import('./pages/applicant/InterviewDetail'));
const Messages = lazy(() => import('./pages/applicant/Messages'));
const ApplicantConversation = lazy(() => import('./pages/applicant/Conversation'));
const HelpSupport = lazy(() => import('./pages/applicant/HelpSupport'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSkeleton type="default" className="w-64" />
  </div>
);

const App = () => (
  <SidebarProvider>
    <AppProvider>
      <GlobalBackground />
      <ToastContainer />
      <MaintenanceModeWrapper>
        <RouteTracker />
        <UserActivityTracker />
        <Suspense fallback={<PageLoader />}>
        <Routes>
      <Route path="/" element={
        <GuestRoute>
          <Home />
        </GuestRoute>
      } />
      
      {/* Main Dashboard - routes to appropriate dashboard based on role */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="builder" element={
          <ProtectedRoute>
            <Builder />
          </ProtectedRoute>
        } />
        <Route path="purchase" element={
          <ProtectedRoute>
            <PurchaseCredits />
          </ProtectedRoute>
        } />
        <Route path="subscription" element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        } />
        <Route path="subscription/upgrade" element={
          <ProtectedRoute>
            <UpgradeSubscription />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Route>

      {/* Recruiter Dashboard with Sidebar */}
      <Route path="/dashboard/recruiter" element={<RecruiterLayout />}>
        <Route index element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } />
        {/* Job-related routes */}
        <Route path="jobs" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <JobsList />
          </ProtectedRoute>
        } />
        <Route path="jobs/new" element={
          <ProtectedRoute allowedRoles={['admin', 'manager', 'recruiter']} allowedUserTypes={['recruiter', 'both']}>
            <CreateJob />
          </ProtectedRoute>
        } />
        <Route path="jobs/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <JobDetail />
          </ProtectedRoute>
        } />
        <Route path="jobs/:id/edit" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <EditJob />
          </ProtectedRoute>
        } />
        {/* Candidate-related routes */}
        <Route path="candidates" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <CandidatesPipeline />
          </ProtectedRoute>
        } />
        <Route path="candidates/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <CandidateDetail />
          </ProtectedRoute>
        } />
        {/* Interview-related routes */}
        <Route path="interviews" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <InterviewsCalendar />
          </ProtectedRoute>
        } />
        <Route path="interviews/new" element={
          <ProtectedRoute allowedRoles={['admin', 'manager', 'recruiter']} allowedUserTypes={['recruiter', 'both']}>
            <ScheduleInterview />
          </ProtectedRoute>
        } />
        <Route path="interviews/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <InterviewDetail />
          </ProtectedRoute>
        } />
        {/* Message-related routes */}
        <Route path="messages" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <MessagesInbox />
          </ProtectedRoute>
        } />
        <Route path="messages/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <Conversation />
          </ProtectedRoute>
        } />
        {/* Analytics */}
        <Route path="analytics" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        } />
        {/* Team - Available to admins and managers */}
        <Route path="team" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <TeamManagement />
          </ProtectedRoute>
        } />
        {/* Organization - Available to admins only */}
        <Route path="organization" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <OrganizationSettings />
          </ProtectedRoute>
        } />
        {/* Billing - Only for organization admins */}
        <Route path="billing" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Billing />
          </ProtectedRoute>
        } />
      </Route>

      {/* Super Admin Dashboard with Sidebar */}
      <Route path="/dashboard/admin" element={<Layout />}>
        <Route element={<AdminLayout />}>
          <Route index element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } />
          {/* Analytics - Platform analytics for super admin */}
          <Route path="analytics" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          } />
          {/* Team - Available to super admins */}
          <Route path="team" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <TeamManagement />
            </ProtectedRoute>
          } />
          {/* Organization - Available to super admins */}
          <Route path="organization" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <OrganizationSettings />
            </ProtectedRoute>
          } />
          {/* Create Accounts - Super Admin only */}
          <Route path="create-accounts" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <CreateRecruiterAccount />
            </ProtectedRoute>
          } />
          {/* Recruiters - Super Admin only */}
          <Route path="recruiters" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <Recruiters />
            </ProtectedRoute>
          } />
          {/* Recruiter Applications - Super Admin only */}
          <Route path="recruiter-applications" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <RecruiterApplications />
            </ProtectedRoute>
          } />
          {/* System Configuration - Super Admin only */}
          <Route path="settings" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SystemConfiguration />
            </ProtectedRoute>
          } />
          {/* Login Attempts - Super Admin only */}
          <Route path="login-attempts" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <LoginAttempts />
            </ProtectedRoute>
          } />
          {/* Security Logs - Super Admin only */}
          <Route path="security-logs" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SecurityLogs />
            </ProtectedRoute>
          } />
          {/* Audit Logs - Super Admin only */}
          <Route path="audit-logs" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          {/* Client Logs - Super Admin only */}
            <Route path="client-logs" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <ClientLogs />
              </ProtectedRoute>
            } />
            <Route path="log-management" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <LogManagement />
              </ProtectedRoute>
            } />
          {/* Create Recruiter Account - Super Admin only */}
          <Route path="create-recruiter-account" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <CreateRecruiterAccount />
            </ProtectedRoute>
          } />
          {/* Create Team Organization Account - Super Admin only */}
          <Route path="create-team-organization-account" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <CreateTeamOrganizationAccount />
            </ProtectedRoute>
          } />
        </Route>
      </Route>

      {/* Applicant Dashboard */}
      <Route path="/dashboard/applicant" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <ApplicantDashboard />
          </ProtectedRoute>
        } />
        <Route path="jobs" element={
          <ProtectedRoute>
            <BrowseJobs />
          </ProtectedRoute>
        } />
        <Route path="jobs/:id" element={
          <ProtectedRoute>
            <ApplicantJobDetail />
          </ProtectedRoute>
        } />
        <Route path="applications" element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        } />
        <Route path="applications/:id" element={
          <ProtectedRoute>
            <ApplicationDetail />
          </ProtectedRoute>
        } />
        <Route path="interviews" element={
          <ProtectedRoute>
            <MyInterviews />
          </ProtectedRoute>
        } />
        <Route path="interviews/:id" element={
          <ProtectedRoute>
            <ApplicantInterviewDetail />
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="messages/:id" element={
          <ProtectedRoute>
            <ApplicantConversation />
          </ProtectedRoute>
        } />
        <Route path="support" element={
          <ProtectedRoute>
            <HelpSupport />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/sign-in" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />
      <Route path="/admin-login" element={<SuperAdminLogin />} />
      <Route path="/sign-up" element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      } />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/recruiter-benefits" element={<RecruiterBenefits />} />
      <Route path="/contact-support" element={<ContactSupport />} />
      <Route path="/apply-recruiter" element={<ApplyAsRecruiter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
    </MaintenanceModeWrapper>
    </AppProvider>
  </SidebarProvider>
);

export default App;

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalBackground from './components/GlobalBackground';
import ToastContainer from './components/ToastContainer';
import Breadcrumbs from './components/Breadcrumbs';
import LoadingSkeleton from './components/LoadingSkeleton';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import { SidebarProvider } from './contexts/SidebarContext';
import 'animate.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Layout = lazy(() => import('./pages/Layout'));
const AdminLayout = lazy(() => import('./pages/dashboard/AdminLayout'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Builder = lazy(() => import('./pages/dashboard/Builder'));
const PurchaseCredits = lazy(() => import('./pages/dashboard/PurchaseCredits'));
const Subscription = lazy(() => import('./pages/dashboard/Subscription'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const RecruiterBenefits = lazy(() => import('./pages/RecruiterBenefits'));
const ApplyAsRecruiter = lazy(() => import('./pages/ApplyAsRecruiter'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Recruiter/Admin pages
const RecruiterDashboard = lazy(() => import('./pages/dashboard/RecruiterDashboard'));
const JobsList = lazy(() => import('./pages/dashboard/JobsList'));
const CandidatesPipeline = lazy(() => import('./pages/dashboard/CandidatesPipeline'));
const InterviewsCalendar = lazy(() => import('./pages/dashboard/InterviewsCalendar'));
const MessagesInbox = lazy(() => import('./pages/dashboard/MessagesInbox'));
const AnalyticsDashboard = lazy(() => import('./pages/dashboard/AnalyticsDashboard'));
const PlatformAnalytics = lazy(() => import('./pages/dashboard/PlatformAnalytics'));
const TeamManagement = lazy(() => import('./pages/dashboard/TeamManagement'));
const OrganizationSettings = lazy(() => import('./pages/dashboard/OrganizationSettings'));
const CreateAccounts = lazy(() => import('./pages/dashboard/CreateAccounts'));
const Recruiters = lazy(() => import('./pages/dashboard/Recruiters'));
const RecruiterApplications = lazy(() => import('./pages/dashboard/RecruiterApplications'));
const RecruiterLayout = lazy(() => import('./pages/dashboard/RecruiterLayout'));

// Applicant pages
const ApplicantDashboard = lazy(() => import('./pages/dashboard/ApplicantDashboard'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSkeleton type="default" className="w-64" />
  </div>
);

const App = () => (
  <SidebarProvider>
    <GlobalBackground />
    <ToastContainer />
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
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <div>Create Job Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="jobs/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <div>Job Detail Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="jobs/:id/edit" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <div>Edit Job Page (TODO)</div>
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
            <div>Candidate Detail Page (TODO)</div>
          </ProtectedRoute>
        } />
        {/* Interview-related routes */}
        <Route path="interviews" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <InterviewsCalendar />
          </ProtectedRoute>
        } />
        <Route path="interviews/new" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <div>Schedule Interview Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="interviews/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']} allowedUserTypes={['recruiter', 'both']}>
            <div>Interview Detail Page (TODO)</div>
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
            <div>Conversation Page (TODO)</div>
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
            <div>Billing Page (TODO)</div>
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
              <CreateAccounts />
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
            <div>Browse Jobs Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="jobs/:id" element={
          <ProtectedRoute>
            <div>Job Detail Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="applications" element={
          <ProtectedRoute>
            <div>My Applications Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="applications/:id" element={
          <ProtectedRoute>
            <div>Application Detail Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="interviews" element={
          <ProtectedRoute>
            <div>My Interviews Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="interviews/:id" element={
          <ProtectedRoute>
            <div>Interview Detail Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute>
            <div>Messages Page (TODO)</div>
          </ProtectedRoute>
        } />
        <Route path="messages/:id" element={
          <ProtectedRoute>
            <div>Conversation Page (TODO)</div>
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/sign-in" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />
      <Route path="/sign-up" element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      } />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/recruiter-benefits" element={<RecruiterBenefits />} />
      <Route path="/apply-recruiter" element={<ApplyAsRecruiter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  </SidebarProvider>
);

export default App;

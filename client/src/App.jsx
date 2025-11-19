import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalBackground from './components/GlobalBackground';
import ToastContainer from './components/ToastContainer';
import Breadcrumbs from './components/Breadcrumbs';
import LoadingSkeleton from './components/LoadingSkeleton';
import 'animate.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Layout = lazy(() => import('./pages/Layout'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Builder = lazy(() => import('./pages/dashboard/Builder'));
const PurchaseCredits = lazy(() => import('./pages/dashboard/PurchaseCredits'));
const Subscription = lazy(() => import('./pages/dashboard/Subscription'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSkeleton type="default" className="w-64" />
  </div>
);

const App = () => (
  <>
    <GlobalBackground />
    <ToastContainer />
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="builder" element={<Builder />} />
        <Route path="purchase" element={<PurchaseCredits />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  </>
);

export default App;

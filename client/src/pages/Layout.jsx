import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import SkipToContent from '../components/SkipToContent';
import BackgroundEffects from '../components/BackgroundEffects';

const Layout = () => (
  <div className="min-h-screen flex flex-col relative">
    <SkipToContent />
    <BackgroundEffects />
    <Navbar />
    <main id="main-content" className="flex-1 relative z-10 pt-[64px]" role="main" tabIndex={-1}>
      <Breadcrumbs />
      <div className="w-full">
      <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

export default Layout;

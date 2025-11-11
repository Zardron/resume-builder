import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Dashboard from './pages/dashboard';
import Builder from './pages/dashboard/Builder';
import PurchaseCredits from './pages/dashboard/PurchaseCredits';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import GlobalBackground from './components/GlobalBackground';
import 'animate.css';

const App = () => (
  <>
    <GlobalBackground />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="builder" element={<Builder />} />
        <Route path="purchase" element={<PurchaseCredits />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
    </Routes>
  </>
);

export default App;

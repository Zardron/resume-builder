import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Dashboard from './pages/dashboard';
import Builder from './pages/dashboard/Builder';
import PurchaseCredits from './pages/dashboard/PurchaseCredits';
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
      </Route>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
    </Routes>
  </>
);

export default App;

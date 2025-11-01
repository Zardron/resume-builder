import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Dashboard from './pages/dashboard';
import Builder from './pages/dashboard/Builder';
import Login from './pages/Login';
import Register from './pages/Register';
import 'animate.css';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="builder" element={<Builder />} />
    </Route>
    <Route path="/sign-in" element={<Login />} />
    <Route path="/sign-up" element={<Register />} />
  </Routes>
);

export default App;

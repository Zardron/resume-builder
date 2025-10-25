/**
 * Main Application Router
 * 
 * Created by: Zardron Angelo Pesquera
 * Copyright (c) 2025 - All rights reserved
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/dashboard";
import Builder from "./pages/dashboard/Builder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "animate.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="builder" element={<Builder />} />
      </Route>
      <Route path="/view/:resumeId" element={<Preview />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
    </Routes>
  );
};

export default App;

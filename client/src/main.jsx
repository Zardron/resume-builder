/**
 * Resume Builder Application
 * 
 * Created by: Zardron Angelo Pesquera
 * Copyright (c) 2025 - All rights reserved
 * 
 * This application helps users create professional, ATS-optimized resumes
 * using multiple customizable templates and AI-powered tools.
 */

import React from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);

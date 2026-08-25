import React from "react";
import ReactDOM from "react-dom/client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <TooltipProvider>

      <ThemeProvider>

        <AuthProvider>

          <App />

          <Toaster
            richColors
            position="top-right"
            closeButton
          />

        </AuthProvider>

      </ThemeProvider>

    </TooltipProvider>

  </React.StrictMode>
);
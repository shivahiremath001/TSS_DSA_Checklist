import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import { UserContextProvider } from "./context/UserContext.tsx";
import { ThemeContextProvider } from "./context/ThemeContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <UserContextProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-card, #0f0f0f)",
                color: "var(--fg, #d0d0d0)",
                border: "1px solid var(--border, #1a1a1a)",
                borderRadius: "0px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: "0.03em",
              },
              success: {
                iconTheme: { primary: "var(--fg-highlight, #fff)", secondary: "var(--bg, #000)" },
              },
              error: {
                iconTheme: { primary: "var(--fg-muted, #5a5a5a)", secondary: "var(--bg, #000)" },
              },
            }}
          />
        </UserContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

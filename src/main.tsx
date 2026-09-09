import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import { UserContextProvider } from "./context/UserContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0f0f0f",
              color: "#d0d0d0",
              border: "1px solid #1a1a1a",
              borderRadius: "0px",
              fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.03em",
            },
            success: {
              iconTheme: { primary: "#fff", secondary: "#000" },
            },
            error: {
              iconTheme: { primary: "#5a5a5a", secondary: "#000" },
            },
          }}
        />
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

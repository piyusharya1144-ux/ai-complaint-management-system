import React from "react";
import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";
import Chatbot from "./Chatbot";

const FONT = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

export default function Layout({ children }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      fontFamily: FONT,
      fontStretch: "normal",
    }}>
      {/* Animated orbs */}
      <div className="orb-layer">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      <Sidebar />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
        minWidth: 0,
        fontFamily: FONT,
        fontStretch: "normal",
      }}>
        <Navbar />
        <main style={{
          flex: 1,
          padding: "28px 32px",
          overflowY: "auto",
          fontFamily: FONT,
          fontStretch: "normal",
          fontSize: "14px",
        }}>
          {children}
        </main>
      </div>

      {/* Chatbot */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 40 }}>
        <Chatbot />
      </div>
    </div>
  );
}

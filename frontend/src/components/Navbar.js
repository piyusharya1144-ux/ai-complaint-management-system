import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TITLES = {
  "/dashboard":         "Dashboard Overview",
  "/submit-complaint":  "Submit a Complaint",
  "/track-complaints":  "Track Complaints",
  "/admin":             "Admin Panel",
};

export default function Navbar() {
  const { theme } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const title     = TITLES[location.pathname] || "AI Complaint System";

  return (
    <header style={{
      height:58, display:"flex", alignItems:"center",
      justifyContent:"space-between", padding:"0 28px",
      background: theme === "dark"
        ? "rgba(12,12,30,0.97)"
        : "rgba(255,255,255,0.97)",
      borderBottom:`1px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
      position:"sticky", top:0, zIndex:30,
      backdropFilter:"blur(12px)", flexShrink:0,
      transition:"background 0.3s, border-color 0.3s",
    }}>
      <div style={{
        fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800,
        background:"linear-gradient(90deg,var(--text) 40%,#f472b6 100%)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
      }}>{title}</div>

      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {[
          { label:"⊞ Dashboard", path:"/dashboard" },
          { label:"🔔 Alerts",   path:null },
          { label:"◉ Profile",  path:null },
        ].map(btn => (
          <button key={btn.label}
            onClick={() => btn.path && navigate(btn.path)}
            style={{
              padding:"6px 14px",
              background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border:`1px solid ${theme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)"}`,
              borderRadius:7, color:"var(--text2)",
              fontSize:12, fontWeight:600, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
              transition:"background 0.18s, color 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(232,33,140,0.1)"; e.currentTarget.style.color="#f9a8d4"; }}
            onMouseLeave={e => { e.currentTarget.style.background= theme==="dark"?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)"; e.currentTarget.style.color="var(--text2)"; }}
          >{btn.label}</button>
        ))}
      </div>
    </header>
  );
}

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard",         icon: "⊞", label: "Dashboard"         },
  { to: "/submit-complaint",  icon: "✚", label: "Submit Complaint"  },
  { to: "/track-complaints",  icon: "◎", label: "Track Complaints"  },
  { to: "/admin",             icon: "⚙", label: "Admin Panel", adminOnly: true },
];

export default function Sidebar() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const initials = user?.name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "??";

  return (
    <aside style={{
      width: 230, minHeight: "100vh", flexShrink: 0,
      background: theme === "dark"
        ? "linear-gradient(180deg,#0c0c1e 0%,#120f28 100%)"
        : "linear-gradient(180deg,#1e1b4b 0%,#312e81 100%)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex", flexDirection: "column",
      position: "relative", zIndex: 20,
      transition: "background 0.3s",
    }}>
      {/* Top accent */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
        background:"linear-gradient(90deg,transparent,#e8218c,transparent)" }} />

      {/* Brand + user */}
      <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{
          fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800,
          background:"linear-gradient(90deg,#fff 30%,#f472b6 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          marginBottom:14,
        }}>AI Complaints</div>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:38, height:38, borderRadius:"50%",
            background:"linear-gradient(135deg,#e8218c,#7c3aed)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:800, color:"#fff", fontSize:13, flexShrink:0,
            boxShadow:"0 0 14px rgba(232,33,140,0.5)",
          }}>{initials}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#f1f5f9" }}>{user?.name}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"capitalize" }}>{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div style={{
        background:"linear-gradient(90deg,#c0152a,#e8218c)",
        padding:"8px 18px", fontSize:10, fontWeight:800,
        letterSpacing:"0.14em", color:"#fff",
        boxShadow:"0 2px 14px rgba(232,33,140,0.35)",
      }}>NAVIGATION</div>

      {/* Nav links */}
      <nav style={{ flex:1, padding:"10px 0" }}>
        {NAV.filter(n => !n.adminOnly || user?.role === "admin").map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 18px", fontSize:13, textDecoration:"none",
              color: isActive ? "#fff" : "rgba(255,255,255,0.38)",
              fontWeight: isActive ? 700 : 400,
              borderLeft: isActive ? "3px solid #e8218c" : "3px solid transparent",
              background: isActive ? "rgba(232,33,140,0.13)" : "transparent",
              transition:"all 0.18s",
            })}
          >
            <span style={{ fontSize:16 }}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding:"12px", display:"flex", flexDirection:"column", gap:8 }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          padding:"9px", background:"rgba(255,255,255,0.06)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:8,
          color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:600,
          cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", gap:6, transition:"background 0.18s",
          fontFamily:"'DM Sans',sans-serif",
        }}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        {/* Logout */}
        <button onClick={handleLogout} style={{
          padding:"9px", background:"rgba(239,68,68,0.08)",
          border:"1px solid rgba(239,68,68,0.2)", borderRadius:8,
          color:"#ef4444", fontSize:13, fontWeight:600, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          transition:"background 0.18s", fontFamily:"'DM Sans',sans-serif",
        }}>
          ⎋ Logout
        </button>
      </div>
    </aside>
  );
}

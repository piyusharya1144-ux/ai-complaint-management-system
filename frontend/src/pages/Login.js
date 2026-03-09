import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await loginAPI(form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background: isDark ? "#07071a" : "#f0f2ff",
      position:"relative", overflow:"hidden",
      fontFamily:"'DM Sans',sans-serif",
    }}>
      {/* Orbs */}
      <div className="orb-layer">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{
        position:"fixed", top:20, right:20,
        padding:"8px 16px",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        border:`1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        borderRadius:8, color:"var(--text)", fontSize:13,
        cursor:"pointer", fontFamily:"'DM Sans',sans-serif", zIndex:10,
      }}>{isDark ? "☀️ Light" : "🌙 Dark"}</button>

      <div style={{
        width:"100%", maxWidth:420, padding:"0 20px",
        position:"relative", zIndex:1,
      }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{
            width:64, height:64, borderRadius:"50%",
            background:"linear-gradient(135deg,#e8218c,#7c3aed)",
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto 16px", fontSize:28,
            boxShadow:"0 0 32px rgba(232,33,140,0.5)",
            animation:"pulseGlow 2.8s ease-in-out infinite",
          }}>📋</div>
          <div style={{
            fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800,
            background:"linear-gradient(90deg,var(--text) 30%,#f472b6 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>AI Complaints</div>
          <div style={{ color:"var(--muted)", fontSize:14, marginTop:4 }}>Sign in to your account</div>
        </div>

        {/* Card */}
        <div style={{
          background: isDark ? "linear-gradient(135deg,rgba(22,18,50,0.95),rgba(14,12,36,0.98))" : "rgba(255,255,255,0.97)",
          border:`1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          borderRadius:16, padding:32,
          boxShadow: isDark ? "0 16px 64px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,0,0,0.1)",
          animation:"fadeUp 0.45s ease",
        }}>
          {error && (
            <div style={{
              background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
              borderRadius:8, padding:"10px 14px", color:"#ef4444",
              fontSize:13, marginBottom:18,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:6 }}>Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:6 }}>Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width:"100%", padding:"12px" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"var(--muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color:"#e8218c", fontWeight:600, textDecoration:"none" }}>Register</Link>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:16, fontSize:12, color:"var(--muted)" }}>
          Admin: register with any email and set role to "admin"
        </div>
      </div>
    </div>
  );
}

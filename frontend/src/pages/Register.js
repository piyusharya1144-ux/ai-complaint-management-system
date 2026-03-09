import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { login, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name:"", email:"", password:"", role:"user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await registerAPI(form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const f = (key) => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background: isDark ? "#07071a" : "#f0f2ff",
      position:"relative", overflow:"hidden",
      fontFamily:"'DM Sans',sans-serif",
    }}>
      <div className="orb-layer">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      <button onClick={toggleTheme} style={{
        position:"fixed", top:20, right:20, padding:"8px 16px",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        border:`1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        borderRadius:8, color:"var(--text)", fontSize:13,
        cursor:"pointer", fontFamily:"'DM Sans',sans-serif", zIndex:10,
      }}>{isDark ? "☀️ Light" : "🌙 Dark"}</button>

      <div style={{ width:"100%", maxWidth:420, padding:"0 20px", position:"relative", zIndex:1 }}>
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
          }}>Create Account</div>
          <div style={{ color:"var(--muted)", fontSize:14, marginTop:4 }}>Join the complaint management system</div>
        </div>

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
            {[
              { key:"name",     label:"Full Name",  type:"text",     placeholder:"John Doe" },
              { key:"email",    label:"Email",       type:"email",    placeholder:"you@example.com" },
              { key:"password", label:"Password",    type:"password", placeholder:"••••••••" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:6 }}>{field.label}</label>
                <input className="input" type={field.type} placeholder={field.placeholder} {...f(field.key)} required />
              </div>
            ))}

            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:6 }}>Role</label>
              <select className="input" {...f("role")}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width:"100%", padding:"12px" }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"var(--muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color:"#e8218c", fontWeight:600, textDecoration:"none" }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { submitComplaint } from "../services/api";

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:"", description:"", category:"Other", priority:"Medium" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const f = (key) => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await submitComplaint(form);
      setSuccess(true);
      setTimeout(() => navigate("/track-complaints"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="page-title">Submit a Complaint</div>
      <div className="page-subtitle">Describe your issue in detail for faster resolution</div>

      <div style={{ maxWidth:640 }}>
        {success && (
          <div style={{
            background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)",
            borderRadius:10, padding:"14px 18px", color:"#10b981",
            fontSize:14, fontWeight:600, marginBottom:20,
            display:"flex", alignItems:"center", gap:8,
            animation:"fadeUp 0.3s ease",
          }}>✅ Complaint submitted successfully! Redirecting...</div>
        )}
        {error && (
          <div style={{
            background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
            borderRadius:10, padding:"14px 18px", color:"#ef4444",
            fontSize:14, marginBottom:20,
          }}>{error}</div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gap:20 }}>

              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:6 }}>
                  Complaint Title *
                </label>
                <input className="input" placeholder="Brief summary of your issue" {...f("title")} required />
              </div>

              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:6 }}>
                  Description *
                </label>
                <textarea className="input" rows={5}
                  placeholder="Provide a detailed description of your complaint..."
                  style={{ resize:"vertical", lineHeight:1.6 }}
                  {...f("description")} required />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:6 }}>Category</label>
                  <select className="input" {...f("category")}>
                    {["Technical","Billing","Service","Product","Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:6 }}>Priority</label>
                  <select className="input" {...f("priority")}>
                    {["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Priority hint */}
              <div style={{
                padding:"12px 16px", borderRadius:8,
                background:"rgba(232,33,140,0.06)", border:"1px solid rgba(232,33,140,0.15)",
                fontSize:12, color:"var(--muted)", lineHeight:1.6,
              }}>
                💡 <strong style={{ color:"var(--text2)" }}>Priority guide:</strong> Low = minor inconvenience · Medium = affects workflow · High = significant impact · Critical = service down
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex:1, padding:"12px" }}>
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")} style={{ padding:"12px 20px" }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getComplaints } from "../services/api";

const BADGE_CLASS = { Open:"badge-open","In Progress":"badge-progress",Resolved:"badge-resolved",Closed:"badge-closed" };
const STATUS_FILTERS = ["All","Open","In Progress","Resolved","Closed"];

export default function TrackComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getComplaints().then(r => { setComplaints(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = complaints.filter(c => {
    const matchFilter = filter === "All" || c.status === filter;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <Layout>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:0 }}>
        <div>
          <div className="page-title">Track Complaints</div>
          <div className="page-subtitle">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""} submitted</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/submit-complaint")} style={{ marginTop:4 }}>
          + New Complaint
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <input className="input" placeholder="🔍 Search complaints..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth:300 }} />
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding:"8px 14px", borderRadius:8, fontSize:12, fontWeight:600,
              cursor:"pointer", border:"1px solid",
              background: filter === s ? "linear-gradient(135deg,#e8218c,#9f1060)" : "var(--input-bg)",
              borderColor: filter === s ? "transparent" : "var(--input-border)",
              color: filter === s ? "#fff" : "var(--text2)",
              transition:"all 0.18s",
              fontFamily:"'DM Sans',sans-serif",
            }}>{s} {s==="All" ? `(${complaints.length})` : `(${complaints.filter(c=>c.status===s).length})`}</button>
          ))}
        </div>
      </div>

      {loading && <div className="spinner" style={{ marginTop:40 }} />}

      {!loading && filtered.length === 0 && (
        <div className="card" style={{ textAlign:"center", padding:"40px 24px", color:"var(--muted)" }}>
          {search || filter !== "All" ? "No complaints match your filters." : "No complaints yet."}
          {!search && filter === "All" && (
            <div style={{ marginTop:12 }}>
              <button className="btn btn-primary" onClick={() => navigate("/submit-complaint")}>Submit Your First Complaint</button>
            </div>
          )}
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map((c, i) => (
          <div key={c._id} className="card" style={{ animationDelay:`${i*0.05}s`, cursor:"pointer" }}
            onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontSize:15, color:"var(--text)" }}>{c.title}</span>
                </div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>
                  {c.category} • {new Date(c.createdAt).toLocaleDateString()} • #{c._id.slice(-6).toUpperCase()}
                </div>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                <span className={`badge ${BADGE_CLASS[c.status] || "badge-open"}`}>{c.status}</span>
                <span className={`badge priority-${c.priority?.toLowerCase()}`}>{c.priority}</span>
                <span style={{ color:"var(--muted)", fontSize:12, marginLeft:4 }}>{expanded === c._id ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Expanded */}
            {expanded === c._id && (
              <div style={{
                marginTop:16, paddingTop:16,
                borderTop:"1px solid var(--border)",
                animation:"fadeUp 0.2s ease",
              }}>
                <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.7, marginBottom:12 }}>
                  {c.description}
                </div>
                {c.adminNote && (
                  <div style={{
                    background:"rgba(232,33,140,0.07)", border:"1px solid rgba(232,33,140,0.2)",
                    borderRadius:8, padding:"10px 14px", fontSize:13,
                  }}>
                    <strong style={{ color:"#e8218c" }}>Admin Note:</strong>{" "}
                    <span style={{ color:"var(--text2)" }}>{c.adminNote}</span>
                  </div>
                )}
                <div style={{ display:"flex", gap:16, marginTop:12, fontSize:12, color:"var(--muted)" }}>
                  <span>Created: {new Date(c.createdAt).toLocaleString()}</span>
                  <span>Updated: {new Date(c.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

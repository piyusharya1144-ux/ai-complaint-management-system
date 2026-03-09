import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminGetComplaints, adminUpdateComplaint, adminDeleteComplaint, adminGetStats, adminGetUsers } from "../services/api";

const BADGE_CLASS = { Open:"badge-open","In Progress":"badge-progress",Resolved:"badge-resolved",Closed:"badge-closed" };
const STATUSES    = ["Open","In Progress","Resolved","Closed"];
const PRIORITIES  = ["Low","Medium","High","Critical"];

function StatMini({ label, value, color }) {
  return (
    <div className="card" style={{ cursor:"default", textAlign:"center" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:12, color:"var(--muted)", marginTop:4, fontWeight:600 }}>{label}</div>
    </div>
  );
}

export default function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [users,      setUsers]      = useState([]);
  const [stats,      setStats]      = useState({});
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("complaints");
  const [editing,    setEditing]    = useState(null);
  const [editForm,   setEditForm]   = useState({ status:"Open", priority:"Medium", adminNote:"" });
  const [search,     setSearch]     = useState("");
  const [toast,      setToast]      = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [c, s, u] = await Promise.all([adminGetComplaints(), adminGetStats(), adminGetUsers()]);
      setComplaints(c.data); setStats(s.data); setUsers(u.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const startEdit = (c) => {
    setEditing(c._id);
    setEditForm({ status: c.status, priority: c.priority, adminNote: c.adminNote || "" });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await adminUpdateComplaint(id, editForm);
      setComplaints(prev => prev.map(c => c._id === id ? updated.data : c));
      setEditing(null);
      showToast("Complaint updated successfully!");
    } catch { showToast("Failed to update", "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await adminDeleteComplaint(id);
      setComplaints(prev => prev.filter(c => c._id !== id));
      showToast("Complaint deleted.");
    } catch { showToast("Failed to delete", "error"); }
  };

  const filtered = complaints.filter(c => {
    const ms = filterStatus === "All" || c.status === filterStatus;
    const mq = c.title?.toLowerCase().includes(search.toLowerCase()) ||
               c.user?.email?.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  const tabStyle = (t) => ({
    padding:"10px 20px", fontWeight:600, fontSize:14, cursor:"pointer",
    border:"none", background: tab===t ? "linear-gradient(135deg,#e8218c,#9f1060)" : "var(--input-bg)",
    color: tab===t ? "#fff" : "var(--text2)",
    borderRadius:8, fontFamily:"'DM Sans',sans-serif",
    boxShadow: tab===t ? "0 0 16px rgba(232,33,140,0.35)" : "none",
    transition:"all 0.18s",
  });

  return (
    <Layout>
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}

      <div className="page-title">Admin Panel</div>
      <div className="page-subtitle">Manage all complaints and users</div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12, marginBottom:24 }}>
        <StatMini label="Total"       value={stats.total || 0}      color="#f472b6" />
        <StatMini label="Open"        value={stats.open || 0}       color="#ef4444" />
        <StatMini label="In Progress" value={stats.inProgress || 0} color="#f59e0b" />
        <StatMini label="Resolved"    value={stats.resolved || 0}   color="#10b981" />
        <StatMini label="Closed"      value={stats.closed || 0}     color="#3b82f6" />
        <StatMini label="Users"       value={stats.users || 0}      color="#7c3aed" />
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <button style={tabStyle("complaints")} onClick={() => setTab("complaints")}>📋 Complaints ({complaints.length})</button>
        <button style={tabStyle("users")}      onClick={() => setTab("users")}>👥 Users ({users.length})</button>
      </div>

      {/* Complaints tab */}
      {tab === "complaints" && (
        <>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            <input className="input" placeholder="🔍 Search by title or email..."
              value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:280 }} />
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["All",...STATUSES].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding:"7px 12px", borderRadius:7, fontSize:12, fontWeight:600,
                  cursor:"pointer", border:"1px solid",
                  background: filterStatus===s ? "linear-gradient(135deg,#e8218c,#9f1060)" : "var(--input-bg)",
                  borderColor: filterStatus===s ? "transparent" : "var(--input-border)",
                  color: filterStatus===s ? "#fff" : "var(--text2)",
                  transition:"all 0.18s", fontFamily:"'DM Sans',sans-serif",
                }}>{s}</button>
              ))}
            </div>
          </div>

          {loading && <div className="spinner" style={{ marginTop:40 }} />}

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map((c, i) => (
              <div key={c._id} className="card" style={{ animationDelay:`${i*0.04}s` }}>
                {editing === c._id ? (
                  /* Edit form */
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:"var(--text)", marginBottom:14 }}>
                      Editing: {c.title}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                      <div>
                        <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", display:"block", marginBottom:5 }}>Status</label>
                        <select className="input" value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                          {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", display:"block", marginBottom:5 }}>Priority</label>
                        <select className="input" value={editForm.priority} onChange={e => setEditForm(f => ({ ...f, priority: e.target.value }))}>
                          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom:12 }}>
                      <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", display:"block", marginBottom:5 }}>Admin Note</label>
                      <textarea className="input" rows={2} placeholder="Add a note for the user..."
                        value={editForm.adminNote} onChange={e => setEditForm(f => ({ ...f, adminNote: e.target.value }))} />
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="btn btn-primary" onClick={() => saveEdit(c._id)} style={{ padding:"8px 20px" }}>Save Changes</button>
                      <button className="btn btn-secondary" onClick={() => setEditing(null)} style={{ padding:"8px 16px" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  /* View row */
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:"var(--text)", marginBottom:4 }}>{c.title}</div>
                      <div style={{ fontSize:12, color:"var(--muted)" }}>
                        👤 {c.user?.name || "Unknown"} · {c.user?.email} · {c.category} · {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                      {c.adminNote && (
                        <div style={{ marginTop:6, fontSize:12, color:"#e8218c" }}>📝 {c.adminNote}</div>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                      <span className={`badge ${BADGE_CLASS[c.status]||"badge-open"}`}>{c.status}</span>
                      <span className={`badge priority-${c.priority?.toLowerCase()}`}>{c.priority}</span>
                      <button className="btn btn-secondary" onClick={() => startEdit(c)} style={{ padding:"5px 12px", fontSize:12 }}>✏️ Edit</button>
                      <button className="btn btn-danger"    onClick={() => handleDelete(c._id)} style={{ padding:"5px 12px", fontSize:12 }}>🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Users tab */}
      {tab === "users" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {users.map((u, i) => (
            <div key={u._id} className="card" style={{ animationDelay:`${i*0.04}s` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{
                    width:40, height:40, borderRadius:"50%",
                    background:"linear-gradient(135deg,#e8218c,#7c3aed)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:800, color:"#fff", fontSize:14, flexShrink:0,
                  }}>{u.name?.slice(0,2).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:"var(--text)" }}>{u.name}</div>
                    <div style={{ fontSize:12, color:"var(--muted)" }}>{u.email} · Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <span style={{
                  padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700,
                  background: u.role==="admin" ? "rgba(124,58,237,0.15)" : "rgba(59,130,246,0.12)",
                  color: u.role==="admin" ? "#a78bfa" : "#3b82f6",
                  border: `1px solid ${u.role==="admin" ? "rgba(124,58,237,0.3)" : "rgba(59,130,246,0.3)"}`,
                  textTransform:"capitalize",
                }}>{u.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getComplaints } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const STAT_CFG = [
  { key:"Open",        color:"#ef4444", glow:"rgba(239,68,68,0.3)",    icon:"🔴" },
  { key:"In Progress", color:"#f59e0b", glow:"rgba(245,158,11,0.3)",   icon:"🟡" },
  { key:"Resolved",    color:"#10b981", glow:"rgba(16,185,129,0.3)",   icon:"🟢" },
  { key:"Closed",      color:"#3b82f6", glow:"rgba(59,130,246,0.3)",   icon:"🔵" },
];

const BADGE_CLASS = { Open:"badge-open", "In Progress":"badge-progress", Resolved:"badge-resolved", Closed:"badge-closed" };

export default function Dashboard() {
  const { theme } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";

  useEffect(() => {
    getComplaints().then(r => { setComplaints(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const counts = {
    Open:        complaints.filter(c => c.status === "Open").length,
    "In Progress": complaints.filter(c => c.status === "In Progress").length,
    Resolved:    complaints.filter(c => c.status === "Resolved").length,
    Closed:      complaints.filter(c => c.status === "Closed").length,
  };

  const chartColors = { grid:"rgba(255,255,255,0.04)", ticks:"#4a4a6a" };
  if (!isDark) { chartColors.grid = "rgba(0,0,0,0.06)"; chartColors.ticks = "#9ca3af"; }

  const barData = {
    labels:["Open","In Progress","Resolved","Closed"],
    datasets:[{
      label:"Complaints",
      data:[counts.Open, counts["In Progress"], counts.Resolved, counts.Closed],
      backgroundColor:["#ef4444bb","#f59e0bbb","#10b981bb","#3b82f6bb"],
      borderColor:["#ef4444","#f59e0b","#10b981","#3b82f6"],
      borderWidth:2, borderRadius:8, borderSkipped:false,
    }],
  };

  const doughnutRaw = [counts.Open, counts["In Progress"], counts.Resolved, counts.Closed];
  const doughnutLabels = ["Open","In Progress","Resolved","Closed"];
  const doughnutColors = ["#ef4444bb","#f59e0bbb","#10b981bb","#3b82f6bb"];
  const doughnutBorders = ["#ef4444","#f59e0b","#10b981","#3b82f6"];
  const hasData = doughnutRaw.some(v => v > 0);

  // Only include segments that have actual data
  const filteredLabels = hasData ? doughnutLabels.filter((_,i) => doughnutRaw[i] > 0) : doughnutLabels;
  const filteredData   = hasData ? doughnutRaw.filter(v => v > 0) : [1,1,1,1];
  const filteredColors = hasData ? doughnutColors.filter((_,i) => doughnutRaw[i] > 0) : doughnutColors;
  const filteredBorders= hasData ? doughnutBorders.filter((_,i) => doughnutRaw[i] > 0) : doughnutBorders;

  const doughnutData = {
    labels: filteredLabels,
    datasets:[{
      data: filteredData,
      backgroundColor: filteredColors,
      borderColor: filteredBorders,
      borderWidth:2,
    }],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: true,
    plugins:{
      legend:{ labels:{ color: isDark ? "#6b6b90" : "#6b7280", font:{ family:"'Segoe UI',sans-serif", size:11 } } },
      tooltip:{ backgroundColor:"rgba(14,12,36,0.95)", borderColor:"rgba(232,33,140,0.3)", borderWidth:1, titleColor:"#f1f5f9", bodyColor:"#94a3b8", cornerRadius:8 },
    },
    scales:{
      x:{ ticks:{ color:chartColors.ticks, font:{ family:"'Segoe UI',sans-serif", size:10 } }, grid:{ color:chartColors.grid } },
      y:{ ticks:{ color:chartColors.ticks, font:{ family:"'Segoe UI',sans-serif", size:10 } }, grid:{ color:chartColors.grid }, beginAtZero:true },
    },
  };

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "68%",
    plugins:{
      legend:{ position:"bottom", labels:{ color: isDark ? "#6b6b90" : "#6b7280", font:{ family:"'Segoe UI',sans-serif", size:10 }, padding:8 } },
      tooltip: chartOpts.plugins.tooltip,
    },
  };

  return (
    <Layout>
      <div className="page-title">Dashboard Overview</div>
      <div className="page-subtitle">{complaints.length} total complaint{complaints.length !== 1 ? "s" : ""} tracked</div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {STAT_CFG.map(({ key, color, glow, icon }, i) => (
          <div key={key} className="card" style={{ animationDelay:`${i*0.08}s`, cursor:"default" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 12px 40px ${glow}`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
            <div style={{ position:"absolute", top:16, right:18, fontSize:22, opacity:0.18 }}>{icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{key}</div>
            <div style={{ fontFamily:"'Segoe UI',sans-serif", fontSize:40, fontWeight:800, color, lineHeight:1,
              animation:`fadeUp 0.5s ease ${i*0.1}s both` }}>{loading ? "—" : counts[key]}</div>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, borderRadius:"0 0 14px 14px",
              background:`linear-gradient(90deg,${color},transparent)` }} />
          </div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div className="card" style={{ animationDelay:"0.35s", padding:"16px" }}>
          <div style={{ fontFamily:"'Segoe UI',sans-serif", fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"linear-gradient(135deg,#e8218c,#7c3aed)", boxShadow:"0 0 6px rgba(232,33,140,0.6)", display:"inline-block" }} />
            Complaint Status Chart
          </div>
          <div style={{ height:160 }}>
            <Bar data={barData} options={{ ...chartOpts, maintainAspectRatio:false }} />
          </div>
        </div>
        <div className="card" style={{ animationDelay:"0.45s", padding:"16px" }}>
          <div style={{ fontFamily:"'Segoe UI',sans-serif", fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"linear-gradient(135deg,#e8218c,#7c3aed)", boxShadow:"0 0 6px rgba(232,33,140,0.6)", display:"inline-block" }} />
            Status Distribution
          </div>
          <div style={{ height:160, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:160, height:160 }}>
              <Doughnut data={doughnutData} options={{ ...doughnutOpts, maintainAspectRatio:false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent complaints */}
      <div className="card" style={{ animationDelay:"0.55s" }}>
        <div style={{ fontFamily:"'Segoe UI',sans-serif", fontSize:15, fontWeight:800, color:"var(--text)", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"linear-gradient(135deg,#e8218c,#7c3aed)", boxShadow:"0 0 8px rgba(232,33,140,0.6)", display:"inline-block" }} />
          Recent Complaints
        </div>
        {loading && <div className="spinner" />}
        {!loading && complaints.length === 0 && (
          <div style={{ textAlign:"center", color:"var(--muted)", padding:"24px 0", fontSize:14 }}>
            No complaints yet. <span style={{ color:"#e8218c", cursor:"pointer" }} onClick={() => window.location.href="/submit-complaint"}>Submit your first →</span>
          </div>
        )}
        {complaints.slice(0, 6).map(c => (
          <div key={c._id} style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"12px 0", borderBottom:"1px solid var(--border)", gap:12,
            transition:"padding-left 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.paddingLeft="8px"}
            onMouseLeave={e => e.currentTarget.style.paddingLeft="0"}
          >
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:"var(--text)" }}>{c.title}</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>
                {c.category} • {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              <span className={`badge ${BADGE_CLASS[c.status] || "badge-open"}`}>{c.status}</span>
              <span className={`badge priority-${c.priority?.toLowerCase()}`}>{c.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
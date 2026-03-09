import React, { useState, useRef, useEffect } from "react";
import { chatbotMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

function formatTime(d) {
  return new Date(d).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}

export default function Chatbot({ defaultOpen = false }) {
  const { theme } = useAuth();
  const [open,     setOpen]     = useState(defaultOpen);
  const [messages, setMessages] = useState([
    { role:"bot", text:"👋 Hi! I'm your AI assistant. Ask me about your complaints, status updates, or anything else!", time: Date.now() }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role:"user", text, time: Date.now() }]);
    setLoading(true);
    try {
      const res = await chatbotMessage(text);
      setMessages(prev => [...prev, { role:"bot", text: res.data.reply, time: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role:"bot", text:"Sorry, I couldn't connect right now. Try again!", time: Date.now() }]);
    }
    setLoading(false);
  };

  const isDark = theme === "dark";

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
      {open && (
        <div style={{
          width:340, height:470, borderRadius:16, marginBottom:10,
          background: isDark
            ? "linear-gradient(160deg,#0e0d25 0%,#120f28 100%)"
            : "rgba(255,255,255,0.98)",
          border:`1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
          boxShadow: isDark
            ? "0 16px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,33,140,0.1)"
            : "0 8px 40px rgba(0,0,0,0.15)",
          display:"flex", flexDirection:"column", overflow:"hidden",
          animation:"chatSlideUp 0.28s ease",
        }}>
          {/* Header */}
          <div style={{
            padding:"13px 16px",
            background:"linear-gradient(90deg,#c0152a,#e8218c)",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            flexShrink:0,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{
                width:32, height:32, borderRadius:"50%",
                background:"rgba(255,255,255,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
              }}>🤖</div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#fff" }}>AI Assistant</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", display:"inline-block" }} />
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background:"rgba(255,255,255,0.15)", border:"none",
              width:26, height:26, borderRadius:6, color:"#fff",
              fontSize:13, cursor:"pointer", display:"flex",
              alignItems:"center", justifyContent:"center",
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex:1, overflowY:"auto", padding:14,
            display:"flex", flexDirection:"column", gap:10,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems: m.role==="user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth:"82%", padding:"9px 13px", borderRadius:12,
                  fontSize:13, lineHeight:1.45,
                  animation:"msgIn 0.22s ease",
                  ...(m.role === "user"
                    ? { background:"linear-gradient(135deg,#e8218c,#9f1060)", color:"#fff", borderBottomRightRadius:4, boxShadow:"0 2px 12px rgba(232,33,140,0.3)" }
                    : { background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color:"var(--text)", border:`1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderBottomLeftRadius:4 }
                  ),
                }}>{m.text}</div>
                <div style={{ fontSize:10, color:"var(--muted)", marginTop:2 }}>{formatTime(m.time)}</div>
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf:"flex-start", display:"flex", alignItems:"center", gap:4,
                padding:"10px 14px",
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                border:`1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                borderRadius:12, borderBottomLeftRadius:4,
              }}>
                {[0,0.2,0.4].map((delay, i) => (
                  <div key={i} style={{
                    width:6, height:6, borderRadius:"50%", background:"#6b6b90",
                    animation:`typingDot 1.4s ease-in-out ${delay}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding:"10px 12px",
            borderTop:`1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
            display:"flex", gap:8, flexShrink:0,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type your message..."
              style={{
                flex:1, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                border:`1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.1)"}`,
                borderRadius:8, padding:"9px 12px",
                color:"var(--text)", fontSize:13,
                fontFamily:"'DM Sans',sans-serif", outline:"none",
              }}
            />
            <button onClick={send} disabled={loading || !input.trim()} className="btn btn-primary"
              style={{ padding:"9px 16px", fontSize:13 }}>Send</button>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button onClick={() => setOpen(o => !o)} style={{
        width:54, height:54, borderRadius:"50%",
        background:"linear-gradient(135deg,#e8218c,#7c3aed)",
        border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:22, color:"#fff",
        boxShadow:"0 0 24px rgba(232,33,140,0.55)",
        transition:"transform 0.2s, box-shadow 0.2s",
        animation:"pulseGlow 2.8s ease-in-out infinite",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
      >{open ? "✕" : "💬"}</button>
    </div>
  );
}

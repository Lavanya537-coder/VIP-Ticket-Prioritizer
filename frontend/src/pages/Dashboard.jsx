import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { TrendingUp, AlertCircle, Flame, CheckCircle, Clock } from "lucide-react";

const StatCard = ({ label, value, icon, gradient, glow, accent }) => (
  <div style={{
    background: "rgba(8,14,36,0.7)",
    border: `1px solid ${accent}22`,
    borderRadius: "16px",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(12px)",
  }}>
    {/* Top glow line */}
    <div style={{
      position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
      background: gradient,
    }} />
    {/* Background orb */}
    <div style={{
      position: "absolute", top: "-20px", right: "-20px",
      width: "80px", height: "80px", borderRadius: "50%",
      background: glow, filter: "blur(24px)", opacity: 0.6,
      pointerEvents: "none"
    }} />

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.6)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
          {label}
        </p>
        <h2 style={{ fontSize: "42px", fontWeight: "700", color: "#f0f4ff", letterSpacing: "-1px", lineHeight: 1 }}>
          {value ?? 0}
        </h2>
      </div>
      <div style={{
        width: "40px", height: "40px", borderRadius: "10px",
        background: `${accent}18`, border: `1px solid ${accent}30`,
        display: "flex", alignItems: "center", justifyContent: "center", color: accent,
        flexShrink: 0
      }}>
        {icon}
      </div>
    </div>
  </div>
);

function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Tickets",
      value: stats.total_tickets,
      icon: <TrendingUp size={18} />,
      gradient: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
      glow: "radial-gradient(circle, #3b82f6, transparent)",
      accent: "#3b82f6"
    },
    {
      label: "Critical",
      value: stats.critical_tickets,
      icon: <AlertCircle size={18} />,
      gradient: "linear-gradient(90deg, transparent, #ef4444, transparent)",
      glow: "radial-gradient(circle, #ef4444, transparent)",
      accent: "#ef4444"
    },
    {
      label: "High Priority",
      value: stats.high_priority_tickets,
      icon: <Flame size={18} />,
      gradient: "linear-gradient(90deg, transparent, #f97316, transparent)",
      glow: "radial-gradient(circle, #f97316, transparent)",
      accent: "#f97316"
    },
    {
      label: "Medium Priority",
      value: stats.medium_priority_tickets,
      icon: <CheckCircle size={18} />,
      gradient: "linear-gradient(90deg, transparent, #22c55e, transparent)",
      glow: "radial-gradient(circle, #22c55e, transparent)",
      accent: "#22c55e"
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", color: "#3b82f6", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
          Overview
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#f0f4ff", letterSpacing: "-0.5px", margin: 0 }}>
          Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: "120px", borderRadius: "16px", background: "rgba(255,255,255,0.03)", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
          {cards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      )}

      {/* Activity placeholder / info panel */}
      <div style={{
        background: "rgba(8,14,36,0.6)",
        border: "1px solid rgba(59,130,246,0.1)",
        borderRadius: "16px",
        padding: "28px",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Clock size={16} color="#3b82f6" />
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1", margin: 0 }}>Recent Activity</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
          <p style={{ color: "rgba(148,163,184,0.4)", fontSize: "13px" }}>
            Submit your first ticket to see activity here
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;

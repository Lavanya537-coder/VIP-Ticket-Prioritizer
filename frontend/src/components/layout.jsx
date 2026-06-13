import { Link, useLocation } from "react-router-dom";
import { ShieldAlert, Ticket, BrainCircuit, Zap } from "lucide-react";

function Layout({ children }) {
  const location = useLocation();

  const navLinks = [
    { to: "/", icon: <ShieldAlert size={18} />, label: "Dashboard" },
    { to: "/create", icon: <BrainCircuit size={18} />, label: "Create Ticket" },
    { to: "/tickets", icon: <Ticket size={18} />, label: "Ticket Queue" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#050818", display: "flex", fontFamily: "'Inter', sans-serif" }}>

      {/* Ambient background glow */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 0
      }} />

      {/* Sidebar */}
      <aside style={{
        position: "fixed", left: 0, top: 0, height: "100vh", width: "240px",
        background: "rgba(8, 14, 36, 0.95)",
        borderRight: "1px solid rgba(59,130,246,0.12)",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(99,102,241,0.4)"
            }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontSize: "17px", fontWeight: "700", color: "#f0f4ff", letterSpacing: "-0.3px" }}>
              VIP Desk
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.7)", marginLeft: "42px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            AI Ticket Prioritizer
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(59,130,246,0.1)", margin: "0 16px" }} />

        {/* Nav */}
        <nav style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navLinks.map(({ to, icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px", borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "13.5px", fontWeight: active ? "600" : "400",
                  color: active ? "#93c5fd" : "rgba(148,163,184,0.8)",
                  background: active ? "rgba(59,130,246,0.12)" : "transparent",
                  border: active ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "#e2e8f0";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(148,163,184,0.8)";
                  }
                }}
              >
                {active && (
                  <div style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                    width: "3px", borderRadius: "0 2px 2px 0",
                    background: "linear-gradient(180deg, #3b82f6, #6366f1)"
                  }} />
                )}
                <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer badge */}
        <div style={{ padding: "16px", margin: "8px 12px 20px" }}>
          <div style={{
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
            borderRadius: "10px", padding: "10px 12px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontSize: "11px", color: "rgba(148,163,184,0.8)" }}>AI Engine Online</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: "240px", flex: 1, padding: "40px 48px", position: "relative", zIndex: 1 }}>
        {children}
      </main>

    </div>
  );
}

export default Layout;

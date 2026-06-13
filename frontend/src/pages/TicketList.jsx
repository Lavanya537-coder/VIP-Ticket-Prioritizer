import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { Filter, Search, Inbox } from "lucide-react";

const priorityStyle = {
  CRITICAL: { color: "#fca5a5", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)" },
  HIGH:     { color: "#fdba74", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)" },
  MEDIUM:   { color: "#fde047", bg: "rgba(234,179,8,0.12)",  border: "rgba(234,179,8,0.25)"  },
  LOW:      { color: "#86efac", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)"  },
};

const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("ALL");

  useEffect(() => {
    API.get("/tickets")
      .then((res) => { setTickets(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = tickets
    .filter((t) =>
      (filterPriority === "ALL" || t.priority === filterPriority) &&
      (!search || [t.employee_name, t.category, t.ai_summary].some(
        (field) => field?.toLowerCase().includes(search.toLowerCase())
      ))
    )
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

  const priorities = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "11px", color: "#3b82f6", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            {tickets.length} tickets
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#f0f4ff", letterSpacing: "-0.5px", margin: 0 }}>
            Ticket Queue
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.4)" }} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "10px 12px 10px 36px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px", color: "#e2e8f0",
              fontSize: "13px", outline: "none", fontFamily: "inherit",
            }}
          />
        </div>

        {/* Priority filter pills */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Filter size={13} color="rgba(148,163,184,0.4)" />
          {priorities.map((p) => {
            const active = filterPriority === p;
            const pStyle = priorityStyle[p] || {};
            return (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: active ? `1px solid ${pStyle.border || "rgba(59,130,246,0.4)"}` : "1px solid rgba(255,255,255,0.07)",
                  background: active ? (pStyle.bg || "rgba(59,130,246,0.12)") : "transparent",
                  color: active ? (pStyle.color || "#93c5fd") : "rgba(148,163,184,0.6)",
                  fontSize: "12px", fontWeight: active ? "600" : "400",
                  cursor: "pointer", transition: "all 0.15s ease", fontFamily: "inherit",
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: "rgba(8,14,36,0.7)",
        border: "1px solid rgba(59,130,246,0.1)",
        borderRadius: "18px",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
      }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{
              width: "32px", height: "32px", margin: "0 auto",
              border: "2px solid rgba(59,130,246,0.2)",
              borderTop: "2px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite"
            }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "80px", textAlign: "center" }}>
            <Inbox size={32} color="rgba(148,163,184,0.2)" style={{ marginBottom: "12px" }} />
            <p style={{ color: "rgba(148,163,184,0.4)", fontSize: "14px" }}>No tickets found</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["ID", "Employee", "Priority", "Category", "AI Summary"].map((col) => (
                  <th key={col} style={{
                    padding: "13px 18px", textAlign: "left",
                    fontSize: "10px", fontWeight: "600",
                    color: "rgba(148,163,184,0.5)",
                    letterSpacing: "0.8px", textTransform: "uppercase",
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket, idx) => {
                const ps = priorityStyle[ticket.priority] || {};
                return (
                  <tr
                    key={ticket.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      transition: "background 0.1s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 18px", fontSize: "12px", color: "rgba(148,163,184,0.4)", fontFamily: "monospace" }}>
                      #{String(ticket.id).padStart(4, "0")}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          background: "rgba(99,102,241,0.15)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: "600", color: "#a78bfa",
                        }}>
                          {ticket.employee_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: "500", color: "#e2e8f0", margin: 0 }}>{ticket.employee_name}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                        background: ps.bg, border: `1px solid ${ps.border}`, color: ps.color,
                        whiteSpace: "nowrap",
                      }}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "rgba(148,163,184,0.7)" }}>
                      {ticket.category}
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "rgba(148,163,184,0.6)", maxWidth: "300px" }}>
                      <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ticket.ai_summary}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(148,163,184,0.3); }
      `}</style>
    </Layout>
  );
}

export default TicketList;

import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { Send, Sparkles, AlertTriangle, Tag, FileText, Lightbulb, User, Mail, Building2 } from "lucide-react";

const priorityConfig = {
  CRITICAL: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", label: "🔴 Critical" },
  HIGH:     { color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)", label: "🟠 High" },
  MEDIUM:   { color: "#eab308", bg: "rgba(234,179,8,0.1)",  border: "rgba(234,179,8,0.25)",  label: "🟡 Medium" },
  LOW:      { color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  label: "🟢 Low" },
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#e2e8f0",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease",
  fontFamily: "inherit",
};

const InputField = ({ icon, placeholder, value, onChange, type = "text" }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", marginBottom: "14px" }}>
      <div style={{
        position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
        color: focused ? "#3b82f6" : "rgba(148,163,184,0.4)", pointerEvents: "none",
        transition: "color 0.15s"
      }}>
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          paddingLeft: "42px",
          borderColor: focused ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
};

function CreateTicket() {
  const [form, setForm] = useState({
    employee_name: "",
    email: "",
    department: "",
    issue_title: "",
    issue_description: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async () => {
    if (!form.issue_title || !form.issue_description) return;
    setLoading(true);
    try {
      const res = await API.post("/tickets", form);
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  const priority = result?.priority;
  const pConfig = priorityConfig[priority] || {};

  return (
    <Layout>
      <div style={{ maxWidth: "680px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "#3b82f6", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            AI Powered
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#f0f4ff", letterSpacing: "-0.5px", margin: 0 }}>
            Create Ticket
          </h1>
        </div>

        {/* Form card */}
        <div style={{
          background: "rgba(8,14,36,0.7)",
          border: "1px solid rgba(59,130,246,0.12)",
          borderRadius: "20px",
          padding: "32px",
          backdropFilter: "blur(12px)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Top accent line */}
          <div style={{
            position: "absolute", top: 0, left: "15%", right: "15%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)"
          }} />

          {/* Employee info — 2 col */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
            <InputField
              icon={<User size={15} />}
              placeholder="Employee Name"
              value={form.employee_name}
              onChange={handleChange("employee_name")}
            />
            <InputField
              icon={<Mail size={15} />}
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange("email")}
              type="email"
            />
          </div>

          <InputField
            icon={<Building2 size={15} />}
            placeholder="Department (e.g. Engineering, HR, Finance)"
            value={form.department}
            onChange={handleChange("department")}
          />

          <InputField
            icon={<FileText size={15} />}
            placeholder="Issue Title"
            value={form.issue_title}
            onChange={handleChange("issue_title")}
          />

          {/* Textarea */}
          {(() => {
            const [focused, setFocused] = useState(false);
            return (
              <textarea
                rows="5"
                placeholder="Describe the issue in detail..."
                value={form.issue_description}
                onChange={handleChange("issue_description")}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                  borderColor: focused ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)",
                }}
              />
            );
          })()}

          <button
            onClick={submit}
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "13px 28px",
              background: loading ? "rgba(59,130,246,0.3)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
              border: "none", borderRadius: "10px",
              color: "white", fontSize: "14px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              boxShadow: loading ? "none" : "0 0 20px rgba(99,102,241,0.3)",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {loading ? (
              <>
                <div style={{
                  width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white", borderRadius: "50%",
                  animation: "spin 0.7s linear infinite"
                }} />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Analyze & Submit
                <Send size={13} />
              </>
            )}
          </button>
        </div>

        {/* AI Result card */}
        {result && (
          <div style={{
            marginTop: "24px",
            background: "rgba(8,14,36,0.7)",
            border: `1px solid ${pConfig.border || "rgba(59,130,246,0.12)"}`,
            borderRadius: "20px",
            overflow: "hidden",
            backdropFilter: "blur(12px)",
            animation: "fadeIn 0.4s ease"
          }}>
            {/* Header bar */}
            <div style={{
              padding: "18px 28px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Sparkles size={16} color="#6366f1" />
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#e2e8f0" }}>AI Analysis</span>
              </div>
              {priority && (
                <span style={{
                  padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                  background: pConfig.bg, border: `1px solid ${pConfig.border}`, color: pConfig.color,
                }}>
                  {pConfig.label}
                </span>
              )}
            </div>

            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Category */}
              {result.category && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <Tag size={15} color="#6366f1" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "4px" }}>Category</p>
                    <p style={{ fontSize: "14px", color: "#cbd5e1", margin: 0 }}>{result.category}</p>
                  </div>
                </div>
              )}

              {/* Summary */}
              {result.summary && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <FileText size={15} color="#3b82f6" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "4px" }}>AI Summary</p>
                    <p style={{ fontSize: "14px", color: "#cbd5e1", margin: 0, lineHeight: "1.6" }}>{result.summary}</p>
                  </div>
                </div>
              )}

              {/* Suggested resolution */}
              {result.suggested_resolution && (
                <div style={{
                  display: "flex", gap: "12px",
                  padding: "16px",
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: "12px",
                }}>
                  <Lightbulb size={15} color="#a78bfa" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontSize: "10px", color: "rgba(167,139,250,0.7)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "4px" }}>Suggested Resolution</p>
                    <p style={{ fontSize: "14px", color: "#c4b5fd", margin: 0, lineHeight: "1.6" }}>{result.suggested_resolution}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder, textarea::placeholder { color: rgba(148,163,184,0.35); }
      `}</style>
    </Layout>
  );
}

export default CreateTicket;

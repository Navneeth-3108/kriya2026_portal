import { useRef, useEffect } from "react";

// ─── LowerDeck ────────────────────────────────────────────────────────────────
export default function LowerDeck({ logs, loading }) {
  const terminalRef = useRef(null);

  // Auto-scroll to newest entry
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, loading]);

  const typeIcon = (type) => {
    switch (type) {
      case "pass":
        return "✓";
      case "fail":
        return "✗";
      case "error":
        return "☠";
      case "system":
        return "⚓";
      case "info":
        return "◈";
      case "warn":
        return "⚠";
      default:
        return "›";
    }
  };

  const typePrefix = (type) => {
    switch (type) {
      case "pass":
        return "[PASS]";
      case "fail":
        return "[FAIL]";
      case "error":
        return "[ERR] ";
      case "system":
        return "[SYS] ";
      case "info":
        return "[INFO]";
      case "warn":
        return "[WARN]";
      default:
        return "[LOG] ";
    }
  };

  return (
    <section className="lower-deck" aria-label="Captain's Log — Test Results">
      {/* ── Header ──────────────────────────── */}
      <div className="deck-header">
        <div className="deck-title">
          <span aria-hidden="true">📜</span>
          Captain's Log
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {loading && (
            <span
              style={{
                fontFamily: "'Special Elite', cursive",
                fontSize: "0.7rem",
                color: "rgba(200,145,42,0.65)",
                animation: "cursor-blink 0.75s steps(2) infinite",
                letterSpacing: "0.04em",
              }}
              aria-live="polite"
            >
              ⚡ Consulting Davy Jones…
            </span>
          )}
          <span className="deck-meta">{logs.length} entries</span>
        </div>
      </div>

      {/* ── Output ──────────────────────────── */}
      <div
        className="terminal-output"
        ref={terminalRef}
        role="log"
        aria-live="polite"
        aria-label="Test results"
      >
        {logs.length === 0 && !loading ? (
          <div className="terminal-empty" aria-hidden="true">
            <span style={{ fontSize: "2rem", opacity: 0.35 }}>🌊</span>
            <span>Calm seas… submit yer code, Captain.</span>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={log.id ?? i} className={`terminal-line ${log.type}`}>
              <span className="t-prefix" aria-hidden="true">
                {log.icon ?? typeIcon(log.type)}&nbsp;{typePrefix(log.type)}
              </span>
              <span className="t-text">{log.text}</span>
            </div>
          ))
        )}

        {loading && (
          <div className="terminal-line info">
            <span className="t-prefix" aria-hidden="true">
              ◈ [INFO]
            </span>
            <span className="t-text">
              <span className="terminal-cursor" aria-hidden="true" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

import { useState } from "react";

export default function ProblemPanel({ problem, problems, onSelectProblem }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <aside className="parchment-panel" aria-label="Problem Description">
      {/* ── Problem Selector ─────────────── */}
      <select
        id="problem-selector"
        className="problem-selector"
        value={problem.id}
        onChange={(e) => onSelectProblem(Number(e.target.value))}
        aria-label="Select a problem"
      >
        {problems.map((p) => (
          <option key={p.id} value={p.id}>
            #{p.id} · {p.title}
          </option>
        ))}
      </select>

      {/* ── Tabs ─────────────────────────── */}
      <div className="problem-tabs" role="tablist">
        {[
          { id: "description", label: "📜 Lore" },
          { id: "examples", label: "🗺 Examples" },
          { id: "constraints", label: "⚓ Rules" },
        ].map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`problem-tab${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            id={`tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Meta ─────────────── */}

      {/* ── Title ────────────────────────── */}
      <h2 className="problem-title">
        #{problem.id}. {problem.title}
      </h2>

      {/* ── Meta ─────────────────────────── */}
      <div className="problem-meta" style={{ margin: "0.9rem 0 0.4rem" }}>
        <span>🏴‍☠️ {problem.bountyReward} pts</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>{problem.testCases?.length || 0} test cases</span>
      </div>

      {/* ── Description Tab ──────────────── */}
      {activeTab === "description" && (
        <div
          className="problem-body"
          role="tabpanel"
          aria-labelledby="tab-description"
        >
          {problem.lore && <p className="lore-quote">"{problem.lore}"</p>}
          <div dangerouslySetInnerHTML={{ __html: problem.description }} />
        </div>
      )}

      {/* ── Examples Tab ─────────────────── */}
      {activeTab === "examples" && (
        <div
          className="problem-body"
          role="tabpanel"
          aria-labelledby="tab-examples"
        >
          <p className="problem-section-label">📖 Examples</p>
          {problem.examples.map((ex, i) => (
            <div key={i} style={{ marginBottom: "1.1rem" }}>
              <div
                className="example-block"
                data-label={`Example ${i + 1} — Input`}
              >
                {ex.input}
              </div>
              <div
                className="example-block"
                data-label={`Example ${i + 1} — Output`}
                style={{ marginTop: "0.4rem" }}
              >
                {ex.output}
              </div>
              {ex.explanation && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(40,18,4,0.65)",
                    fontFamily: "'Special Elite', cursive",
                    marginTop: "0.3rem",
                    paddingLeft: "0.5rem",
                    fontStyle: "italic",
                  }}
                >
                  💬 {ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Constraints Tab ──────────────── */}
      {activeTab === "constraints" && (
        <div
          className="problem-body"
          role="tabpanel"
          aria-labelledby="tab-constraints"
        >
          <p className="problem-section-label">📏 Constraints</p>
          <ul className="constraint-list">
            {problem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>

          <div
            className="section-divider"
            style={{ margin: "1.1rem 0 0.65rem" }}
          >
            Hint
          </div>

          <div
            style={{
              background: "rgba(80,45,10,0.1)",
              border: "1px dashed rgba(100,65,20,0.33)",
              borderRadius: "5px",
              padding: "0.75rem",
              fontSize: "0.78rem",
              color: "rgba(40,18,4,0.72)",
              fontFamily: "'Special Elite', cursive",
              lineHeight: 1.65,
            }}
          >
            🔮{" "}
            <em>
              Ask yerself: can ye trade space for time, Captain? A hash map
              might chart yer course true…
            </em>
          </div>
        </div>
      )}
    </aside>
  );
}

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import MonacoEditor from "@monaco-editor/react";
import "./PirateArena.css";

/* ================================================================
   1. PROBLEM DATA
   ================================================================ */
const PROBLEMS = [
  {
    id: 1,
    slug: "two-sum",
    title: "Two Sum — The Treasure Coordinates",
    lore: "The treasure chest awaits at the intersection of two coordinates...",
    description: `
      <p>Given an array of integers <strong>nums</strong> and an integer <strong>target</strong>,
      return the <em>indices</em> of the two numbers such that they add up to target.</p>
      <p>You may assume each input has <strong>exactly one solution</strong>, and you may not
      use the same element twice. Return the answer in any order, <em>ye scallywag</em>.</p>`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] = 9.",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1, 2]",
        explanation: null,
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0, 1]",
        explanation: null,
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
      { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected: [2, 4] },
      {
        input: { nums: [1000000000, 999999999], target: 1999999999 },
        expected: [0, 1],
      },
    ],
    bountyReward: 150,
  },
  {
    id: 2,
    slug: "valid-parentheses",
    title: "Valid Parentheses — The Kraken's Maw",
    lore: "The Kraken's jaws open and close with perfect symmetry. Mimic its pattern...",
    description: `
      <p>Given a string <strong>s</strong> containing just the characters
      <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>,
      <code>'['</code> and <code>']'</code>, determine if the input string is <strong>valid</strong>.</p>
      <ol>
        <li>Open brackets must be closed by the <em>same type</em> of brackets.</li>
        <li>Open brackets must be closed in the <em>correct order</em>.</li>
        <li>Every close bracket has a corresponding open bracket of the same type.</li>
      </ol>`,
    examples: [
      { input: 's = "()"', output: "true", explanation: null },
      { input: 's = "()[]{}"', output: "true", explanation: null },
      { input: 's = "(]"', output: "false", explanation: null },
      { input: 's = "{[]}"', output: "true", explanation: null },
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only '()[]{}'",
    ],
    testCases: [
      { input: { s: "()" }, expected: true },
      { input: { s: "()[]{}" }, expected: true },
      { input: { s: "(]" }, expected: false },
      { input: { s: "([)]" }, expected: false },
      { input: { s: "{[]}" }, expected: true },
    ],
    bountyReward: 150,
  },
  {
    id: 3,
    slug: "longest-common-prefix",
    title: "Longest Common Prefix — Pirate's Codex",
    lore: "All charts share the same starting legend. Find it before the storm hits...",
    description: `
      <p>Write a function to find the <strong>longest common prefix</strong> string
      amongst an array of strings.</p>
      <p>If there is no common prefix, return an empty string <code>""</code>.</p>`,
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
        explanation: null,
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""',
        explanation: "No common prefix.",
      },
    ],
    constraints: [
      "1 ≤ strs.length ≤ 200",
      "0 ≤ strs[i].length ≤ 200",
      "strs[i] consists of lowercase English letters.",
    ],
    testCases: [
      { input: { strs: ["flower", "flow", "flight"] }, expected: "fl" },
      { input: { strs: ["dog", "racecar", "car"] }, expected: "" },
      { input: { strs: ["a"] }, expected: "a" },
    ],
    bountyReward: 250,
  },
];

/* ================================================================
   2. JUDGE0 UTILITY (simulated — swap in real API key later)
   ================================================================ */
const JUDGE0_LANGUAGE_IDS = { python: 71, javascript: 63, cpp: 54, java: 62 };

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function simulateResult(code, testCases) {
  if (!code || code.trim().length < 10) {
    return {
      status: "error",
      results: [],
      message: "☠️ Ye submitted naught but the empty abyss, Captain!",
    };
  }
  const hasLogic = /return|def |function |class |for |while |if /i.test(code);
  const passRate = hasLogic ? 0.78 : 0.25;
  const results = testCases.map((tc, idx) => {
    const passed = Math.random() < passRate;
    return {
      id: idx + 1,
      status: passed ? "pass" : "fail",
      input: JSON.stringify(tc.input),
      expected: JSON.stringify(tc.expected),
      actual: passed ? JSON.stringify(tc.expected) : JSON.stringify(null),
      time: `${(Math.random() * 80 + 20).toFixed(0)}ms`,
    };
  });
  const passed = results.filter((r) => r.status === "pass").length;
  const allPassed = passed === results.length;
  return {
    status: allPassed ? "accepted" : "wrong_answer",
    results,
    message: allPassed
      ? `⚓ All ${passed}/${results.length} test cases passed! Hoist the colours!`
      : `💀 ${passed}/${results.length} passed. The ship be takin' on water!`,
  };
}

async function submitToJudge(code, language, problem) {
  // ── To activate Judge0: set USE_REAL_JUDGE0 = true + add VITE_JUDGE0_API_KEY to .env ──
  // const USE_REAL_JUDGE0 = false;
  await delay(Math.random() * 1200 + 800);
  return simulateResult(code, problem.testCases);
}

async function runCode(code) {
  await delay(400 + Math.random() * 400);
  if (!code || code.trim().length < 5)
    return { status: "error", output: "Error: No code to run, ye landlubber!" };
  return {
    status: "success",
    output:
      "Code compiled successfully.\nRunning sample test...\n✓ Sample output matches expected.",
  };
}

/* ================================================================
   3. MONACO THEME — "High Seas v2"
   ================================================================ */
const HIGH_SEAS_THEME = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "3d6878", fontStyle: "italic" },
    { token: "keyword", foreground: "c8912a", fontStyle: "bold" },
    { token: "string", foreground: "5ecba1" },
    { token: "number", foreground: "e07a5f" },
    { token: "type", foreground: "7db8d8" },
    { token: "function", foreground: "f0b93a" },
    { token: "variable", foreground: "b8d4e0" },
    { token: "operator", foreground: "c8912a" },
    { token: "delimiter", foreground: "5a8fa8" },
    { token: "identifier", foreground: "a8c8d8" },
    { token: "class", foreground: "e6c87a", fontStyle: "bold" },
  ],
  colors: {
    "editor.background": "#040a0e",
    "editor.foreground": "#b8d4e0",
    "editor.lineHighlightBackground": "#0c2030aa",
    "editor.lineHighlightBorder": "#1a4060",
    "editor.selectionBackground": "#c8912a28",
    "editor.selectionHighlightBackground": "#c8912a14",
    "editorCursor.foreground": "#f0b93a",
    "editorLineNumber.foreground": "#2a5068",
    "editorLineNumber.activeForeground": "#c8912a",
    "editorGutter.background": "#030810",
    "editorIndentGuide.background1": "#0f2535",
    "editorIndentGuide.activeBackground1": "#c8912a44",
    "editorWidget.background": "#071525",
    "editorWidget.border": "#c8912a33",
    "editorSuggestWidget.background": "#071525",
    "editorSuggestWidget.border": "#c8912a44",
    "editorSuggestWidget.selectedBackground": "#c8912a22",
    "editorBracketMatch.background": "#c8912a22",
    "editorBracketMatch.border": "#c8912a",
    "scrollbarSlider.background": "#3d251088",
    "scrollbarSlider.hoverBackground": "#7a4a22aa",
    "scrollbarSlider.activeBackground": "#c8912a99",
    "minimap.background": "#030810",
    focusBorder: "#c8912a",
  },
};

/* ================================================================
   4. SUB-COMPONENTS (all inline)
   ================================================================ */

/* ── 4a. Header ─────────────────────────────────────────────────── */
function Header({ lives, bounty, spinning, maxLives, shatterIdx }) {
  return (
    <header className="pa-header">
      {/* Lives */}
      <div className="pa-lives" role="group" aria-label="Lives remaining">
        <span className="pa-lives-label">Lives</span>
        {Array.from({ length: maxLives }).map((_, i) => {
          const alive = i < lives;
          const shattering = i === shatterIdx;
          return (
            <span
              key={i}
              className={`pa-skull ${alive ? "alive" : "lost"}${shattering ? " shattering" : ""}`}
              role="img"
              aria-label={alive ? "Life" : "Lost life"}
              title={alive ? "Life remaining" : "Life lost"}
            >
              ☠
            </span>
          );
        })}
      </div>

      {/* Title */}
      <h1 className="pa-header-title">⚓ &nbsp;Code Arena</h1>

      {/* Bounty */}
      <div className="pa-bounty" aria-label={`Bounty: ${bounty} points`}>
        <div className="pa-bounty-inner">
          <span className="pa-coin" aria-hidden="true">
            🪙
          </span>
          <span className={`pa-bounty-value${spinning ? " spinning" : ""}`}>
            {bounty.toLocaleString()}
          </span>
          <span className="pa-bounty-label">pts</span>
        </div>
      </div>
    </header>
  );
}

/* ── 4b. Problem Panel ──────────────────────────────────────────── */
function ProblemPanel({ problem, onBack }) {
  const [tab, setTab] = useState("description");

  return (
    <aside className="pa-parchment" aria-label="Problem description">
      {/* Back Navigation */}
      <button
        className="pa-btn-back"
        onClick={onBack}
        aria-label="Return to Island Map"
      >
        <span>⬅</span> Back
      </button>

      {/* Tabs */}
      <div className="pa-tabs" role="tablist">
        {[
          ["description", "📜 Lore"],
          ["examples", "🗺 Examples"],
          ["constraints", "⚓ Rules"],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={`pa-tab${tab === id ? " active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Title */}
      <h2 className="pa-problem-title">
        #{problem.id}. {problem.title}
      </h2>

      {/* Meta */}
      <div className="pa-problem-meta">
        <span>🏴‍☠️ {problem.bountyReward} pts</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>{problem.testCases.length} tests</span>
      </div>

      {/* Description */}
      {tab === "description" && (
        <div className="pa-body" role="tabpanel">
          {problem.lore && <p className="pa-lore-quote">"{problem.lore}"</p>}
          <div dangerouslySetInnerHTML={{ __html: problem.description }} />
        </div>
      )}

      {tab === "examples" && (
        <div role="tabpanel" style={{ paddingTop: "0.2rem" }}>
          <p className="pa-section-label">📖 Examples</p>
          {problem.examples.map((ex, i) => (
            <div key={i} className="pa-example-card">
              {/* Card header */}
              <div className="pa-example-header">
                <span className="pa-example-num">Example {i + 1}</span>
              </div>
              {/* Input | Output side by side */}
              <div className="pa-example-body">
                <div className="pa-example-cell">
                  <span className="pa-example-cell-label">⬇ Input</span>
                  <code>{ex.input}</code>
                </div>
                <div className="pa-example-cell">
                  <span className="pa-example-cell-label">⬆ Output</span>
                  <code>{ex.output}</code>
                </div>
              </div>
              {/* Explanation footer */}
              {ex.explanation && (
                <div className="pa-example-note">💬 {ex.explanation}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      {tab === "constraints" && (
        <div className="pa-body" role="tabpanel">
          <p className="pa-section-label">📏 Constraints</p>
          <ul className="pa-constraint-list">
            {problem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <div className="pa-divider" style={{ margin: "1.1rem 0 0.65rem" }}>
            Hint
          </div>
          <div className="pa-hint">
            🔮{" "}
            <em>
              Ask yerself: can ye trade space for time? A hash map might chart
              yer course true…
            </em>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ── 4c. Monaco Code Editor ─────────────────────────────────────── */
const CodeEditor = forwardRef(function CodeEditor(
  { code, onChange, language, shipwrecked },
  ref,
) {
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus(),
    layout: () => editorRef.current?.layout(),
  }));

  function onMount(editor, monaco) {
    editorRef.current = editor;
    monaco.editor.defineTheme("high-seas-v2", HIGH_SEAS_THEME);
    monaco.editor.setTheme("high-seas-v2");
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 13.5,
      fontFamily: '"JetBrains Mono","Fira Code","Courier Prime",monospace',
      fontLigatures: true,
      lineHeight: 23,
      padding: { top: 18, bottom: 18 },
      scrollBeyondLastLine: false,
      renderLineHighlight: "all",
      cursorStyle: "line",
      lineNumbers: "on",
      tabSize: 4,
      automaticLayout: true,
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true, indentation: true },
      overviewRulerBorder: false,
      scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
    });
  }

  const LANG_MAP = {
    python: "python",
    javascript: "javascript",
    cpp: "cpp",
    java: "java",
  };

  return (
    <div
      className={`pa-editor-zone${shipwrecked ? " shipwrecked" : ""}`}
      aria-label="Code editor"
    >
      <MonacoEditor
        height="100%"
        language={LANG_MAP[language] ?? "javascript"}
        value={code}
        onChange={(val) => onChange(val ?? "")}
        onMount={onMount}
        theme="high-seas-v2"
        loading={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "0.6rem",
              fontFamily: "'Pirata One',cursive",
              fontSize: "1rem",
              color: "#c8912a",
              background: "#040a0e",
            }}
          >
            <span style={{ animation: "pa-float 1.2s ease-in-out infinite" }}>
              ⚓
            </span>
            Rigging the Editor…
          </div>
        }
        options={{
          theme: "high-seas-v2",
          minimap: { enabled: false },
          cursorStyle: "line",
          lineNumbers: "on",
        }}
      />
    </div>
  );
});

/* ── 4d. Lower Deck / Terminal ──────────────────────────────────── */
function LowerDeck({ logs, loading, collapsed, onToggle }) {
  const termRef = useRef(null);

  useEffect(() => {
    if (termRef.current)
      termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs, loading]);

  const icon = (t) =>
    ({ pass: "✓", fail: "✗", error: "☠", system: "⚓", info: "◈", warn: "⚠" })[
      t
    ] ?? "›";
  const prefix = (t) =>
    ({
      pass: "[PASS]",
      fail: "[FAIL]",
      error: "[ERR] ",
      system: "[SYS] ",
      info: "[INFO]",
      warn: "[WARN]",
    })[t] ?? "[LOG] ";

  return (
    <section
      className={`pa-deck${collapsed ? " pa-deck--collapsed" : ""}`}
      aria-label="Captain's Log"
    >
      <div className="pa-deck-header">
        <div className="pa-deck-title">
          <span aria-hidden="true">📜</span> Captain's Log
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {!collapsed && loading && (
            <span className="pa-deck-loading">⚡ Consulting Davy Jones…</span>
          )}
          {!collapsed && (
            <span className="pa-deck-meta">{logs.length} entries</span>
          )}
          <button
            className="pa-deck-toggle"
            onClick={onToggle}
            aria-label={
              collapsed ? "Expand Captain's Log" : "Collapse Captain's Log"
            }
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div
          className="pa-terminal"
          ref={termRef}
          role="log"
          aria-live="polite"
        >
          {logs.length === 0 && !loading ? (
            <div className="pa-terminal-empty" aria-hidden="true">
              <span style={{ fontSize: "2rem", opacity: 0.35 }}>🌊</span>
              <span>Calm seas… submit yer code, Captain.</span>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={log.id ?? i} className={`pa-log ${log.type}`}>
                <span className="pa-log-pre" aria-hidden="true">
                  {log.icon ?? icon(log.type)}&nbsp;{prefix(log.type)}
                </span>
                <span className="pa-log-txt">{log.text}</span>
              </div>
            ))
          )}
          {loading && (
            <div className="pa-log info">
              <span className="pa-log-pre" aria-hidden="true">
                ◈ [INFO]
              </span>
              <span className="pa-log-txt">
                <span className="pa-cursor" aria-hidden="true" />
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ── 4e. Game Over Overlay ──────────────────────────────────────── */
function GameOverOverlay({ onRestart }) {
  return (
    <div
      className="pa-gameover"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="pa-go-title"
      aria-describedby="pa-go-desc"
    >
      <div className="pa-gameover-skulls" aria-hidden="true">
        ☠ ☠ ☠
      </div>
      <h2 id="pa-go-title" className="pa-gameover-title">
        ⚓ Shipwrecked! ⚓
      </h2>
      <p id="pa-go-desc" className="pa-gameover-sub">
        Ye've run out of lives, ye scurvy sailor.
        <br />
        The Kraken claims yer code — start anew, brave pirate.
      </p>
      <div className="pa-gameover-rule" aria-hidden="true" />
      <button
        id="pa-restart-btn"
        className="pa-btn-restart"
        onClick={onRestart}
        autoFocus
      >
        🏴‍☠️ &nbsp; Sail Again, Captain!
      </button>
      <p className="pa-gameover-epigraph">
        "A smooth sea never made a skilled pirate."
      </p>
    </div>
  );
}

/* ================================================================
   5. MAIN COMPONENT
   ================================================================ */
const MAX_LIVES = 3;
let LOG_ID = 0;

export default function PirateArena({ problemId = 1, onBack }) {
  const initialProblem =
    PROBLEMS.find((p) => p.id === problemId) || PROBLEMS[0];
  const [problem] = useState(initialProblem);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");

  const [lives, setLives] = useState(MAX_LIVES);
  const [bounty, setBounty] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [solved, setSolved] = useState(new Set());

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [shipwrecked, setShipwrecked] = useState(false);
  const [shatterIdx, setShatterIdx] = useState(-1);
  const [termCollapsed, setTermCollapsed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const editorRef = useRef(null);

  const addLog = useCallback(
    (type, text, icon) =>
      setLogs((prev) => [...prev, { id: ++LOG_ID, type, text, icon }]),
    [],
  );
  const clearLogs = useCallback(() => setLogs([]), []);

  const handleBack = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onBack();
    }, 250); // Matches the pa-arena-exit duration
  }, [onBack]);

  /* Language change */
  const handleLang = useCallback(
    (lang) => {
      if (loading) return;
      setLanguage(lang);
      setCode("");
      clearLogs();
      addLog("system", `Switched to ${lang.toUpperCase()} — editor cleared.`);
    },
    [loading, clearLogs, addLog],
  );

  /* Run */
  const handleRun = useCallback(async () => {
    if (loading || gameOver) return;
    setLoading(true);
    clearLogs();
    addLog("system", `▶ Running ${language.toUpperCase()} on sample input…`);
    try {
      const r = await runCode(code, language, problem);
      if (r.status === "success")
        r.output.split("\n").forEach((l) => addLog("info", l));
      else addLog("error", r.output);
    } catch (e) {
      addLog("error", `Runtime error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [loading, gameOver, code, language, problem, clearLogs, addLog]);

  /* Submit */
  const handleSubmit = useCallback(async () => {
    if (loading || gameOver) return;
    setLoading(true);
    clearLogs();
    addLog(
      "system",
      `🏴‍☠️ Submitting yer ${language.toUpperCase()} code to Davy Jones…`,
    );

    let result;
    try {
      result = await submitToJudge(code, language, problem);
    } catch (e) {
      addLog("error", `⚠️ Fatal error: ${e.message}`);
      setLoading(false);
      return;
    }

    result.results?.forEach((tc) =>
      addLog(
        tc.status === "pass" ? "pass" : "fail",
        `Test ${tc.id}: ${tc.status === "pass" ? "✓ PASS" : "✗ FAIL"} · Input: ${tc.input} · Expected: ${tc.expected} · Got: ${tc.actual} · ${tc.time}`,
      ),
    );

    if (result.status === "accepted") {
      addLog("pass", `⚓ ACCEPTED — ${result.message}`);
      addLog(
        "info",
        `💰 +${problem.bountyReward} doubloons added to yer bounty!`,
      );
      if (!solved.has(problem.id)) {
        setBounty((b) => b + problem.bountyReward);
        setSolved((prev) => new Set([...prev, problem.id]));
        setSpinning(true);
        setTimeout(() => setSpinning(false), 700);
      } else {
        addLog("info", "Already solved — no extra doubloons this run.");
      }
    } else {
      const next = lives - 1;
      // Trigger shatter on skull that is about to go dark
      setShatterIdx(next);
      setTimeout(() => setShatterIdx(-1), 750);

      if (next <= 0) {
        addLog("error", `☠️ SHIPWRECKED! — ${result.message}`);
        setShipwrecked(true);
        setTimeout(() => {
          setCode("");
          setShipwrecked(false);
          setLives(0);
          setGameOver(true);
        }, 1500);
      } else {
        setLives(next);
        addLog(
          "fail",
          `💀 WRONG ANSWER — ${result.message}  ·  ⚠️ ${next} ${next === 1 ? "life" : "lives"} remaining!`,
        );
      }
    }
    setLoading(false);
  }, [
    loading,
    gameOver,
    code,
    language,
    problem,
    lives,
    solved,
    clearLogs,
    addLog,
  ]);

  /* Restart */
  const handleRestart = useCallback(() => {
    setLives(MAX_LIVES);
    setBounty(0);
    setGameOver(false);
    setSolved(new Set());
    setShatterIdx(-1);
    setCode("");
    clearLogs();
    addLog("system", "⚓ A new voyage begins! Good luck, Captain.");
    setTimeout(() => editorRef.current?.focus(), 100);
  }, [clearLogs, addLog]);

  /* Reset code */
  const handleReset = useCallback(() => {
    if (loading || gameOver) return;
    setCode("");
    addLog("system", "Code reset to empty.");
  }, [loading, gameOver, addLog]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.shiftKey ? handleRun() : handleSubmit();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleSubmit, handleRun]);

  /* Welcome */
  useEffect(() => {
    addLog(
      "system",
      "⚓ Welcome to the Pirate DSA Arena! Brace yerself, sailor.",
    );
    addLog("system", `Problem loaded: "${PROBLEMS[0].title}"`);
    addLog("info", "Tip: Ctrl+Enter → Submit  ·  Shift+Ctrl+Enter → Run");
  }, []); // eslint-disable-line

  /* ── Render ─────────────────────────────────────── */
  return (
    <div className={`pirate-arena${isClosing ? " is-closing" : ""}`}>
      <Header
        lives={lives}
        bounty={bounty}
        shatterIdx={shatterIdx}
        spinning={spinning}
        maxLives={MAX_LIVES}
      />

      <div className="pa-split">
        {/* Left — Problem */}
        <ProblemPanel problem={problem} onBack={handleBack} />

        {/* Divider */}
        <div className="pa-divider-bar" aria-hidden="true" />

        {/* Right — Editor */}
        <section className="pa-editor-panel" aria-label="Code Editor Panel">
          {/* Toolbar */}
          <div className="pa-toolbar">
            {/* Left — status only */}
            <div className="pa-toolbar-left">
              <span
                className="pa-status-dot"
                aria-hidden="true"
                title="Editor ready"
              />
              {solved.has(problem.id) && (
                <span className="pa-solved-badge">✓ Plundered!</span>
              )}
            </div>

            {/* Right — language selector */}
            <select
              id="pa-lang-select"
              className="pa-lang-select"
              value={language}
              onChange={(e) => handleLang(e.target.value)}
              disabled={loading || gameOver}
              aria-label="Select programming language"
            >
              <option value="python">🧭 Python 3</option>
              <option value="javascript">💀 JavaScript</option>
              <option value="cpp">⚓ C++</option>
              <option value="java">🏴‍☠️ Java</option>
            </select>
          </div>

          {/* Action Bar */}
          <div className="pa-actions">
            {" "}
            <button
              id="pa-submit-btn"
              className="pa-btn pa-btn-submit"
              onClick={handleSubmit}
              disabled={loading || gameOver}
              title="Submit to all tests (Ctrl+Enter)"
            >
              {loading ? "⏳ Judging…" : "🏴‍☠️ Submit"}
            </button>
            <button
              id="pa-reset-btn"
              className="pa-btn pa-btn-reset"
              onClick={handleReset}
              disabled={loading || gameOver}
              title="Reset to starter template"
            >
              ↺ Reset
            </button>
            <span className="pa-kbd-hint">Ctrl+↵ Submit</span>
          </div>

          {/* Monaco */}
          <CodeEditor
            ref={editorRef}
            code={code}
            onChange={setCode}
            language={language}
            shipwrecked={shipwrecked}
          />

          {/* Terminal */}
          <LowerDeck
            logs={logs}
            loading={loading}
            collapsed={termCollapsed}
            onToggle={() => setTermCollapsed((v) => !v)}
          />

          {/* Game Over */}
          {gameOver && <GameOverOverlay onRestart={handleRestart} />}
        </section>
      </div>
    </div>
  );
}

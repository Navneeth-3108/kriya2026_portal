import { useRef, forwardRef, useImperativeHandle } from "react";
import MonacoEditor from "@monaco-editor/react";

// ─── High Seas Theme v2 ───────────────────────────────────────────────────────
const HIGH_SEAS_THEME = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "8c7761", fontStyle: "italic" },
    { token: "keyword", foreground: "deb059", fontStyle: "bold" },
    { token: "string", foreground: "8bd6ab" },
    { token: "number", foreground: "f0977d" },
    { token: "type", foreground: "9cc6de" },
    { token: "function", foreground: "ffd766" },
    { token: "variable", foreground: "e0eff5" },
    { token: "operator", foreground: "dfab46" },
    { token: "delimiter", foreground: "8bb9cf" },
    { token: "identifier", foreground: "cfe2ea" },
    { token: "class", foreground: "f2db9b", fontStyle: "bold" },
    { token: "regexp", foreground: "5de6d3" },
  ],
  colors: {
    "editor.background": "#120904",
    "editor.foreground": "#d8b898",
    "editor.lineHighlightBackground": "#301a0eaa",
    "editor.lineHighlightBorder": "#4a2a16",
    "editor.selectionBackground": "#c8912a28",
    "editor.selectionHighlightBackground": "#c8912a14",
    "editor.inactiveSelectionBackground": "#c8912a18",
    "editorCursor.foreground": "#f0b93a",
    "editorCursor.background": "#120904",
    "editorLineNumber.foreground": "#8a6141",
    "editorLineNumber.activeForeground": "#c8912a",
    "editorGutter.background": "#0f0703",
    "editorIndentGuide.background1": "#3b2210",
    "editorIndentGuide.activeBackground1": "#c8912a44",
    "editorWidget.background": "#1a0f07",
    "editorWidget.border": "#c8912a33",
    "editorSuggestWidget.background": "#1a0f07",
    "editorSuggestWidget.border": "#c8912a44",
    "editorSuggestWidget.selectedBackground": "#c8912a22",
    "editorSuggestWidget.foreground": "#d8b898",
    "editorBracketMatch.background": "#c8912a22",
    "editorBracketMatch.border": "#c8912a",
    "editorRuler.foreground": "#3b2210",
    "scrollbar.shadow": "#00000088",
    "scrollbarSlider.background": "#3d251088",
    "scrollbarSlider.hoverBackground": "#7a4a22aa",
    "scrollbarSlider.activeBackground": "#c8912a99",
    "minimap.background": "#0f0703",
    "minimapSlider.background": "#c8912a14",
    "minimapSlider.hoverBackground": "#c8912a28",
    "input.background": "#1a0f07",
    "input.border": "#c8912a44",
    focusBorder: "#c8912a",
    "list.hoverBackground": "#3b2210",
    "list.activeSelectionBackground": "#c8912a22",
    "dropdown.background": "#1a0f07",
    "dropdown.border": "#c8912a33",
    "badge.background": "#c8912a33",
    "badge.foreground": "#f0b93a",
  },
};

const MONACO_LANG_MAP = {
  python: "python",
  javascript: "javascript",
  cpp: "cpp",
  java: "java",
};

// ─── CodeEditor ───────────────────────────────────────────────────────────────
const CodeEditor = forwardRef(function CodeEditor(
  { code, onCodeChange, language, shipwrecked },
  ref,
) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus(),
    layout: () => editorRef.current?.layout(),
  }));

  function handleMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("high-seas-v2", HIGH_SEAS_THEME);
    monaco.editor.setTheme("high-seas-v2");

    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 13.5,
      fontFamily: '"Fira Code", "Courier Prime", monospace',
      fontLigatures: true,
      lineHeight: 23,
      padding: { top: 18, bottom: 18 },
      scrollBeyondLastLine: false,
      renderLineHighlight: "all",
      lineNumbers: "on",
      smoothScrolling: true,
      wordWrap: "off",
      tabSize: 4,
      automaticLayout: true,
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true, indentation: true },
      renderWhitespace: "selection",
      suggest: { showKeywords: true },
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        useShadows: true,
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
    });
  }

  return (
    <div
      className={shipwrecked ? "editor-shipwrecked" : ""}
      style={{ width: "100%", height: "100%" }}
      aria-label="Code editor"
    >
      <MonacoEditor
        height="100%"
        language={MONACO_LANG_MAP[language] ?? "javascript"}
        value={code}
        onChange={(val) => onCodeChange(val ?? "")}
        onMount={handleMount}
        theme="high-seas-v2"
        loading={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "0.6rem",
              fontFamily: "'Pirata One', cursive",
              fontSize: "1rem",
              color: "#c8912a",
              background: "#040a0e",
            }}
          >
            <span style={{ animation: "float 1.2s ease-in-out infinite" }}>
              ⚓
            </span>
            Rigging the Editor…
          </div>
        }
        options={{
          theme: "high-seas-v2",
          minimap: { enabled: false },
          lineNumbers: "on",
        }}
      />
    </div>
  );
});

export default CodeEditor;

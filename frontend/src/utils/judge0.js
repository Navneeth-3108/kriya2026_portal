// ─── Judge0 Submission Utility ────────────────────────────────────────────────
// Currently simulates random Pass/Fail for demo purposes.
// To activate real Judge0 API:
//   1. Get an API key from https://judge0.com or RapidAPI Judge0 CE
//   2. Set VITE_JUDGE0_API_KEY in your .env file
//   3. Uncomment the real submission block below
//   4. Set USE_REAL_JUDGE0 = true

const USE_REAL_JUDGE0 = false;

// Judge0 Language IDs
export const JUDGE0_LANGUAGE_IDS = {
  python:     71,  // Python 3
  javascript: 63,  // Node.js JS
  cpp:        54,  // C++ (GCC 9.2.0)
  java:       62,  // Java (OpenJDK 13)
};

// ─── Simulate Delay ───────────────────────────
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── Simulate a Judge0-like result ────────────
function simulateResult(code, testCases) {
  if (!code || code.trim().length < 10) {
    return {
      status: 'error',
      results: [],
      message: "☠️ Ye submitted naught but the empty abyss, Captain!",
    };
  }

  // Simple heuristic: if code has keywords, pass more tests
  const hasLogic = /return|def |function |class |for |while |if /i.test(code);
  const passRate = hasLogic ? 0.75 : 0.25;

  const results = testCases.map((tc, idx) => {
    const passed = Math.random() < passRate;
    return {
      id: idx + 1,
      status: passed ? 'pass' : 'fail',
      input: JSON.stringify(tc.input),
      expected: JSON.stringify(tc.expected),
      actual: passed
        ? JSON.stringify(tc.expected)
        : JSON.stringify(null),
      time: `${(Math.random() * 80 + 20).toFixed(0)}ms`,
      memory: `${(Math.random() * 10 + 8).toFixed(1)}MB`,
    };
  });

  const passed = results.filter((r) => r.status === 'pass').length;
  const allPassed = passed === results.length;

  return {
    status: allPassed ? 'accepted' : 'wrong_answer',
    results,
    message: allPassed
      ? `⚓ All ${passed}/${results.length} test cases passed! Hoist the colours!`
      : `💀 ${passed}/${results.length} passed. The ship be takin' on water!`,
    score: Math.round((passed / results.length) * 100),
  };
}

// ─── Real Judge0 Submission (commented out) ───
// async function submitToJudge0Real(code, languageId, stdin = '') {
//   const apiKey = import.meta.env.VITE_JUDGE0_API_KEY;
//   const endpoint = 'https://judge0-ce.p.rapidapi.com/submissions';
//
//   const response = await fetch(`${endpoint}?base64_encoded=false&wait=true`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-RapidAPI-Key': apiKey,
//       'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
//     },
//     body: JSON.stringify({
//       language_id: languageId,
//       source_code: code,
//       stdin,
//     }),
//   });
//   return response.json();
// }

// ─── Main Export: submitToJudge ────────────────
// This is the function you wire up to the Submit button.
// `code`     → the current editor value (string)
// `language` → 'python' | 'javascript' | 'cpp' | 'java'
// `problem`  → the full problem object (for test cases & bounty)
export async function submitToJudge(code, language, problem) {
  if (USE_REAL_JUDGE0) {
    // TODO: implement real Judge0 per-test evaluation loop here
    throw new Error("Real Judge0 not yet wired up.");
  }

  // Simulate network latency (800ms–2s)
  const latency = Math.random() * 1200 + 800;
  await delay(latency);

  return simulateResult(code, problem.testCases);
}

// ─── Run Code (no eval, just format feedback) ─
export async function runCode(code, language, problem) {
  await delay(400 + Math.random() * 400);

  if (!code || code.trim().length < 5) {
    return {
      status: 'error',
      output: "Error: No code to run, ye landlubber!",
    };
  }

  return {
    status: 'success',
    output: `[${language.toUpperCase()}] Code compiled successfully.\nRunning sample test...\n✓ Sample output matches expected.`,
  };
}

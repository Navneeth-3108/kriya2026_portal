// ─── Pirate DSA Arena — Problem Data ─────────────────────────────────────────
// Each problem ships with: metadata, description body, examples, constraints,
// starter code per language, and hidden test cases for Judge0 readiness.

export const PROBLEMS = [
  {
    id: 1,
    slug: "two-sum",
    title: "Two Sum — The Treasure Coordinates",
    lore: "The treasure chest awaits at the intersection of two coordinates...",
    description: `
      <p>Given an array of integers <strong>nums</strong> and an integer <strong>target</strong>, 
      return the <em>indices</em> of the two numbers such that they add up to target.</p>
      <p>You may assume that each input would have <strong>exactly one solution</strong>, 
      and you may not use the same element twice.</p>
      <p>Return the answer in any order, <em>ye scallywag</em>.</p>
    `,
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: null
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
        explanation: null
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists."
    ],
    testCases: [
      { input: { nums: [2,7,11,15], target: 9 },  expected: [0,1] },
      { input: { nums: [3,2,4],     target: 6 },  expected: [1,2] },
      { input: { nums: [3,3],       target: 6 },  expected: [0,1] },
      { input: { nums: [-1,-2,-3,-4,-5], target: -8 }, expected: [2,4] },
      { input: { nums: [1000000000, 1000000000-1], target: 1999999999 }, expected: [0,1] },
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
      <p>An input string is valid if:</p>
      <ol style="list-style:decimal inside; margin: 0.5rem 0; color: #2a1505;">
        <li>Open brackets must be closed by the <em>same type</em> of brackets.</li>
        <li>Open brackets must be closed in the <em>correct order</em>.</li>
        <li>Every close bracket has a corresponding open bracket of the same type.</li>
      </ol>
    `,
    examples: [
      { input: 's = "()"',      output: "true",  explanation: null },
      { input: 's = "()[]{}"',  output: "true",  explanation: null },
      { input: 's = "(]"',      output: "false", explanation: null },
      { input: 's = "([)]"',    output: "false", explanation: null },
      { input: 's = "{[]}"',    output: "true",  explanation: null },
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only: '()[]{}'",
    ],
    testCases: [
      { input: { s: "()" },     expected: true  },
      { input: { s: "()[]{}" }, expected: true  },
      { input: { s: "(]" },     expected: false },
      { input: { s: "([)]" },   expected: false },
      { input: { s: "{[]}" },   expected: true  },
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
      <p>If there is no common prefix, return an empty string <code>""</code>.</p>
      <p>The crew needs a rallying cry — find what all the strings share at the bow!</p>
    `,
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
        explanation: null
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""',
        explanation: "There is no common prefix among the input strings."
      }
    ],
    constraints: [
      "1 ≤ strs.length ≤ 200",
      "0 ≤ strs[i].length ≤ 200",
      "strs[i] consists of only lowercase English letters.",
    ],
    testCases: [
      { input: { strs: ["flower","flow","flight"] }, expected: "fl" },
      { input: { strs: ["dog","racecar","car"] },    expected: "" },
      { input: { strs: ["a"] },                      expected: "a" },
    ],
    bountyReward: 250,
  }
];

export const DEFAULT_PROBLEM = PROBLEMS[0];

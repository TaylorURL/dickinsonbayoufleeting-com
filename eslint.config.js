// Lint rules for the application source.
//
// React-specific and accessibility rules come from the react-app config that
// react-scripts runs during the build, so this file carries the rules that
// hold whether or not the build is running: the ones that catch a mistake
// rather than a style preference.

const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

const browserGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  console: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  fetch: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
  IntersectionObserver: "readonly",
  ResizeObserver: "readonly",
  matchMedia: "readonly",
  getComputedStyle: "readonly",
  URL: "readonly",
  Event: "readonly",
  CSS: "readonly",
  performance: "readonly",
  AbortController: "readonly",
  AbortSignal: "readonly",
  process: "readonly",
};

module.exports = [
  {
    ignores: ["build/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { react, "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // JSX counts as a use: without these, every component imported for
      // markup reads as an unused import.
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
      "react/jsx-key": "error",
      "react/no-danger": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      eqeqeq: ["error", "smart"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-alert": "error",
      "no-implied-eval": "error",
      "no-return-await": "error",
      "no-duplicate-imports": "error",
      "no-self-compare": "error",
      "no-unreachable-loop": "error",
      "no-constant-binary-expression": "error",
      "no-promise-executor-return": "error",
      "require-atomic-updates": "error",
    },
  },
];

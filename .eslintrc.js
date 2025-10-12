module.exports = {
  root: true,
  extends: ["universe", "universe/native"],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }]
  }
};

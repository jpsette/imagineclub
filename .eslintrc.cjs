module.exports = {
  root: true,
  env: { es2022: true, node: true, browser: true },
  ignorePatterns: ["**/.next/**", "**/dist/**", "**/.turbo/**", "node_modules/**"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      rules: {
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
      }
    }
  ]
};

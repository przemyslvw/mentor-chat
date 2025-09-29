module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-expressions": "off",
    "no-unused-expressions": "off",
    "import/no-unresolved": 0,
    "max-len": ["error", { code: 120 }],
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};

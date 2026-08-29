import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
  ...tseslint.configs.recommended.map((c) => ({ ...c, files: ["src/**/*.ts"] })),
  prettierConfig,
  {
    files: ["src/**/*.ts"],
    rules: {
      // Il codebase usa `any` per i payload upstream non tipizzati (Open-Meteo,
      // DPC, ARPA): introdurre tipi stretti per ogni fonte è fuori scope. La
      // tipizzazione progressiva resta desiderabile nei cicli futuri.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      // Test: trowing in mockImplementation è intenzionale
      "@typescript-eslint/no-empty-function": "off",
    },
  },
  {
    files: ["src/__tests__/**/*.ts"],
    rules: {
      // In test, assert su valori potenzialmente undefined è parte del setup
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  }
);

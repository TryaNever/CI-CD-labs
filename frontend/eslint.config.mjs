import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";
import jest from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{test,spec}.{js,jsx}", "**/__tests__/**/*.{js,jsx}"],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser: babelParser,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
      },
    },

    plugins: {
      react,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
    },
  },
];

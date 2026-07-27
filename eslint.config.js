import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Отключаем строгую проверку типов из старого JavaScript
      "react/prop-types": "off",
      // Отключаем требование писать импорт React в каждом файле
      "react/react-in-jsx-scope": "off",
    },
  }
);
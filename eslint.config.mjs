import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    // Add a rules object here to override the default configuration
    {
      rules: {
        // This line turns off the rule for all files
        "@typescript-eslint/no-explicit-any": "off",
      },
    }
  ),
];

export default eslintConfig;

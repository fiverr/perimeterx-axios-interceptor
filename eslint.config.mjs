import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/node_modules", "playground/dist"],
}, ...compat.extends(
    "@fiverr/eslint-config-fiverr/rules/base",
    "@fiverr/eslint-config-fiverr/rules/es6",
    "@fiverr/eslint-config-fiverr/rules/jest",
)];

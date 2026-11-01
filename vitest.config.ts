import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@\/utils\/masked-utils/,
        replacement: path.resolve(__dirname, "templates/masked-utils"),
      },
      {
        find: /^@\/styles\//,
        replacement: path.resolve(__dirname, "templates/masked-themes") + "/",
      },
    ],
  },
  test: { include: ["src/tests/**/*.test.{ts,tsx}"] },
});

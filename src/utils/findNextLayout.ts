import fs from "fs";
import path from "path";

export function findNextLayout(): string | null {
  const possiblePaths = [
    "src/app/layout.tsx",
    "src/app/layout.jsx",
    "app/layout.tsx",
    "app/layout.jsx",
  ];

  for (const p of possiblePaths) {
    const full = path.join(process.cwd(), p);
    if (fs.existsSync(full)) {
      return full;
    }
  }

  return null;
}

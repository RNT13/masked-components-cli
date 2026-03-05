import fs from "fs";

export function findProviders() {
  const possiblePaths = [
    "src/components/providers.tsx",
    "components/providers.tsx",
    "src/providers.tsx",
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return null;
}

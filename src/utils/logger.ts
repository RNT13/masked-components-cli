const colorEnabled = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

const wrap = (code: number) => (text: string) => (colorEnabled ? `\u001b[${code}m${text}\u001b[0m` : text);

export const paint = {
  bold: wrap(1),
  dim: wrap(2),
  red: wrap(31),
  green: wrap(32),
  yellow: wrap(33),
  cyan: wrap(36),
};

export const log = {
  info: (message: string) => console.log(message),
  step: (message: string) => console.log(`${paint.cyan("›")} ${message}`),
  success: (message: string) => console.log(`${paint.green("✔")} ${message}`),
  warn: (message: string) => console.warn(`${paint.yellow("⚠")} ${message}`),
  error: (message: string) => console.error(`${paint.red("✖")} ${message}`),
  blank: () => console.log(""),
};

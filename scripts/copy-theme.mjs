// Ships dist/theme.css for apps that already use Tailwind v4:
//   @import "tailwindcss";
//   @import "nr-ui-kit/theme.css";
// The @source line lets the consumer's Tailwind pick up classes used inside the package.
import { readFileSync, writeFileSync } from "node:fs";

const theme = readFileSync("src/styles/theme.css", "utf8");
writeFileSync("dist/theme.css", `/* nr-ui-kit theme — import after "tailwindcss" */\n@source "./index.js";\n\n${theme}`);
console.log("copy-theme: dist/theme.css");

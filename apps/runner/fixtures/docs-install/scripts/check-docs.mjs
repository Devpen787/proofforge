import { existsSync } from "node:fs";

console.log("Checking documented install flow...");

if (!existsSync("docs-ready.flag")) {
  console.error("Missing docs-ready.flag. The documented setup is incomplete.");
  process.exit(1);
}

console.log("Documented setup completed.");

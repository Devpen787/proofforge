import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 5173;
const baseUrl = `http://localhost:${port}`;
const routes = ["opportunity", "first-run", "projects", "work-queue", "run", "case-file", "maintainer", "scoreboard", "public-proof"];
const viewports = [
  { name: "desktop", width: 1440, height: 950 },
  { name: "phone", width: 390, height: 844 }
];

async function waitForServer() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function runSmoke() {
  const server = spawn("npm", ["run", "dev", "-w", "apps/web"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "0" }
  });

  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));

  try {
    await waitForServer();

    const browser = await chromium.launch({ headless: true });
    const results: Array<Record<string, string | number | boolean>> = [];

    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      for (const route of routes) {
        await page.goto(`${baseUrl}/#${route}`, { waitUntil: "networkidle" });
        const result = await page.evaluate(
          ({ route, viewportName }) => {
            const action = document.querySelector("main .primary-action, main .secondary-action, main .warning-action, main .danger-action");
            return {
              viewport: viewportName,
              route,
              width: window.innerWidth,
              scrollWidth: document.body.scrollWidth,
              overflow: document.body.scrollWidth > window.innerWidth + 1,
              hasAction: Boolean(action),
              heading: document.querySelector("main h2")?.textContent || ""
            };
          },
          { route, viewportName: viewport.name }
        );
        results.push(result);
      }
      await page.close();
    }

    await browser.close();
    console.table(results);

    const failures = results.filter((result) => result.overflow || !result.hasAction);
    if (failures.length) {
      console.error("Web smoke failures:");
      console.error(JSON.stringify(failures, null, 2));
      process.exitCode = 1;
    }
  } finally {
    server.kill("SIGTERM");
  }
}

runSmoke().catch((error) => {
  console.error(error);
  process.exit(1);
});

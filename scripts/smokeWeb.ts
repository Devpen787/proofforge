import { spawn } from "node:child_process";
import { chromium, type Page } from "playwright";

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

async function serverIsRunning() {
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch {
    return false;
  }
}

async function requireText(page: Page, text: string) {
  const content = await page.locator("body").textContent();
  if (!content?.includes(text)) {
    throw new Error(`Expected page to contain: ${text}`);
  }
}

async function runSmoke() {
  const useExistingServer = await serverIsRunning();
  const server = useExistingServer
    ? null
    : spawn("npm", ["run", "dev", "-w", "apps/web", "--", "--port", String(port), "--strictPort"], {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, FORCE_COLOR: "0" }
      });

  server?.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server?.stderr.on("data", (chunk) => process.stderr.write(chunk));

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

    console.table(results);

    const failures = results.filter((result) => result.overflow || !result.hasAction);
    if (failures.length) {
      console.error("Web smoke failures:");
      console.error(JSON.stringify(failures, null, 2));
      process.exitCode = 1;
    }

    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Run your first proof packet" }).click();
    await requireText(page, "Your first win in six steps.");
    await page.getByRole("button", { name: "Run safest starter mission" }).click();
    await requireText(page, "Mission lifecycle");
    await page.getByRole("button", { name: "Approve Packet" }).click();
    await requireText(page, "Evidence first. Code later.");
    await page.getByRole("button", { name: "Submit Packet" }).click();
    await requireText(page, "Review clean proof, not agent noise.");
    await page.getByRole("button", { name: "Accept & Mark Earned" }).first().click();
    await requireText(page, "Release the earned payout.");
    await page.getByRole("button", { name: "Release payout" }).first().click();
    await requireText(page, "$8 released");
    await page.getByRole("button", { name: "View public proof" }).click();
    await requireText(page, "Accepted Proof Packet");
    await page.goto(`${baseUrl}/#work-queue`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Import external task" }).click();
    await requireText(page, "Imported Work Lead ready for triage");
    await requireText(page, "External actionNone");
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Run your first proof packet" }).click();
    await page.getByRole("button", { name: "Run safest starter mission" }).click();
    await page.getByRole("button", { name: "Approve Packet" }).click();
    await page.getByRole("button", { name: "Submit Packet" }).click();
    await page.getByRole("button", { name: "Request Revision" }).click();
    await requireText(page, "Revision requested");
    await requireText(page, "full command transcript");
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Run your first proof packet" }).click();
    await page.getByRole("button", { name: "Run safest starter mission" }).click();
    await page.getByRole("button", { name: "Approve Packet" }).click();
    await page.getByRole("button", { name: "Submit Packet" }).click();
    await page.getByRole("button", { name: "Reject Packet" }).click();
    await requireText(page, "Packet rejected. Start again with stronger proof.");
    await requireText(page, "Earned payoutCancelled");
    await page.close();
    await browser.close();
    console.log("End-to-end proof journey smoke passed.");
  } finally {
    server?.kill("SIGTERM");
  }
}

runSmoke().catch((error) => {
  console.error(error);
  process.exit(1);
});

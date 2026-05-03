import { spawn } from "node:child_process";
import { chromium, type Page } from "playwright";

const port = 5174;
const baseUrl = `http://localhost:${port}`;
const routes = [
  "opportunity",
  "agent-setup",
  "first-run",
  "projects",
  "work-queue",
  "my-work",
  "builder-passport",
  "mission-detail",
  "run",
  "case-file",
  "maintainer",
  "scoreboard",
  "public-proof",
  "settings",
  "help"
];
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
  try {
    await page.waitForFunction(
      (expected) => document.body.textContent?.includes(expected),
      text,
      { timeout: 3_000 }
    );
  } catch {
    throw new Error(`Expected page to contain: ${text}`);
  }
}

async function runSmoke() {
  const useExistingServer = await serverIsRunning();
  const server = useExistingServer
    ? null
    : spawn(
        "npm",
        [
          "run",
          "dev",
          "-w",
          "apps/web",
          "--",
          "--port",
          String(port),
          "--strictPort"
        ],
        {
          stdio: ["ignore", "pipe", "pipe"],
          env: { ...process.env, FORCE_COLOR: "0" }
        }
      );

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
            const action = document.querySelector(
              "main .primary-action, main .secondary-action, main .warning-action, main .danger-action"
            );
            const heading =
              document.querySelector("main h1")?.textContent ||
              document.querySelector("main h2")?.textContent ||
              "";
            return {
              viewport: viewportName,
              route,
              width: window.innerWidth,
              scrollWidth: document.body.scrollWidth,
              overflow: document.body.scrollWidth > window.innerWidth + 1,
              hasAction: Boolean(action),
              heading
            };
          },
          { route, viewportName: viewport.name }
        );
        results.push(result);
      }
      await page.close();
    }

    console.table(results);

    const failures = results.filter(
      (result) => result.overflow || !result.hasAction
    );
    if (failures.length) {
      console.error("Web smoke failures:");
      console.error(JSON.stringify(failures, null, 2));
      process.exitCode = 1;
    }

    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 }
    });
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "See source-backed work" }).click();
    await requireText(page, "Choose sourced work.");
    await page.goto(`${baseUrl}/#projects`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open sourced inventory" }).click();
    await requireText(page, "Choose sourced work.");
    await page.goto(`${baseUrl}/#projects`, { waitUntil: "networkidle" });
    await requireText(page, "Work in this project.");
    await page.getByLabel("Project name").fill("ProofForge Smoke Project");
    await page
      .getByLabel("Project purpose")
      .fill("Make proof requests testable.");
    await page.getByRole("button", { name: "Save project" }).click();
    await requireText(page, "Create work request");
    await page.getByLabel("Work request title").fill("Smoke proof request");
    await page
      .getByLabel("Evidence request")
      .fill("Run a bounded smoke proof and package evidence.");
    await page.getByLabel("Reward").fill("$11");
    await page.getByLabel("Acceptance owner").fill("Smoke reviewer");
    await page.getByLabel("Contributor email").fill("smoke@builder.dev");
    await page.getByRole("button", { name: "Create request" }).click();
    await requireText(page, "Smoke proof request is ready.");
    await page.getByRole("button", { name: "Send request" }).click();
    await requireText(page, "Sent to smoke@builder.dev");
    await page.getByRole("button", { name: "Open as contributor" }).click();
    await requireText(page, "Smoke proof request");
    await requireText(page, "Smoke reviewer accepts");
    await page.goto(`${baseUrl}/#projects`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Find sourced work" }).click();
    await requireText(page, "Choose sourced work.");
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    if (
      (await page
        .getByRole("button", { name: "Set up proof node" })
        .count()) === 1
    ) {
      await page.getByRole("button", { name: "Set up proof node" }).click();
      await requireText(page, "Register the agent that will do the work.");
      await page.getByRole("button", { name: "Register proof node" }).click();
      await page
        .getByRole("button", { name: "Find source-backed work" })
        .click();
      await requireText(page, "Choose sourced work.");
    } else {
      await requireText(page, "Find work. Prove it. Get credited.");
    }
    await page.evaluate(() => {
      const savedState = JSON.parse(
        window.localStorage.getItem("proofforge.v1.demo-state") ?? "{}"
      );
      window.localStorage.setItem(
        "proofforge.v1.demo-state",
        JSON.stringify({
          ...savedState,
          activeMission: "docs",
          agentRegistered: true
        })
      );
    });
    await page.goto(`${baseUrl}/#mission-detail`, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await requireText(page, "Validate installation docs");
    await page.locator("main button.primary-action").first().click();
    await requireText(page, "Bounded agent run completed.");
    await page.getByRole("button", { name: "Cancel Run" }).click();
    await requireText(page, "Agent assessment");
    await page.getByRole("button", { name: "Authorize agent run" }).click();
    await requireText(page, "Bounded agent run completed.");
    await page.getByRole("button", { name: "Review evidence packet" }).click();
    await requireText(page, "Submit the proof packet.");
    await page.getByRole("button", { name: "Submit to maintainer" }).click();
    await requireText(page, "Accept the proof and create the earned record.");
    await page.getByRole("button", { name: "Review Packet" }).click();
    await requireText(page, "Evidence packet preview");
    await page.goto(`${baseUrl}/#maintainer`, { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Accept & Mark Earned" })
      .first()
      .click();
    await requireText(page, "Proof accepted.");
    await requireText(page, "Release the earned payout.");
    await page.getByRole("button", { name: "Release payout" }).first().click();
    await requireText(page, "Public proof and credit are ready.");
    await page.getByRole("button", { name: "View public proof" }).click();
    await requireText(page, "Public proof");
    await requireText(page, "Shared artifacts.");
    await requireText(page, "Credit");
    await page.getByRole("button", { name: "Copy public link" }).click();
    await requireText(page, "Public link copied");

    await page.goto(`${baseUrl}/#builder-passport`, {
      waitUntil: "networkidle"
    });
    await requireText(page, "Builder Passport / V2");
    await requireText(page, "Observed work only becomes credit");
    await requireText(page, "Hackathon prize readiness");
    await requireText(page, "Sponsor acceptance");
    await requireText(page, "V2 connection layer");
    await requireText(page, "Local JSON persistence ready");
    await page.getByRole("button", { name: "Open tracked projects" }).click();
    await requireText(page, "Work in this project.");

    await page.goto(`${baseUrl}/#settings`, { waitUntil: "networkidle" });
    await requireText(page, "Local V1 state");
    await requireText(page, "Browser local");
    await requireText(page, "Export workspace");
    await requireText(page, "Reset workspace");

    await page.goto(`${baseUrl}/#work-queue`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Import work" }).click();
    await requireText(page, "External QA task imported");
    await requireText(page, "Exact browser versions");
    await page.getByRole("button", { name: "Ask clarification" }).click();
    await requireText(page, "Browser targets are confirmed.");
    await page.getByRole("button", { name: "Convert" }).click();
    await requireText(page, "Ready to run.");
    await page.getByRole("button", { name: "Run converted mission" }).click();
    await requireText(page, "Checkout QA verification");
    await requireText(page, "Agent assessment");
    await page.getByRole("button", { name: "Authorize agent run" }).click();
    await requireText(page, "Runner / Checkout QA verification");
    await requireText(page, "Bounded agent run completed.");
    await page.getByRole("button", { name: "Review evidence packet" }).click();
    await requireText(
      page,
      "Verified checkout QA with clarified browser targets."
    );
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Start sourced proof" }).click();
    await page.getByRole("button", { name: "Review agent assessment" }).click();
    await page.getByRole("button", { name: "Authorize agent run" }).click();
    await page.getByRole("button", { name: "Review evidence packet" }).click();
    await page.getByRole("button", { name: "Submit to maintainer" }).click();
    await page.getByRole("button", { name: "Request Revision" }).click();
    await requireText(page, "Revision requested");
    await requireText(page, "full command transcript");
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Start sourced proof" }).click();
    await page.getByRole("button", { name: "Review agent assessment" }).click();
    await page.getByRole("button", { name: "Authorize agent run" }).click();
    await page.getByRole("button", { name: "Review evidence packet" }).click();
    await page.getByRole("button", { name: "Submit to maintainer" }).click();
    await page.getByRole("button", { name: "Reject Packet" }).click();
    await requireText(page, "Packet rejected.");
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

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
  "earnings",
  "trust-center",
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
      { timeout: 6_000 }
    );
  } catch {
    throw new Error(`Expected page to contain: ${text}`);
  }
}

async function requireAnyText(page: Page, texts: string[]) {
  try {
    await page.waitForFunction(
      (expectedTexts) =>
        expectedTexts.some((text) => document.body.textContent?.includes(text)),
      texts,
      { timeout: 6_000 }
    );
  } catch {
    throw new Error(`Expected page to contain one of: ${texts.join(", ")}`);
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

    let page = await browser.newPage({
      viewport: { width: 1280, height: 900 }
    });
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload({ waitUntil: "networkidle" });
    await page
      .locator("button.primary-action", { hasText: "Set up proof node" })
      .click();
    await requireAnyText(page, [
      "Register the agent that will do the work.",
      "Register the proof node."
    ]);
    await page.getByRole("button", { name: "Register proof node" }).click();
    await page.getByRole("button", { name: "Find source-backed work" }).click();
    await requireText(page, "Choose source-backed work.");
    await page.goto(`${baseUrl}/#projects`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Find sourced work" }).click();
    await requireText(page, "Choose source-backed work.");
    await page.goto(`${baseUrl}/#projects`, { waitUntil: "networkidle" });
    await requireText(page, "Docs Onboarding Sprint");
    await page.goto(`${baseUrl}/#projects`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Find sourced work" }).click();
    await requireText(page, "Choose source-backed work.");
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
      await requireText(page, "Choose source-backed work.");
    }
    await page.goto(`${baseUrl}/#work-queue`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Import", exact: true }).click();
    await requireText(page, "Ready to assess");
    await page.locator(".pf-source-import-row button.primary-action").click();
    await requireAnyText(page, [
      "Imported GitHub issue",
      "Original GitHub issue stays attached",
      "microsoft/vscode"
    ]);
    await page.close();
    const registeredContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      storageState: {
        cookies: [],
        origins: [
          {
            origin: baseUrl,
            localStorage: [
              {
                name: "proofforge.v1.demo-state",
                value: JSON.stringify({
                  activeMission: "docs",
                  agentRegistered: true,
                  packetReady: false,
                  submitted: false,
                  accepted: false,
                  released: false
                })
              }
            ]
          }
        ]
      }
    });
    page = await registeredContext.newPage();
    await page.goto(`${baseUrl}/?seed=registered#run`, {
      waitUntil: "networkidle"
    });
    await requireText(page, "Bounded run completed.");
    await page.getByRole("button", { name: "Cancel run" }).click();
    await requireText(page, "Validate installation docs");
    await page.getByRole("button", { name: "Authorize bounded run" }).click();
    await requireText(page, "Bounded run completed.");
    await page.getByRole("button", { name: "Review packet" }).click();
    await requireText(page, "Evidence first. Code later.");
    await page.getByRole("button", { name: "Submit to maintainer" }).click();
    await requireText(page, "Decide submitted proof.");
    await page.getByRole("button", { name: "Review" }).click();
    await requireText(page, "Maintainer summary");
    await page.goto(`${baseUrl}/#maintainer`, { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Accept & Mark Earned" })
      .first()
      .click();
    await requireText(page, "Track proof and earned value.");
    await requireText(page, "The payout is earned.");
    await page.getByRole("button", { name: "Release payout" }).first().click();
    await requireText(page, "Your accepted proof is now portable.");
    await page.getByRole("button", { name: "View public proof" }).click();
    await requireText(page, "Public proof");
    await requireText(page, "Shared artifacts.");
    await requireText(page, "Credit");
    await page.getByRole("button", { name: "Copy public link" }).click();
    await requireText(page, "Public link copied");

    await page.goto(`${baseUrl}/#builder-passport`, {
      waitUntil: "networkidle"
    });
    await requireText(page, "Portable contribution history");
    await requireText(page, "Agent work rolls up here.");
    await requireText(page, "Observed is not accepted");
    await requireText(page, "Recommended next work");
    await page.getByRole("button", { name: "Open My Work" }).click();
    await requireText(page, "Track proof and earned value.");

    await page.goto(`${baseUrl}/#settings`, { waitUntil: "networkidle" });
    await requireText(page, "Connections and demo readiness.");
    await requireText(page, "Work sources");
    await requireText(page, "0G-ready proof record");
    await requireText(page, "Export workspace");
    await requireText(page, "Reset workspace");

    await page.goto(`${baseUrl}/#work-queue`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Import work" }).click();
    await requireText(page, "External QA task imported");
    await requireText(page, "Exact browser versions");
    await page.getByRole("button", { name: "Ask clarification" }).click();
    await requireText(page, "Confirmed");
    await page.getByRole("button", { name: "Convert to mission" }).click();
    await requireText(page, "Run converted mission");
    await page.getByRole("button", { name: "Run converted mission" }).click();
    await requireText(page, "Checkout QA verification");
    await requireText(page, "Run only if this proof target is clear.");
    await page.getByRole("button", { name: "Authorize bounded run" }).click();
    await requireText(page, "Checkout QA verification");
    await requireText(page, "Bounded run completed.");
    await page.getByRole("button", { name: "Review packet" }).click();
    await requireText(page, "Checkout completes in Chrome");
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Start sourced proof" }).click();
    await page.getByRole("button", { name: "Review agent assessment" }).click();
    await page.getByRole("button", { name: "Authorize bounded run" }).click();
    await page.getByRole("button", { name: "Review packet" }).click();
    await page.getByRole("button", { name: "Submit to maintainer" }).click();
    await page.getByRole("button", { name: "Request Revision" }).click();
    await requireText(page, "Revision requested");
    await requireText(page, "clearer environment notes");
    await page.evaluate(() => {
      const savedState = JSON.parse(
        window.localStorage.getItem("proofforge.v1.demo-state") ?? "{}"
      );
      window.localStorage.setItem(
        "proofforge.v1.demo-state",
        JSON.stringify({
          ...savedState,
          activeMission: "docs",
          agentRegistered: true,
          accepted: false,
          released: false,
          packetReady: true,
          submitted: true,
          revisionRequested: false,
          rejected: false
        })
      );
    });
    await page.goto(`${baseUrl}/#maintainer`, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Reject" }).click();
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

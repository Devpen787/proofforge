import { spawn } from "node:child_process";
import { chromium, type Page } from "playwright";

const port = 5174;
const baseUrl = process.env.PROOFFORGE_BASE_URL ?? `http://localhost:${port}`;
const shouldStartLocalServer = !process.env.PROOFFORGE_BASE_URL;
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
  const content = await page.locator("body").textContent();
  if (!content?.includes(text)) {
    throw new Error(`Expected page to contain: ${text}`);
  }
}

async function runSmoke() {
  const useExistingServer = shouldStartLocalServer && (await serverIsRunning());
  const server =
    useExistingServer || !shouldStartLocalServer
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
    await page.getByRole("button", { name: "Set up proof node" }).click();
    await requireText(page, "Register the agent that will do the work.");
    await page.getByRole("button", { name: "Register proof node" }).click();
    await page.getByRole("button", { name: "Find source-backed work" }).click();
    await requireText(page, "Pick or triage work.");

    await page.goto(`${baseUrl}/#projects`, { waitUntil: "networkidle" });
    await requireText(page, "Work in this project.");
    await page.getByText("Sources, ledger, and V2 signals").click();
    await page.getByRole("button", { name: "Start project" }).click();
    await requireText(page, "Project started");
    await page.getByRole("button", { name: "Invite contributor" }).click();
    await requireText(page, "sam@builder.dev");
    await page.getByRole("button", { name: "Find sourced work" }).click();
    await requireText(page, "Pick or triage work.");

    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Start sourced proof" }).click();
    await requireText(page, "Nothing is submitted or paid until review.");
    await page
      .getByRole("button", { name: "Run safest earning mission" })
      .click();
    await requireText(page, "Ready to run");
    await requireText(page, "Confirm the work.");
    await page.getByRole("button", { name: "Accept and run" }).click();
    await requireText(page, "Docs issue found.");
    await page.getByRole("button", { name: "Cancel Run" }).click();
    await requireText(page, "Ready to run");
    await page.getByRole("button", { name: "Accept and run" }).click();
    await requireText(page, "Docs issue found.");
    await page.getByRole("button", { name: "Approve Packet" }).click();
    await requireText(page, "Send the proof, not agent noise.");
    await page.getByRole("button", { name: "Copy reviewer link" }).click();
    await requireText(page, "Reviewer link copied");
    const reviewerLink = await page.evaluate(() =>
      navigator.clipboard.readText().catch(() => "")
    );
    await page.getByRole("button", { name: "Copy GitHub CLI command" }).click();
    await requireText(page, "GitHub CLI command copied");
    await page.getByRole("button", { name: "Submit Packet" }).click();
    await requireText(page, "Accept the proof and create the earned record.");
    if (reviewerLink.includes("#maintainer?share=")) {
      const reviewerPage = await browser.newPage({
        viewport: { width: 1280, height: 900 }
      });
      await reviewerPage.goto(reviewerLink, { waitUntil: "networkidle" });
      await requireText(
        reviewerPage,
        "Accept the proof and create the earned record."
      );
      await reviewerPage.close();
    }
    await page.getByRole("button", { name: "Review Packet" }).click();
    await requireText(page, "Evidence packet preview");
    await page.goto(`${baseUrl}/#maintainer`, { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Accept & Mark Earned" })
      .first()
      .click();
    await requireText(page, "Proof accepted.");
    await page.goto(`${baseUrl}/#maintainer`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Connect MetaMask" }).click();
    await requireText(page, "Ready");
    await page
      .getByPlaceholder(/issuecomment/)
      .fill(
        "https://github.com/Devpen787/proofforge/issues/1#issuecomment-proof"
      );
    await page.getByRole("button", { name: "Record GitHub post" }).click();
    await requireText(page, "GitHub post recorded");
    await page.getByRole("button", { name: "Sign acceptance" }).click();
    await requireText(page, "Acceptance signed");
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await requireText(page, "Release the earned payout.");
    await page.getByRole("button", { name: "Release payout" }).first().click();
    await requireText(page, "Public proof and credit are ready.");
    await page.getByRole("button", { name: "View public proof" }).click();
    await requireText(page, "Public proof");
    await requireText(page, "Source and acceptance");
    await requireText(page, "Maintainer post");
    await requireText(page, "Shared artifacts.");
    await requireText(page, "Credit");
    await page.getByRole("button", { name: "Copy public link" }).click();
    await requireText(page, "Public link copied");

    await page.goto(`${baseUrl}/#settings`, { waitUntil: "networkidle" });
    await requireText(page, "Portable persistence");
    await requireText(page, "Import workspace file");
    await requireText(page, "Export network record");
    await requireText(page, "Export project record");
    await requireText(page, "Publish shared project");
    await page
      .getByPlaceholder("docs-onboarding-sprint")
      .fill("docs-onboarding-sprint-smoke");
    await page.getByRole("button", { name: "Publish shared project" }).click();
    await page
      .getByText("Published proofforge/project/docs-onboarding", {
        exact: false
      })
      .waitFor({ timeout: 5000 });
    await page.getByRole("button", { name: "Pull shared project" }).click();
    await page
      .getByText("Pulled Docs Onboarding Sprint", { exact: false })
      .waitFor({ timeout: 5000 });
    await page
      .getByPlaceholder("0x... or external receipt URL")
      .fill("https://etherscan.io/tx/0xproof");
    await page.getByRole("button", { name: "Record payout receipt" }).click();
    await requireText(page, "https://etherscan.io/tx/0xproof");

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

    await page.goto(`${baseUrl}/#work-queue`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Import external task" }).click();
    await requireText(page, "External QA task imported");
    await requireText(page, "Exact browser versions");
    await page.getByRole("button", { name: "Ask clarification" }).click();
    await requireText(page, "Browser targets are confirmed.");
    await page.getByRole("button", { name: "Convert" }).click();
    await requireText(page, "Ready to run.");
    await page.getByRole("button", { name: "Run converted mission" }).click();
    await requireText(page, "Checkout QA verification");
    await requireText(page, "Earn if accepted");
    await page.getByRole("button", { name: "Accept and run" }).click();
    await requireText(page, "Runner / Checkout QA verification");
    await requireText(page, "Docs issue found.");
    await page.getByRole("button", { name: "Approve Packet" }).click();
    await requireText(
      page,
      "Verified checkout QA with clarified browser targets."
    );

    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Start sourced proof" }).click();
    await page
      .getByRole("button", { name: "Run safest earning mission" })
      .click();
    await page.getByRole("button", { name: "Accept and run" }).click();
    await page.getByRole("button", { name: "Approve Packet" }).click();
    await page.getByRole("button", { name: "Submit Packet" }).click();
    await page.getByRole("button", { name: "Request Revision" }).click();
    await requireText(page, "Revision requested");
    await requireText(page, "full command transcript");
    await page.goto(`${baseUrl}/#opportunity`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Start sourced proof" }).click();
    await page
      .getByRole("button", { name: "Run safest earning mission" })
      .click();
    await page.getByRole("button", { name: "Accept and run" }).click();
    await page.getByRole("button", { name: "Approve Packet" }).click();
    await page.getByRole("button", { name: "Submit Packet" }).click();
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

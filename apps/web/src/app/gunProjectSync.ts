import type { ProofForgeProjectRecord } from "./projectRecords";

type GunOptions = {
  peers?: string[];
  localStorage?: boolean;
};

type GunConstructor = (options?: GunOptions) => GunRoot;

type GunRoot = {
  get: (key: string) => GunChain;
};

type GunChain = {
  get: (key: string) => GunChain;
  put: (value: unknown, cb?: (ack: unknown) => void) => GunChain;
  once: (cb: (value: unknown) => void) => void;
};

export interface GunProjectSyncOptions {
  key: string;
  peerUrl?: string;
}

export function normalizeProjectSyncKey(key: string) {
  return (
    key
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9:_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "docs-onboarding-sprint"
  );
}

function nodeKey(key: string) {
  return `proofforge/project/${normalizeProjectSyncKey(key)}`;
}

async function createGun(peerUrl?: string): Promise<GunRoot> {
  const module = (await import("gun")) as unknown as {
    default: GunConstructor;
  };
  const peers = peerUrl?.trim() ? [peerUrl.trim()] : undefined;
  return module.default({
    peers,
    localStorage: true
  });
}

function cleanGunMetadata(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const { _: _metadata, ...rest } = value as Record<string, unknown>;
  void _metadata;
  return rest;
}

function serializeRecord(record: ProofForgeProjectRecord) {
  return {
    version: "proof-gun-project-sync/v1",
    recordId: record.id,
    projectId: record.project.id,
    updatedAt: new Date().toISOString(),
    recordJson: JSON.stringify(record)
  };
}

function parseSyncedRecord(value: unknown) {
  const cleaned = cleanGunMetadata(value) as { recordJson?: unknown };
  if (typeof cleaned.recordJson !== "string") {
    throw new Error("GUN node did not contain a project record payload.");
  }
  return JSON.parse(cleaned.recordJson) as unknown;
}

function assertProjectRecord(
  value: unknown
): asserts value is ProofForgeProjectRecord {
  const record = value as Partial<ProofForgeProjectRecord>;
  if (record.version !== "proof-project-record/v1" || !record.state) {
    throw new Error("GUN node did not contain a ProofForge project record.");
  }
}

export async function publishProjectRecordToGun(
  record: ProofForgeProjectRecord,
  options: GunProjectSyncOptions
) {
  const gun = await createGun(options.peerUrl);
  const key = nodeKey(options.key);
  await new Promise<void>((resolve, reject) => {
    gun.get(key).put(serializeRecord(record), (ack: unknown) => {
      const maybeError = ack as { err?: string };
      if (maybeError?.err) reject(new Error(maybeError.err));
      else resolve();
    });
    window.setTimeout(resolve, 750);
  });
  return key;
}

export async function pullProjectRecordFromGun(
  options: GunProjectSyncOptions
): Promise<ProofForgeProjectRecord> {
  const gun = await createGun(options.peerUrl);
  const key = nodeKey(options.key);

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error(`Timed out reading ${key}.`));
    }, 3500);

    gun.get(key).once((value: unknown) => {
      window.clearTimeout(timeout);
      const record = parseSyncedRecord(value);
      try {
        assertProjectRecord(record);
        resolve(record);
      } catch (error) {
        reject(error);
      }
    });
  });
}

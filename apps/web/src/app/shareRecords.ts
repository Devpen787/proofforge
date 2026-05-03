import type { AppState } from "./types";
import type { SavedAppState } from "./workspaceState";

export type ShareTarget = "maintainer" | "public-proof";

export type ShareState = Partial<Omit<AppState, "screen">>;

export function extractShareState(state: AppState): ShareState {
  const { screen: _screen, ...shareState } = state;
  void _screen;
  return shareState;
}

function toBase64Url(value: string) {
  const encoded = window.btoa(unescape(encodeURIComponent(value)));
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return decodeURIComponent(escape(window.atob(padded)));
}

export function buildShareUrl(target: ShareTarget, state: ShareState) {
  const url = new URL(window.location.href);
  const route = target === "maintainer" ? "maintainer" : "public-proof";
  const payload = toBase64Url(JSON.stringify(state));
  url.hash = `${route}?share=${payload}`;
  return url.toString();
}

export function readSharedStateFromHash(): Partial<SavedAppState> | null {
  if (typeof window === "undefined") return null;
  const [, query = ""] = window.location.hash.split("?");
  const share = new URLSearchParams(query).get("share");
  if (!share) return null;

  try {
    return JSON.parse(fromBase64Url(share)) as Partial<SavedAppState>;
  } catch {
    return null;
  }
}

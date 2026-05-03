import type { AppState } from "./types";

export type ShareTarget = "maintainer" | "public-proof";
export type SharedAppState = Partial<Omit<AppState, "screen">>;

export function extractShareState(state: AppState): SharedAppState {
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

export function buildShareUrl(target: ShareTarget, state: SharedAppState) {
  const url = new URL(window.location.href);
  const route = target === "maintainer" ? "maintainer" : "public-proof";
  url.hash = `${route}?share=${toBase64Url(JSON.stringify(state))}`;
  return url.toString();
}

export function readSharedStateFromHash(): SharedAppState | null {
  if (typeof window === "undefined") return null;
  const [, query = ""] = window.location.hash.split("?");
  const share = new URLSearchParams(query).get("share");
  if (!share) return null;

  try {
    return JSON.parse(fromBase64Url(share)) as SharedAppState;
  } catch {
    return null;
  }
}

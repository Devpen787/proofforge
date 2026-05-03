import React from "react";
import type { Tone } from "../app/types";

export function RunnerTimeline({
  steps
}: {
  steps: Array<{
    label: string;
    detail: string;
    status: string;
    artifact: string;
  }>;
}) {
  return (
    <ol className="runner-timeline">
      {steps.map((step, index) => (
        <li
          className={step.status === "approval" ? "approval" : "complete"}
          key={step.label}
        >
          <span>{index + 1}</span>
          <div>
            <strong>{step.label}</strong>
            <small>{step.detail}</small>
            <code>{step.artifact}</code>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function StatusBlock({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="status-block">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function StatusRow({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: Tone;
}) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <b className={tone}>{value}</b>
    </div>
  );
}

export function NavButton({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={active ? "nav-button active" : "nav-button"}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

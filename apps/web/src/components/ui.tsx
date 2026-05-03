import React from "react";
import type { Tone } from "../app/types";

export function PageSurface({
  className = "",
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`pf-page-surface ${className}`}>{children}</section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="pf-page-header">
      <div>
        {eyebrow ? <p className="small-label">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="pf-page-actions">{actions}</div> : null}
    </header>
  );
}

export function DetailPane({
  title,
  eyebrow,
  children,
  action
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <aside className="pf-detail-pane">
      {eyebrow ? <p className="small-label">{eyebrow}</p> : null}
      <h2>{title}</h2>
      <div className="pf-detail-body">{children}</div>
      {action ? <div className="pf-detail-action">{action}</div> : null}
    </aside>
  );
}

export function MetricStrip({
  metrics
}: {
  metrics: Array<{ label: string; value: string; detail?: string }>;
}) {
  return (
    <div className="pf-metric-strip">
      {metrics.map((metric) => (
        <div className="pf-metric" key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
          {metric.detail ? <small>{metric.detail}</small> : null}
        </div>
      ))}
    </div>
  );
}

export function RowList({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`pf-row-list ${className}`}>{children}</div>;
}

export function ActionBar({ children }: { children: React.ReactNode }) {
  return <div className="pf-action-bar">{children}</div>;
}

export function EmptyState({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="pf-empty-state">
      <h2>{title}</h2>
      <p>{body}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

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
      type="button"
      className={active ? "nav-button active" : "nav-button"}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

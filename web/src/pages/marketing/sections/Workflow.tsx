import { useState, type KeyboardEvent } from "react";
import { Kbd } from "@/components/ui/misc";
import { shortcutHint, shortcuts, workflow } from "@/pages/marketing/content/copy";
import { Section } from "./ui";

export default function Workflow() {
  return (
    <Section eyebrow={workflow.eyebrow} title={workflow.title} lede={workflow.lede}>
      <ol className="mk-steps">
        {workflow.steps.map((step, index) => (
          <li key={step.title} className="mk-card">
            <span className="mk-step-index">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mk-step-title">{step.title}</h3>
            <p className="mk-step-text">{step.text}</p>
          </li>
        ))}
      </ol>
      <ul className="mk-grid is-facts">
        {workflow.facts.map((fact) => (
          <li key={fact.title} className="mk-card">
            <h3 className="mk-card-title">{fact.title}</h3>
            <p className="mk-card-text">{fact.text}</p>
          </li>
        ))}
      </ul>
      <ShortcutPreview />
    </Section>
  );
}

function ShortcutPreview() {
  const [active, setActive] = useState<string | null>(null);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const id = shortcutId(event);
    if (!id) return;
    event.preventDefault();
    setActive(id);
  };
  return (
    <div
      className="mk-kbd"
      tabIndex={0}
      role="region"
      onKeyDown={onKeyDown}
      aria-label="Shortcut preview"
      aria-describedby="mk-shortcut-hint"
    >
      <p className="mk-eyebrow">Keyboard</p>
      <ul className="mk-kbd-list">
        {shortcuts.map((row) => (
          <li key={row.id} data-active={active === row.id ? "true" : "false"}>
            <span>{row.label}</span>
            <span className="mk-kbd-keys">
              {row.keys.map((key) => <Kbd key={key}>{key}</Kbd>)}
            </span>
          </li>
        ))}
      </ul>
      <p id="mk-shortcut-hint" className="mk-note">{shortcutHint}</p>
    </div>
  );
}

function shortcutId(event: KeyboardEvent<HTMLDivElement>): string | null {
  const key = event.key.toLowerCase();
  const mod = event.metaKey || event.ctrlKey;
  if (mod && key === "k") return "palette";
  if (mod && key === "j") return "copilot";
  if (mod || event.altKey) return null;
  if (key === "j" || key === "k") return "move";
  if (key === "e") return "archive";
  if (key === "r") return "reply";
  if (key === "/") return "search";
  return null;
}

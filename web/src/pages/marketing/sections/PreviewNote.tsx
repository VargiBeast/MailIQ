import { PREVIEW_NOTE } from "@/pages/marketing/content/copy";

export default function PreviewNote() {
  return (
    <aside className="mk-section is-quiet" aria-label="Preview">
      <div className="mk-preview-chip mk-glass">
        <p className="mk-eyebrow">Preview</p>
        <p className="mk-lede">{PREVIEW_NOTE}</p>
      </div>
    </aside>
  );
}

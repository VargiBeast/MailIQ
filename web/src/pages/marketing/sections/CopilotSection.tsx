import { useId, type ReactNode } from "react";
import { copilotSection } from "@/pages/marketing/content/copy";
import { BulletList, SectionHeading, useReveal, VisualSlot } from "./ui";
import { cn } from "@/lib/cn";

export default function CopilotSection({ demo }: { demo?: ReactNode }) {
  const titleId = useId();
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="mk-section mk-glow" aria-labelledby={titleId}>
      <div ref={reveal.ref} className={cn("mk-split", reveal.className)}>
        <div>
          <SectionHeading eyebrow={copilotSection.eyebrow} title={copilotSection.title} lede={copilotSection.lede} titleId={titleId} />
          <BulletList items={copilotSection.points} />
        </div>
        <VisualSlot demo={demo} stage="plan" />
      </div>
    </section>
  );
}

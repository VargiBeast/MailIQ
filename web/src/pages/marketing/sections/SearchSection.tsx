import { useId, type ReactNode } from "react";
import { searchSection } from "@/pages/marketing/content/copy";
import { BulletList, SectionHeading, useReveal, VisualSlot } from "./ui";
import { cn } from "@/lib/cn";

export default function SearchSection({ demo }: { demo?: ReactNode }) {
  const titleId = useId();
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="mk-section" aria-labelledby={titleId}>
      <div ref={reveal.ref} className={cn("mk-split is-reverse", reveal.className)}>
        <div>
          <SectionHeading eyebrow={searchSection.eyebrow} title={searchSection.title} lede={searchSection.lede} titleId={titleId} />
          <BulletList items={searchSection.points} />
        </div>
        <VisualSlot demo={demo} stage="search" />
      </div>
    </section>
  );
}

import type { ReactNode } from "react";
import { CheckCircle2, MessageSquareText, Pencil, Sparkles, Tags } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { aiFeatures } from "@/pages/marketing/content/copy";
import { CardGrid, SectionHeading, useReveal, VisualSlot } from "./ui";

const icons: readonly LucideIcon[] = [CheckCircle2, MessageSquareText, Sparkles, Pencil, Tags];

export default function AiFeatures({ demo }: { demo?: ReactNode }) {
  const reveal = useReveal<HTMLDivElement>();
  const titleId = "mk-features-title";
  const cards = aiFeatures.items.flatMap((item, index) => {
    const icon = icons[index];
    return icon ? [{ title: item.title, text: item.text, icon }] : [];
  });
  return (
    <section id={aiFeatures.id} className="mk-section mk-glow" aria-labelledby={titleId}>
      <div ref={reveal.ref} className={reveal.className}>
        <SectionHeading eyebrow={aiFeatures.eyebrow} title={aiFeatures.title} lede={aiFeatures.lede} titleId={titleId} />
        <div className="mk-feature-layout">
          <CardGrid items={cards} />
          <VisualSlot demo={demo} stage="summary" />
        </div>
      </div>
    </section>
  );
}

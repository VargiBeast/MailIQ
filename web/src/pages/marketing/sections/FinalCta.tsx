import type { ReactNode } from "react";
import { finalCta } from "@/pages/marketing/content/copy";
import { Section } from "./ui";

export default function FinalCta({ signIn }: { signIn: ReactNode }) {
  return (
    <Section eyebrow={finalCta.eyebrow} title={finalCta.title} lede={finalCta.lede} glow center>
      <div className="mk-cta">
        <div className="mk-signin">{signIn}</div>
        <p className="mk-note">{finalCta.helper}</p>
      </div>
    </Section>
  );
}

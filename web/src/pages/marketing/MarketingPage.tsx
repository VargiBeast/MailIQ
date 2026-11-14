import type { ReactNode } from "react";
import "./marketing.css";
import MarketingNav from "./nav/MarketingNav";
import Hero from "./hero/Hero";
import Showcase from "./showcase/Showcase";
import PreviewNote from "./sections/PreviewNote";
import AiFeatures from "./sections/AiFeatures";
import DailyBriefSection from "./sections/DailyBriefSection";
import UnifiedInbox from "./sections/UnifiedInbox";
import SearchSection from "./sections/SearchSection";
import CopilotSection from "./sections/CopilotSection";
import Workflow from "./sections/Workflow";
import PrivacySection from "./sections/PrivacySection";
import Faq from "./sections/Faq";
import FinalCta from "./sections/FinalCta";
import MarketingFooter from "./sections/MarketingFooter";
import LazyDemo from "./demos/LazyDemo";
import SignInLink from "./SignInLink";

export type MarketingPageProps = {
  /** Optional notice (error / deleted / not_configured banners) rendered in the hero. */
  notice?: ReactNode;
};

/**
 * Full marketing landing page. Assembles Lisa’s sections and John’s hero,
 * showcase, and demos. Sign-in is the shared SignInLink slot.
 */
export default function MarketingPage({ notice }: MarketingPageProps) {
  const primarySignIn = <SignInLink variant="primary" />;
  const navSignIn = <SignInLink variant="compact" />;

  return (
    <div className="mk-page dark min-h-full overflow-x-hidden bg-[var(--bg)] text-fg">
      <MarketingNav signIn={navSignIn} />
      <main id="main">
        <Hero signIn={primarySignIn} notice={notice} />
        <PreviewNote />
        <Showcase />
        <AiFeatures demo={<LazyDemo name="summary" />} />
        <DailyBriefSection demo={<LazyDemo name="brief" />} />
        <UnifiedInbox demo={<LazyDemo name="inbox" />} />
        <SearchSection demo={<LazyDemo name="search" />} />
        <CopilotSection demo={<LazyDemo name="copilot" />} />
        <Workflow />
        <PrivacySection />
        <Faq />
        <FinalCta signIn={primarySignIn} />
      </main>
      <MarketingFooter />
    </div>
  );
}

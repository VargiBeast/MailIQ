import { lazy, Suspense } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { useSession } from "@/lib/session";
import { Splash } from "@/components/Splash";

const MarketingPage = lazy(() => import("@/pages/marketing/MarketingPage"));

const ERRORS: Record<string, string> = {
  access_denied: "You cancelled Google sign-in. MailIQ needs your permission to show your mail.",
  not_configured: "Google sign-in isn't configured on this server yet.",
  state_invalid: "Your sign-in link expired or was tampered with. Please try again.",
  state_missing: "Your sign-in session expired (cookies may be blocked). Please try again.",
  email_unverified: "Your Google account's email address isn't verified.",
  session_required: "Please sign in first.",
  session_mismatch: "You were signed out while connecting an account. Please sign in again.",
};

export function LandingPage() {
  const { session, config, loading } = useSession();
  const [params] = useSearchParams();
  const error = params.get("error");
  const deleted = params.get("deleted") === "1";
  const next = params.get("next");

  if (loading) return <Splash />;
  if (session?.user && !error) {
    return <Navigate to={next && next.startsWith("/app") ? next : "/app"} replace />;
  }

  const googleReady = config?.google !== false;
  const showNotice = Boolean(error || deleted || !googleReady);

  const notice = showNotice ? (
    <div
      role={error ? "alert" : "status"}
      className={`mx-auto flex max-w-md items-start gap-2 rounded-xl border px-4 py-3 text-left text-[13.5px] ${
        error || !googleReady ? "border-warning/40 bg-warning/10" : "border-success/40 bg-success/10"
      }`}
    >
      {error || !googleReady ? (
        <Icon icon={TriangleAlert} className="mt-0.5 shrink-0 text-warning" />
      ) : (
        <Icon icon={CheckCircle2} className="mt-0.5 shrink-0 text-success" />
      )}
      <span className="text-fg-2">
        {deleted
          ? "Your MailIQ data was deleted and Google access revoked."
          : error
            ? (ERRORS[error] ?? "Sign-in didn't complete. Please try again.")
            : "Google sign-in isn't configured on this server. The owner needs to add Google OAuth credentials (see docs/SETUP.md)."}
      </span>
    </div>
  ) : null;

  return (
    <Suspense fallback={<Splash />}>
      <MarketingPage notice={notice} />
    </Suspense>
  );
}

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useDictation } from "@/lib/speech";

export const DICTATION_PRIVACY = "Speech is turned into text by your browser. MailIQ never receives or stores audio.";

/**
 * Microphone toggle for dictation. Final phrases go to `onText`; when `onPhrase` returns true it has handled the phrase
 * itself (e.g. a voice command) and the text isn't inserted. Falls back to an explanation where the Web Speech API is missing.
 */
export function MicButton({ onText, onPhrase, size = "md", className, label = "Dictate" }: {
  onText: (text: string) => void;
  onPhrase?: (text: string) => boolean;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}) {
  const d = useDictation({ onFinal: (t) => { if (t && !onPhrase?.(t)) onText(t); } });

  useEffect(() => {
    if (d.error) {
      toast.error(d.error);
      d.clearError();
    }
  }, [d]);

  if (!d.supported) {
    return (
      <IconButton
        label={`${label} (not supported in this browser)`}
        size={size}
        className={cn("opacity-50", className)}
        data-mic=""
        data-mic-unsupported=""
        onClick={() => toast("Voice dictation isn't available in this browser", { description: "Try Chrome, Edge or Safari, or use your keyboard's dictation key." })}
      >
        <Icon icon={MicOff} size={size === "sm" ? "md" : "lg"} />
      </IconButton>
    );
  }
  return (
    <span className="relative inline-flex">
      <IconButton
        label={d.listening ? "Stop dictation" : `${label}: ${DICTATION_PRIVACY}`}
        size={size}
        active={d.listening}
        aria-pressed={d.listening}
        className={cn(d.listening && "text-danger", className)}
        data-mic=""
        onClick={d.toggle}
      >
        <Icon icon={Mic} size={size === "sm" ? "md" : "lg"} className={d.listening ? "animate-pulse" : undefined} />
      </IconButton>
      {d.listening && (
        <span role="status" aria-live="polite" className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 max-w-[260px] truncate rounded-lg border border-line bg-surface px-2.5 py-1 text-[12px] text-fg-2 shadow-[var(--shadow)]">
          {d.interim ? `“${d.interim}”` : "Listening…"}
        </span>
      )}
    </span>
  );
}

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import type { ThreadDetail } from "@shared/mail";
import { IconButton } from "@/components/ui/Button";
import { useIsReadLater, useToggleReadLater } from "@/lib/readLater";

/** Toggle the open conversation in the Read later list (shortcut: b). */
export function ReadLaterButton({ thread }: { thread: ThreadDetail }) {
  const saved = useIsReadLater(thread.accountId, thread.id);
  const toggle = useToggleReadLater();
  const run = () => toggle.mutate({ accountId: thread.accountId, threadId: thread.id, save: !saved }, {
    onSuccess: () => toast.success(saved ? "Removed from Read later" : "Saved to Read later"),
  });
  return (
    <IconButton label="Read later (b)" aria-pressed={saved} onClick={run} data-read-later-trigger="">
      {saved ? <Icon icon={BookmarkCheck} size="lg" active className="text-accent-ink" /> : <Icon icon={Bookmark} size="lg" />}
    </IconButton>
  );
}

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useQueryClient } from "@tanstack/react-query";
import { Archive, Clock, Inbox, Loader2, Mail, MailOpen, Tag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { ThreadSummary } from "@shared/mail";
import { api, errorMessage } from "@/lib/api";
import { useLabels } from "@/lib/mail";
import { snoozePresets } from "@/lib/snooze";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuTrigger } from "@/components/ui/Menu";
import { cn } from "@/lib/cn";
import { Tooltip } from "@/components/ui/Tooltip";
import { plural, runBulk, undoToast, type BulkAction } from "@/lib/bulk";


const PAST: Record<string, string> = { archive: "Archived", inbox: "Moved to Inbox", trash: "Moved to Trash", read: "Marked as read", unread: "Marked as unread", label_add: "Labelled", untrash: "Restored" };

/** Bulk actions for selected conversations. Every action can be undone from its toast. */
export function BulkBar({ selected, allVisible, onSelectAll, onClear, folder }: {
  selected: ThreadSummary[];
  allVisible: boolean;
  onSelectAll: (on: boolean) => void;
  onClear: () => void;
  folder: string;
}) {
  const qc = useQueryClient();
  const labels = useLabels();
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmTrash, setConfirmTrash] = useState(false);
  const n = selected.length;
  const refresh = () => {
    for (const k of ["threads", "thread", "labels", "snoozes"]) void qc.invalidateQueries({ queryKey: [k] });
  };

  const act = async (action: BulkAction, label?: { name: string }) => {
    const items = [...selected];
    setBusy(action);
    try {
      const labelFor = label ? (acc: string) => labels.data?.accounts.find((a) => a.accountId === acc)?.labels.find((l) => l.name === label.name)?.id : undefined;
      const res = await runBulk(action, items, labelFor);
      const ok = res.reduce((s, x) => s + x.r.ok, 0);
      const failed = res.reduce((s, x) => s + x.r.failed, 0);
      onClear();
      refresh();
      undoToast(qc, `${PAST[action] ?? "Updated"} ${plural(ok)}${label ? ` with “${label.name}”` : ""}`, res, { description: failed ? `${failed} couldn't be changed.` : undefined });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const snooze = async (until: Date, label: string) => {
    const items = [...selected];
    setBusy("snooze");
    let ok = 0;
    try {
      for (const t of items) {
        await api.post("/mail/snoozes", { accountId: t.accountId, threadId: t.id, until: until.toISOString(), kind: "snooze" });
        ok++;
      }
      onClear();
      refresh();
      toast.success(`Snoozed ${plural(ok)} until ${label.toLowerCase()}`, {
        action: {
          label: "Undo",
          onClick: async () => {
            for (const t of items) await api.del(`/mail/snoozes/${t.accountId}/${t.id}`).catch(() => {});
            refresh();
            toast("Undone");
          },
        },
      });
    } catch (err) {
      refresh();
      toast.error(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const userLabels = [...new Map((labels.data?.accounts ?? []).flatMap((a) => a.labels.filter((l) => l.type === "user" && l.name !== "Snoozed")).map((l) => [l.name, l])).values()];
  const anyUnread = selected.some((t) => t.unread);
  const inTrash = folder === "trash";
  const btn = "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-fg-2 hover:bg-surface-3 hover:text-fg disabled:opacity-40 pointer-coarse:min-h-11 pointer-coarse:min-w-11";
  const spin = (a: string, icon: React.ReactNode) => (busy === a ? <><Icon icon={Loader2} size="sm" className="animate-spin" /><span>Loading…</span></> : icon);

  return (
    <div
      role="toolbar"
      aria-label={`Bulk actions for ${plural(n)}`}
      className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-1 overflow-x-auto border-t border-line bg-surface px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 shadow-[var(--shadow)] scroll-thin animate-in lg:sticky lg:top-1 lg:mx-2 lg:mb-1 lg:rounded-xl lg:border lg:pb-2 lg:shadow-none"
    >
      <input
        type="checkbox"
        aria-label="Select all visible conversations"
        checked={allVisible}
        onChange={(e) => onSelectAll(e.target.checked)}
        className="ml-1 size-4 shrink-0 accent-[var(--accent)] pointer-coarse:size-11"
      />
      <span className="mr-1 shrink-0 px-1 text-[12.5px] font-semibold text-fg" aria-live="polite">{n} selected</span>
      {inTrash ? (
        <button type="button" className={btn} disabled={busy !== null} aria-busy={busy === "untrash" || undefined} onClick={() => act("untrash")}>{spin("untrash", <Icon icon={Inbox} size="sm" />)}{busy === "untrash" ? null : " Restore"}</button>
      ) : folder === "inbox" ? (
        <button type="button" className={btn} disabled={busy !== null} aria-busy={busy === "archive" || undefined} onClick={() => act("archive")} title="Archive (e)">{spin("archive", <Icon icon={Archive} size="sm" />)}{busy === "archive" ? null : " Archive"}</button>
      ) : (
        <button type="button" className={btn} disabled={busy !== null} aria-busy={busy === "inbox" || undefined} onClick={() => act("inbox")}>{spin("inbox", <Icon icon={Inbox} size="sm" />)}{busy === "inbox" ? null : " Move to Inbox"}</button>
      )}
      {anyUnread ? (
        <button type="button" className={btn} disabled={busy !== null} aria-busy={busy === "read" || undefined} onClick={() => act("read")}>{spin("read", <Icon icon={MailOpen} size="sm" />)}{busy === "read" ? null : " Mark read"}</button>
      ) : (
        <button type="button" className={btn} disabled={busy !== null} aria-busy={busy === "unread" || undefined} onClick={() => act("unread")}>{spin("unread", <Icon icon={Mail} size="sm" />)}{busy === "unread" ? null : " Mark unread"}</button>
      )}
      {!inTrash && (
        <Menu>
          <MenuTrigger asChild><button type="button" className={btn} disabled={busy !== null} aria-busy={busy === "snooze" || undefined}>{spin("snooze", <Icon icon={Clock} size="sm" />)}{busy === "snooze" ? null : " Snooze"}</button></MenuTrigger>
          <MenuContent>
            <MenuLabel>Snooze until…</MenuLabel>
            {snoozePresets().map((p) => <MenuItem key={p.id} icon={<Icon icon={Clock} />} onSelect={() => void snooze(p.until, p.label)}>{p.label}</MenuItem>)}
          </MenuContent>
        </Menu>
      )}
      {userLabels.length > 0 && (
        <Menu>
          <MenuTrigger asChild><button type="button" className={btn} disabled={busy !== null} aria-busy={busy === "label_add" || undefined}>{spin("label_add", <Icon icon={Tag} size="sm" />)}{busy === "label_add" ? null : " Label"}</button></MenuTrigger>
          <MenuContent>
            <MenuLabel>Add label</MenuLabel>
            {userLabels.map((l) => <MenuItem key={l.name} icon={<Icon icon={Tag} />} onSelect={() => void act("label_add", { name: l.name })}>{l.name}</MenuItem>)}
          </MenuContent>
        </Menu>
      )}
      {!inTrash && (
        <button type="button" className={cn(btn, "hover:text-danger")} disabled={busy !== null} aria-busy={busy === "trash" || undefined} onClick={() => setConfirmTrash(true)}>{spin("trash", <Icon icon={Trash2} size="sm" />)}{busy === "trash" ? null : " Delete"}</button>
      )}
      <Tooltip content="Clear selection (Esc)">
        <button type="button" onClick={onClear} className={cn(btn, "ml-auto")} aria-label="Clear selection (Esc)"><Icon icon={X} size="sm" /></button>
      </Tooltip>
      <ConfirmDialog
        open={confirmTrash}
        onOpenChange={setConfirmTrash}
        title={`Move ${n} email${n === 1 ? "" : "s"} to Trash?`}
        description="They stay in Trash for 30 days, and you can undo right after."
        confirmLabel={`Move ${n} to Trash`}
        danger
        onConfirm={() => { setConfirmTrash(false); void act("trash"); }}
      />
    </div>
  );
}

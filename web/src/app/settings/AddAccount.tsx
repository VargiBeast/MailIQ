import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Mail, Server } from "lucide-react";
import type { ImapAccountInput, MailServerPreset } from "@shared/imap";
import { api, errorMessage } from "@/lib/api";
import { useSession } from "@/lib/session";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

type Choice = { kind: "google" } | { kind: "preset"; preset: MailServerPreset } | { kind: "other" };

/** "Add account": Google (OAuth) or any IMAP/SMTP mailbox with an app password. */
export function AddAccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const { config } = useSession();
  const providers = useQuery({ queryKey: ["mail-providers"], queryFn: () => api.get<{ imapPresets: MailServerPreset[] }>("/mail-accounts/providers"), enabled: open, staleTime: 3600_000 });
  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) setChoice(null);
  };
  const option = "flex w-full items-center gap-3 disabled:cursor-not-allowed disabled:opacity-60 rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-left text-[13.5px] text-fg hover:border-line-strong";
  return (
    <Dialog open={open} onOpenChange={close} title={choice ? choiceTitle(choice) : "Add an account"} description={choice ? undefined : "MailIQ shows every account in one inbox, and you can switch between them in the sidebar."}>
      {!choice ? (
        <div className="space-y-2">
          <button type="button" className={option} onClick={() => { window.location.href = "/api/auth/google/start?mode=link"; }}>
            <Icon icon={Mail} className="text-fg-3" /> Gmail or Google Workspace
          </button>
          <button type="button" className={option} disabled={!config?.microsoft} aria-describedby={config?.microsoft ? undefined : "outlook-not-configured"}
            onClick={() => { window.location.href = "/api/auth/microsoft/start?mode=link"; }}>
            <Icon icon={Mail} className="text-fg-3" />
            <span className="flex-1">Outlook or Microsoft 365</span>
            {!config?.microsoft && <span id="outlook-not-configured" className="text-[12px] text-fg-3">Not configured</span>}
          </button>
          {(providers.data?.imapPresets ?? []).map((p) => (
            <button key={p.id} type="button" className={option} onClick={() => setChoice({ kind: "preset", preset: p })}>
              <Icon icon={Mail} className="text-fg-3" /> {p.label}
            </button>
          ))}
          <button type="button" className={option} onClick={() => setChoice({ kind: "other" })}>
            <Icon icon={Server} className="text-fg-3" /> Other mail (IMAP/SMTP)
          </button>
        </div>
      ) : choice.kind === "google" ? null : (
        <ImapForm choice={choice} onBack={() => setChoice(null)} onDone={() => close(false)} />
      )}
    </Dialog>
  );
}

function choiceTitle(c: Choice): string {
  if (c.kind === "preset") return `Add ${c.preset.label}`;
  if (c.kind === "other") return "Add IMAP/SMTP account";
  return "Add account";
}

function ImapForm({ choice, onBack, onDone }: { choice: Exclude<Choice, { kind: "google" }>; onBack: () => void; onDone: () => void }) {
  const qc = useQueryClient();
  const preset = choice.kind === "preset" ? choice.preset : null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imapHost, setImapHost] = useState(preset?.imapHost ?? "");
  const [imapPort, setImapPort] = useState(String(preset?.imapPort ?? 993));
  const [smtpHost, setSmtpHost] = useState(preset?.smtpHost ?? "");
  const [smtpPort, setSmtpPort] = useState(String(preset?.smtpPort ?? 465));
  const save = useMutation({
    mutationFn: () => {
      const body: ImapAccountInput = {
        email: email.trim(),
        password,
        imapHost: imapHost.trim(),
        imapPort: Number(imapPort) || 993,
        smtpHost: smtpHost.trim(),
        smtpPort: Number(smtpPort) || 465,
        presetId: preset?.id,
      };
      return api.post("/mail-accounts/imap", body);
    },
    onSuccess: () => {
      toast.success("Account connected");
      void qc.invalidateQueries({ queryKey: ["session"] });
      onDone();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <button type="button" className="inline-flex items-center gap-1 text-[13px] text-fg-2 hover:text-fg" onClick={onBack}>
        <Icon icon={ArrowLeft} size="sm" /> Back
      </button>
      <Field label="Email">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="username" />
      </Field>
      <Field label="App password" hint="Use an app-specific password from your provider, not your normal login password.">
        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password" />
      </Field>
      {!preset && (
        <>
          <Field label="IMAP host">
            <Input value={imapHost} onChange={(e) => setImapHost(e.target.value)} required />
          </Field>
          <Field label="IMAP port">
            <Input value={imapPort} onChange={(e) => setImapPort(e.target.value)} inputMode="numeric" required />
          </Field>
          <Field label="SMTP host">
            <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} required />
          </Field>
          <Field label="SMTP port">
            <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} inputMode="numeric" required />
          </Field>
        </>
      )}
      <Button type="submit" variant="primary" className="w-full" loading={save.isPending}>
        Connect
      </Button>
    </form>
  );
}

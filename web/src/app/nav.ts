import { Archive, Bookmark, Clock, File, Flag, Inbox, Mails, Radar, Send, ShieldAlert, Star, Trash2, type LucideIcon } from "lucide-react";
import type { Folder } from "@shared/mail";

/** Single registry for folder glyphs. Inbox, All mail, Snoozed and Important each have their own icon. */
export const FOLDER_META: Record<Folder, { label: string; icon: LucideIcon; countKey?: string }> = {
  inbox: { label: "Inbox", icon: Inbox, countKey: "INBOX" },
  starred: { label: "Starred", icon: Star },
  snoozed: { label: "Snoozed", icon: Clock },
  later: { label: "Read later", icon: Bookmark },
  important: { label: "Important", icon: Flag },
  sent: { label: "Sent", icon: Send },
  drafts: { label: "Drafts", icon: File, countKey: "DRAFT" },
  archive: { label: "Archive", icon: Archive },
  spam: { label: "Spam", icon: ShieldAlert, countKey: "SPAM" },
  trash: { label: "Trash", icon: Trash2 },
  all: { label: "All mail", icon: Mails },
};

/** Overview is distinct from Copilot, which keeps Sparkles. */
export const OverviewIcon = Radar;

export const SIDEBAR_FOLDERS: Folder[] = ["inbox", "starred", "snoozed", "later", "important", "sent", "drafts", "archive", "spam", "trash"];

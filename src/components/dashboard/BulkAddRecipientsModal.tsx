"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { parseBulkRecipientText } from "@/lib/recipients/parse-bulk";

type BulkAddRecipientsModalProps = {
  existingPhones: string[];
  onClose: () => void;
  onSave: (
    text: string,
    smsConsent: boolean,
  ) => Promise<{ ok: true; notice?: string } | { ok: false; error: string }>;
};

export function BulkAddRecipientsModal({
  existingPhones,
  onClose,
  onSave,
}: BulkAddRecipientsModalProps) {
  const saveLock = useRef(false);
  const [text, setText] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const parsed = useMemo(
    () => parseBulkRecipientText(text, existingPhones),
    [text, existingPhones],
  );

  function closeIfIdle() {
    if (busy || saveLock.current) return;
    onClose();
  }

  async function save() {
    if (saveLock.current || busy) return;
    if (!smsConsent) {
      setError("Confirm these people agreed to receive texts before adding them.");
      return;
    }
    if (parsed.valid.length === 0) {
      setError("Add at least one valid Name, Phone Number line.");
      return;
    }

    saveLock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await onSave(text, true);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onClose();
    } finally {
      saveLock.current = false;
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Bulk Add Recipients"
      className="max-w-lg"
      onClose={closeIfIdle}
      footer={
        <div className="mt-6 flex flex-col gap-2">
          <Button
            type="button"
            className="h-12 w-full whitespace-nowrap"
            disabled={busy || !smsConsent || parsed.valid.length === 0}
            onClick={save}
          >
            {busy
              ? "Adding..."
              : parsed.valid.length === 1
                ? "Add 1 Recipient"
                : `Add ${parsed.valid.length} Recipients`}
          </Button>
          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-medium text-charcoal/75"
            disabled={busy}
            onClick={closeIfIdle}
          >
            Cancel
          </button>
        </div>
      }
    >
      <p>Paste one person per line as Name, Phone Number.</p>
      <p className="mt-2 text-sm">
        Example:
        <br />
        Mom, 4085551111
        <br />
        Dad, 4085552222
        <br />
        Aunt Lisa, 4085553333
      </p>

      <label htmlFor="bulk-recipients" className="mt-5 block text-left text-[15px] font-medium text-charcoal">
        Recipients
      </label>
      <textarea
        id="bulk-recipients"
        rows={8}
        value={text}
        autoCapitalize="words"
        autoCorrect="off"
        spellCheck={false}
        placeholder={"Mom, 4085551111\nDad, 4085552222"}
        className="mt-2 min-h-[10rem] w-full resize-y rounded-2xl border border-charcoal/12 bg-paper px-4 py-3 text-base leading-relaxed text-charcoal placeholder:text-charcoal/35 focus-visible:border-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        onChange={(event) => setText(event.target.value)}
      />

      {parsed.valid.length > 0 ? (
        <div className="mt-4 text-left">
          <p className="text-sm font-medium text-charcoal">
            {parsed.valid.length === 1 ? "1 ready to add" : `${parsed.valid.length} ready to add`}
          </p>
          <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto text-sm text-charcoal">
            {parsed.valid.map((recipient) => (
              <li key={recipient.phone} className="truncate">
                {recipient.name} · {recipient.phone}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {parsed.errors.length > 0 ? (
        <div className="mt-4 text-left">
          <p className="text-sm font-medium text-[#9a4f40]">
            {parsed.errors.length === 1 ? "1 line needs a fix" : `${parsed.errors.length} lines need a fix`}
          </p>
          <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto text-sm text-[#9a4f40]">
            {parsed.errors.map((item) => (
              <li key={`${item.lineNumber}-${item.text}`}>
                Line {item.lineNumber}: {item.error}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-left">
        <input
          id="bulk-sms-consent"
          type="checkbox"
          required
          checked={smsConsent}
          onChange={(event) => setSmsConsent(event.target.checked)}
          className="mt-1 size-4 shrink-0 rounded border-charcoal/25 accent-charcoal"
        />
        <span className="text-sm leading-relaxed text-ink-muted">
          I confirm these recipients have agreed to receive pregnancy, labor, and birth text updates
          through Mora. Message and data rates may apply. They can reply STOP to opt out.
        </span>
      </label>
      {error ? <p className="mt-3 text-left text-sm text-[#9a4f40]">{error}</p> : null}
    </Modal>
  );
}

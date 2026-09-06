"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { FamilyEngagement } from "@/components/dashboard/FamilyEngagement";
import { BirthAnnounceModal } from "@/components/dashboard/BirthAnnounceModal";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { FamilyPhoto } from "@/components/media/FamilyPhoto";
import { PhotoPicker } from "@/components/media/PhotoPicker";
import {
  addRecipientAction,
  announceBirthAction,
  removeRecipientAction,
  sendUpdateAction,
  startLaborAction,
} from "@/app/actions/mora";
import { formatBirthMeasures } from "@/lib/data/birth";
import type { DashboardData, FamilyUpdate, Recipient } from "@/lib/data/types";
import {
  coupleDisplayName,
  formatDueDateNumeric,
  statusLabel,
  weeksRemaining,
} from "@/lib/domain/pregnancy";

export function DashboardShell({ data }: { data: DashboardData }) {
  const family = data.family;
  const remaining = weeksRemaining(family.dueDate);
  const names = coupleDisplayName(family.motherName, family.partnerName);
  const inLabor = family.status === "IN_LABOR";
  const arrived = family.status === "BABY_ARRIVED";
  const birth = family.birth;
  const measures = birth ? formatBirthMeasures(birth) : null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-8 sm:mb-10">
        <h1 className="font-serif text-[2rem] leading-[1.05] tracking-tight sm:text-[2.35rem]">
          {names}
        </h1>
        {arrived && birth ? (
          <>
            <p className="mt-4 text-[17px] leading-snug">
              Baby Arrived <span aria-hidden>🎉</span>
            </p>
            <p className="mt-3 font-serif text-[2.35rem] leading-none tracking-tight">
              {birth.babyName}
            </p>
            <p className="mt-2 text-[15px] text-ink-muted">Born at {birth.bornAt}</p>
            {measures ? <p className="mt-1 text-[15px] text-ink-muted">{measures}</p> : null}
            {birth.photoDataUrl ? (
              <FamilyPhoto
                src={birth.photoDataUrl}
                alt={birth.babyName}
                className="mt-5 max-w-sm"
              />
            ) : null}
          </>
        ) : inLabor ? (
          <>
            <p className="mt-4 inline-flex rounded-2xl bg-blush-soft/55 px-4 py-2.5 text-[17px] leading-snug">
              <span aria-hidden>🚗 </span>Currently in Labor
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              Due {formatDueDateNumeric(family.dueDate)} — we’ll share as things progress.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-[15px] text-ink-muted">
              Due {formatDueDateNumeric(family.dueDate)} ·{" "}
              {remaining === 0
                ? "due any day"
                : `${remaining} week${remaining === 1 ? "" : "s"} remaining`}
            </p>
            <p className="mt-3 inline-flex rounded-full border border-blush-soft bg-blush-soft/50 px-3 py-1 text-[13px] font-medium text-charcoal">
              {statusLabel(family.status)}
            </p>
          </>
        )}
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
        <div className="flex min-w-0 flex-col gap-10">
          {inLabor || arrived ? (
            <>
              <UpdateSection updates={data.updates} />
              <RecipientsSection recipients={data.recipients} />
            </>
          ) : (
            <>
              <RecipientsSection recipients={data.recipients} />
              <UpdateSection updates={data.updates} />
            </>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-10">
          {inLabor || arrived ? (
            <FamilyEngagement
              totals={data.reactionTotals}
              guesses={data.guesses}
              birth={birth}
            />
          ) : null}
          <MilestonesSection status={family.status} />
        </div>
      </div>
    </div>
  );
}

function RecipientsSection({ recipients }: { recipients: Recipient[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  async function addRecipient() {
    const nextName = name.trim();
    const nextPhone = phone.trim();
    if (!nextName) {
      setError("Enter a name.");
      return;
    }
    if (!nextPhone) {
      setError("Enter a phone number.");
      return;
    }

    setBusy(true);
    const result = await addRecipientAction(nextName, nextPhone);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setName("");
    setPhone("");
    setError("");
    router.refresh();
  }

  async function removeRecipient(id: string) {
    setBusy(true);
    const result = await removeRecipientAction(id);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <section>
      <h2 className="text-lg font-medium tracking-tight">Recipients</h2>
      <p className="mt-1 text-sm text-ink-muted">
        People who will get a private link when we add SMS.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field
          id="recipient-name"
          label="Name"
          value={name}
          autoComplete="name"
          onChange={(event) => setName(event.target.value)}
        />
        <Field
          id="recipient-phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <Button
          type="button"
          className="h-12 w-full whitespace-nowrap sm:mb-0 sm:w-auto"
          disabled={busy}
          onClick={addRecipient}
        >
          Add Recipient
        </Button>
      </div>
      {error ? <p className="mt-2 text-sm text-[#9a4f40]">{error}</p> : null}

      <ul className="mt-5 space-y-2">
        {recipients.length === 0 ? (
          <li className="rounded-2xl border border-charcoal/8 bg-paper/60 px-4 py-4 text-sm text-ink-muted">
            No one added yet.
          </li>
        ) : (
          recipients.map((recipient) => (
            <li
              key={recipient.id}
              className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-charcoal/8 bg-paper px-4 py-3 shadow-[0_8px_24px_-18px_rgb(42_36_33_/_0.35)]"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium">{recipient.name}</p>
                <p className="truncate text-sm text-ink-muted">{recipient.phone}</p>
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-charcoal/5 hover:text-charcoal"
                aria-label={`Remove ${recipient.name}`}
                disabled={busy}
                onClick={() => removeRecipient(recipient.id)}
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </li>
          ))
        )}
      </ul>

      <button
        type="button"
        className="mt-4 text-sm text-charcoal/70 underline-offset-4 hover:underline"
        onClick={() => setBulkOpen((value) => !value)}
      >
        Bulk Add Recipients
      </button>
      {bulkOpen ? (
        <p className="mt-2 text-sm text-ink-muted">
          Paste a list of people here soon. For now, add them one at a time.
        </p>
      ) : null}
    </section>
  );
}

function UpdateSection({ updates }: { updates: FamilyUpdate[] }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendUpdate() {
    const text = body.trim();
    if (!text && !photo) return;

    setBusy(true);
    setError("");
    setSent("");
    const formData = new FormData();
    formData.set("message", text);
    if (photo) formData.set("photo", photo);
    const result = await sendUpdateAction(formData);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setBody("");
    setPhoto(null);
    setPhotoError("");
    setError("");
    setSent(result.notice ?? "Update saved.");
    router.refresh();
    window.setTimeout(() => setSent(""), 8000);
  }

  return (
    <section>
      <h2 className="text-lg font-medium tracking-tight">Send Update</h2>
      <textarea
        id="family-update"
        rows={4}
        value={body}
        placeholder="e.g. Just had our 36-week appointment. Baby is measuring great..."
        className="mt-4 w-full min-w-0 resize-y rounded-2xl border border-charcoal/12 bg-paper px-4 py-3 text-base leading-relaxed text-charcoal placeholder:text-charcoal/35 focus-visible:border-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        onChange={(event) => setBody(event.target.value)}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PhotoPicker
          id="family-update-photo"
          label="Add photo"
          file={photo}
          error={photoError}
          onChange={(next, nextError) => {
            setPhoto(next);
            setPhotoError(nextError);
          }}
        />
        <Button
          type="button"
          className="h-12 w-full sm:w-auto"
          disabled={busy || (!body.trim() && !photo)}
          onClick={sendUpdate}
        >
          {busy ? "Sending..." : "Send Update"}
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-[#9a4f40]">{error}</p> : null}
      {sent ? <p className="mt-3 text-sm text-charcoal">{sent}</p> : null}

      {updates.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {updates.slice(0, 3).map((update) => (
            <li
              key={update.id}
              className="rounded-2xl border border-charcoal/8 bg-paper/70 px-4 py-3"
            >
              <p className="text-[13px] text-ink-muted">
                {new Date(update.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              {update.body ? (
                <p className="mt-1 text-[15px] leading-relaxed">{update.body}</p>
              ) : null}
              {update.photoUrl ? (
                <FamilyPhoto src={update.photoUrl} alt="" className="mt-3 max-h-40" />
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function MilestonesSection({ status }: { status: DashboardData["family"]["status"] }) {
  const router = useRouter();
  const [modal, setModal] = useState<"labor" | "birth" | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function confirmLabor() {
    setBusy(true);
    const result = await startLaborAction();
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setModal(null);
    router.refresh();
  }

  return (
    <section className="rounded-[1.75rem] border border-charcoal/10 bg-paper px-5 py-6 shadow-[0_18px_40px_-28px_rgb(42_36_33_/_0.4)] sm:px-6">
      <p className="text-[11px] font-medium tracking-[0.18em] text-blush uppercase">
        Milestones
      </p>
      {status === "BABY_ARRIVED" ? (
        <>
          <h2 className="mt-2 font-serif text-[1.65rem] leading-tight tracking-tight">
            This chapter is complete
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Baby has been announced. Your earlier updates are still here.
          </p>
        </>
      ) : status === "IN_LABOR" ? (
        <>
          <h2 className="mt-2 text-lg font-medium tracking-tight">When baby arrives</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            When you’re ready, you can share the news from here.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-charcoal px-4 py-3 text-center text-sm font-medium text-cream"
            onClick={() => setModal("birth")}
          >
            Announce Birth
          </button>
        </>
      ) : (
        <>
          <h2 className="mt-2 text-lg font-medium tracking-tight">When something big happens</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            These will notify family. The full flows come next.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-charcoal px-4 py-3 text-center text-sm font-medium text-cream"
            onClick={() => setModal("labor")}
          >
            Water Broke / Heading In
          </button>
        </>
      )}
      {error ? <p className="mt-3 text-sm text-[#9a4f40]">{error}</p> : null}

      {modal === "labor" ? (
        <Modal
          title="Are you sure? 🚗"
          onClose={() => setModal(null)}
          footer={
            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="button"
                className="h-12 w-full whitespace-nowrap"
                disabled={busy}
                onClick={confirmLabor}
              >
                Yes, We’re Going!
              </Button>
              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-medium text-charcoal/75"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
            </div>
          }
        >
          This will update your status to In Labor and let your family know you’re
          heading in.
        </Modal>
      ) : null}
      {modal === "birth" && status === "IN_LABOR" ? (
        <BirthAnnounceModal
          onClose={() => setModal(null)}
          onAnnounce={async (formData) => {
            const result = await announceBirthAction(formData);
            if (!result.ok) return result;
            router.refresh();
            return result;
          }}
        />
      ) : null}
    </section>
  );
}

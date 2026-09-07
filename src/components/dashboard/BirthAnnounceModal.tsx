"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { PhotoPicker } from "@/components/media/PhotoPicker";

type BirthAnnounceModalProps = {
  onClose: () => void;
  onAnnounce: (
    formData: FormData,
  ) => Promise<{ ok: true; notice?: string } | { ok: false; error: string }>;
};

export function BirthAnnounceModal({ onClose, onAnnounce }: BirthAnnounceModalProps) {
  const submitLock = useRef(false);
  const [babyName, setBabyName] = useState("");
  const [bornAt, setBornAt] = useState("");
  const [pounds, setPounds] = useState("");
  const [ounces, setOunces] = useState("");
  const [length, setLength] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function closeIfIdle() {
    if (busy || submitLock.current) return;
    onClose();
  }

  async function submit() {
    if (submitLock.current || busy) return;

    const name = babyName.trim();
    const time = bornAt.trim();
    if (!name) {
      setError("Enter the baby’s name.");
      return;
    }
    if (!time) {
      setError("Enter the time of birth.");
      return;
    }

    const lb = pounds.trim() === "" ? null : Number(pounds);
    const oz = ounces.trim() === "" ? null : Number(ounces);
    const inches = length.trim() === "" ? null : Number(length);

    if (lb != null && (!Number.isFinite(lb) || lb < 0 || lb > 20)) {
      setError("Enter a weight in pounds between 0 and 20, or leave it blank.");
      return;
    }
    if (oz != null && (!Number.isFinite(oz) || oz < 0 || oz > 15)) {
      setError("Enter ounces between 0 and 15, or leave it blank.");
      return;
    }
    if (inches != null && (!Number.isFinite(inches) || inches < 10 || inches > 30)) {
      setError("Enter a length in inches, or leave it blank.");
      return;
    }
    if (photoError) {
      setError(photoError);
      return;
    }

    const formData = new FormData();
    formData.set("babyName", name);
    formData.set("bornAt", time);
    if (lb != null) formData.set("weightPounds", String(lb));
    if (oz != null) formData.set("weightOunces", String(oz));
    if (inches != null) formData.set("lengthInches", String(inches));
    if (photo) formData.set("photo", photo);

    submitLock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await onAnnounce(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onClose();
    } finally {
      submitLock.current = false;
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Baby Is Here! 🎉"
      onClose={closeIfIdle}
      footer={
        <div className="mt-6 flex flex-col gap-2">
          <Button
            type="button"
            className="h-12 w-full whitespace-nowrap"
            disabled={busy}
            onClick={submit}
          >
            {busy ? "Uploading..." : "Announce Birth"}
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
      <p>Add the details you want to share with your family.</p>

      <div className="mt-5 space-y-4 text-left text-charcoal">
        <Field
          id="baby-name"
          label="Baby’s name"
          placeholder="Amara Rose"
          autoComplete="off"
          autoCapitalize="words"
          value={babyName}
          onChange={(event) => setBabyName(event.target.value)}
        />
        <Field
          id="born-at"
          label="Time of birth"
          placeholder="3:42 AM"
          value={bornAt}
          onChange={(event) => setBornAt(event.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            id="birth-pounds"
            label="Pounds (optional)"
            inputMode="numeric"
            placeholder="7"
            value={pounds}
            onChange={(event) => setPounds(event.target.value)}
          />
          <Field
            id="birth-ounces"
            label="Ounces (optional)"
            inputMode="numeric"
            placeholder="6"
            value={ounces}
            onChange={(event) => setOunces(event.target.value)}
          />
        </div>
        <Field
          id="birth-length"
          label="Birth length (optional)"
          inputMode="numeric"
          placeholder="20 in"
          value={length}
          onChange={(event) => setLength(event.target.value)}
        />

        <div>
          <p className="text-[15px] font-medium text-charcoal">Photo (optional)</p>
          <div className="mt-2">
            <PhotoPicker
              id="birth-photo"
              label="Add a first photo"
              file={photo}
              error={photoError}
              onChange={(next, nextError) => {
                setPhoto(next);
                setPhotoError(nextError);
              }}
            />
          </div>
        </div>
        {error ? <p className="text-sm text-[#9a4f40]">{error}</p> : null}
      </div>
    </Modal>
  );
}

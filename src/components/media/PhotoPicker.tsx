"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus } from "lucide-react";
import { FamilyPhoto } from "@/components/media/FamilyPhoto";
import { PhotoError, validatePhotoFile } from "@/lib/media/photos";

export function PhotoPicker({
  id,
  label,
  file,
  onChange,
  error,
}: {
  id: string;
  label: string;
  file: File | null;
  onChange: (file: File | null, error: string) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <label
        htmlFor={id}
        className="relative inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-charcoal/15 px-4 py-3 text-sm text-charcoal sm:w-auto"
      >
        <ImagePlus size={16} strokeWidth={1.75} />
        <span className="max-w-[14rem] truncate">{file?.name ?? label}</span>
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/*,image/heic,image/heif,.heic,.heif"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(event) => {
            const next = event.target.files?.[0] ?? null;
            if (!next) {
              onChange(null, "");
              return;
            }
            try {
              validatePhotoFile(next);
              onChange(next, "");
            } catch (caught) {
              event.target.value = "";
              onChange(
                null,
                caught instanceof PhotoError ? caught.message : "That photo could not be used.",
              );
            }
          }}
        />
      </label>
      {preview ? (
        <FamilyPhoto src={preview} alt="" className="mt-3 max-h-36" />
      ) : null}
      {error ? <p className="mt-2 text-sm text-[#9a4f40]">{error}</p> : null}
    </div>
  );
}

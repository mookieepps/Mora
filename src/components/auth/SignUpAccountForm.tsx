"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { signUpAccountAction } from "@/app/actions/mora";

export function SignUpAccountForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
    form?: string;
  }>({});
  const [busy, setBusy] = useState(false);

  async function submit() {
    const nextEmail = email.trim();
    const nextErrors: typeof errors = {};
    if (!nextEmail || !nextEmail.includes("@")) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }
    if (password !== confirm) {
      nextErrors.confirm = "Those passwords do not match.";
    }
    if (nextErrors.email || nextErrors.password || nextErrors.confirm) {
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    const result = await signUpAccountAction({ email: nextEmail, password });
    setBusy(false);
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    router.push(result.next ?? "/signup");
    router.refresh();
  }

  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.22em] text-blush uppercase">Your account</p>
      <h1 className="mt-4 font-serif text-[2.15rem] leading-[1.05] tracking-tight">
        Create your parent login
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
        This keeps your dashboard private. Family still uses the shared page link.
      </p>

      <div className="mt-8 space-y-5">
        <Field
          id="account-email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          id="account-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          error={errors.password}
          hint="At least 8 characters."
          onChange={(event) => setPassword(event.target.value)}
        />
        <Field
          id="account-confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          error={errors.confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
      </div>

      {errors.form ? <p className="mt-4 text-sm text-[#9a4f40]">{errors.form}</p> : null}

      <Button type="button" className="mt-8 h-12 w-full" disabled={busy} onClick={submit}>
        Create account
      </Button>
      <p className="mt-4 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-charcoal underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

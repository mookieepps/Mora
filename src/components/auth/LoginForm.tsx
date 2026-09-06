"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { signInAction } from "@/app/actions/mora";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  async function submit() {
    const nextEmail = email.trim();
    const nextErrors: typeof errors = {};
    if (!nextEmail || !nextEmail.includes("@")) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }
    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    const result = await signInAction({ email: nextEmail, password });
    setBusy(false);
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    router.push(result.next ?? "/dashboard");
    router.refresh();
  }

  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.22em] text-blush uppercase">Welcome back</p>
      <h1 className="mt-4 font-serif text-[2.15rem] leading-[1.05] tracking-tight">Sign in</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
        Open your family dashboard from this account.
      </p>

      <div className="mt-8 space-y-5">
        <Field
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {errors.form ? <p className="mt-4 text-sm text-[#9a4f40]">{errors.form}</p> : null}

      <Button type="button" className="mt-8 h-12 w-full" disabled={busy} onClick={submit}>
        Sign in
      </Button>
      <p className="mt-4 text-center text-sm text-ink-muted">
        New to Mora?{" "}
        <Link href="/signup" className="text-charcoal underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

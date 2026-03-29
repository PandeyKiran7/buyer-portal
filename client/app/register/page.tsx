"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { AuthPageHeader } from "@/components/layout/AuthPageHeader";
import { StayLogo } from "@/components/layout/StayLogo";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ApiError, api } from "@/lib/api";
import { setToken } from "@/lib/auth-token";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setPending(true);
    try {
      const data = await api.register({ name, email, password });
      setToken(data.token);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        setError(err.details.map((d) => `${d.field}: ${d.message}`).join(" · "));
      } else {
        setError(err instanceof ApiError ? err.message : "Something went wrong.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authBrand">
          <StayLogo size={44} showWordmark={false} />
          <div>
            <h1 className="pageTitle" style={{ marginBottom: 0 }}>
              Stay
            </h1>
            <p className="muted" style={{ marginBottom: 0 }}>
              Create your buyer account
            </p>
          </div>
        </div>
        <AuthPageHeader
          title="Create account"
          description="Password must be at least 8 characters. You’ll be signed in after registering."
        />
        {error ? <Alert variant="error">{error}</Alert> : null}
        <form onSubmit={onSubmit}>
          <TextField label="Full name" id="name" name="name" type="text" autoComplete="name" required />
          <TextField
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Creating…" : "Register"}
          </Button>
        </form>
        <p className="linkRow">
          Already registered? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

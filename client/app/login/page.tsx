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

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setPending(true);
    try {
      const data = await api.login({ email, password });
      setToken(data.token);
      const next = new URLSearchParams(window.location.search).get("next");
      const safe =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      router.push(safe);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
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
              Sign in to continue
            </p>
          </div>
        </div>
        <AuthPageHeader title="Welcome back" description="Enter your email and password to open your dashboard." />
        {error ? <Alert variant="error">{error}</Alert> : null}
        <form onSubmit={onSubmit}>
          <TextField
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
          <TextField
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="linkRow">
          No account? <Link href="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

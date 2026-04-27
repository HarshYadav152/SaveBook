"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Github, ShieldCheck, Sparkles } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/context/auth/authContext";

function LoginFormSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="h-14 rounded-[1.2rem] bg-[color:var(--background)]/80 animate-pulse" />
      <div className="h-14 rounded-[1.2rem] bg-[color:var(--background)]/80 animate-pulse" />
      <div className="h-14 rounded-[1.2rem] bg-[color:var(--background)]/80 animate-pulse" />
    </div>
  );
}

function LoginForm() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading && !hasRedirected && !showRecoveryModal) {
      setHasRedirected(true);
      router.push("/notes");
    }
  }, [hasRedirected, isAuthenticated, loading, router, showRecoveryModal]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading || isAuthenticated) return;

    setIsLoading(true);

    try {
      const result = await login(credentials.username, credentials.password);

      if (result.success) {
        toast.success("Welcome back!");

        if (result.recoveryCodes?.length) {
          setRecoveryCodes(result.recoveryCodes);
          setShowRecoveryModal(true);
        }
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(recoveryCodes.join("\n"));
    toast.success("Recovery codes copied");
  };

  const handleDownload = () => {
    const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "savebook-recovery-codes.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const onChange = (event) => {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  if (loading) return <LoginFormSkeleton />;

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">
            Username
          </label>
          <div className="field-shell px-4 py-3">
            <input
              id="username"
              type="text"
              name="username"
              value={credentials.username}
              onChange={onChange}
              required
              disabled={isLoading}
              className="field-input"
              placeholder="Enter username"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-[color:var(--foreground)]">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-[color:var(--accent)] hover:opacity-80">
              Forgot password?
            </Link>
          </div>
          <div className="field-shell relative px-4 py-3">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
              disabled={isLoading}
              className="field-input pr-10"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="site-button w-full disabled:opacity-60">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[color:var(--background-strong)] px-2 text-[color:var(--muted)]">Or continue with</span>
          </div>
        </div>

        <button type="button" onClick={() => { window.location.href = "/api/auth/github"; }} className="site-button-ghost w-full">
          <Github className="h-5 w-5" />
          Continue with GitHub
        </button>

        <p className="text-center text-sm text-[color:var(--muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[color:var(--accent)]">
            Register
          </Link>
        </p>
      </form>

      {showRecoveryModal && recoveryCodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
          <div className="auth-panel w-full max-w-md rounded-[2rem] p-6">
            <h3 id="recovery-title" className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">
              Save your recovery codes
            </h3>
            <p className="mb-4 text-sm text-[color:var(--muted)]">
              These codes are shown only once. Save them securely before you continue.
            </p>

            <div className="mb-4 grid grid-cols-2 gap-2">
              {recoveryCodes.map((code) => (
                <div key={code} className="rounded-2xl border border-[var(--border)] bg-[color:var(--background)]/70 px-3 py-2 text-center font-mono text-[color:var(--foreground)]">
                  {code}
                </div>
              ))}
            </div>

            <div className="mb-4 flex gap-3">
              <button type="button" onClick={handleCopy} className="site-button-ghost flex-1">Copy</button>
              <button type="button" onClick={handleDownload} className="site-button-ghost flex-1">Download</button>
            </div>

            <button type="button" onClick={() => setShowRecoveryModal(false)} className="site-button w-full">
              I have saved these codes
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Login"
      title="Sign in and return to your notes, plans, and saved ideas."
      description="Access your SaveBook workspace to continue writing, reviewing, and organizing everything you have saved."
      asideTitle="Why people return"
      asideCopy="SaveBook is built to keep useful notes close, whether you are picking up a project, checking a reminder, or reviewing something important."
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--background)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-2)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure sign in
        </div>
        <h2 className="mt-5 text-3xl font-semibold text-[color:var(--foreground)]">Welcome back</h2>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          Sign in to keep writing, organizing, and sharing your notes with SaveBook.
        </p>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[color:var(--background)]/55 p-6 md:p-7">
        <LoginForm />
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[color:var(--background)]/45 px-4 py-3 text-sm text-[color:var(--muted)]">
        <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
        Pick up where you left off in your personal notebook.
      </div>
    </AuthShell>
  );
}

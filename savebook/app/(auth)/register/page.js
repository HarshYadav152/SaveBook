"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Sparkles, UserPlus } from "lucide-react";
import { useAuth } from "@/context/auth/authContext";
import AuthShell from "@/components/auth/AuthShell";

function SignupFormSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="h-12 rounded-[1.2rem] bg-[color:var(--background)]/80 animate-pulse" />
      <div className="h-12 rounded-[1.2rem] bg-[color:var(--background)]/80 animate-pulse" />
      <div className="h-12 rounded-[1.2rem] bg-[color:var(--background)]/80 animate-pulse" />
      <div className="h-12 rounded-[1.2rem] bg-[color:var(--background)]/80 animate-pulse" />
      <div className="h-12 rounded-[1.2rem] bg-[color:var(--background)]/80 animate-pulse" />
    </div>
  );
}

function SignupForm() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onChange = (event) => {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors((current) => ({ ...current, [event.target.name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isAuthenticated) {
      router.push("/");
      return;
    }

    const nextErrors = {};

    if (!credentials.username.trim()) nextErrors.username = "Username is required";
    if (!credentials.email.trim()) nextErrors.email = "Email is required";
    if (credentials.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!credentials.password) nextErrors.password = "Password is required";
    if (credentials.password && credentials.password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    if (!credentials.confirmPassword) nextErrors.confirmPassword = "Please confirm your password";
    if (credentials.confirmPassword && credentials.password !== credentials.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(credentials.username, credentials.email, credentials.password);

      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated === undefined) {
    return <SignupFormSkeleton />;
  }

  const fieldClass = (name) => `field-shell px-4 py-3 ${errors[name] ? "border-red-500" : ""}`;

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">Username</label>
        <div className={fieldClass("username")}>
          <input id="username" name="username" value={credentials.username} onChange={onChange} className="field-input" placeholder="Choose a username" />
        </div>
        {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">Email Address</label>
        <div className={fieldClass("email")}>
          <input id="email" name="email" type="email" value={credentials.email} onChange={onChange} className="field-input" placeholder="Enter your email" />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">Password</label>
        <div className={fieldClass("password") + " relative"}>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={onChange}
            className="field-input pr-10"
            placeholder="Create a password"
          />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[color:var(--muted)] hover:text-[color:var(--foreground)]">
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        ) : (
          <p className="mt-1 text-xs text-[color:var(--muted)]">Password must be at least 6 characters long.</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[color:var(--foreground)]">Confirm Password</label>
        <div className={fieldClass("confirmPassword") + " relative"}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={credentials.confirmPassword}
            onChange={onChange}
            className="field-input pr-10"
            placeholder="Confirm your password"
          />
          <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[color:var(--muted)] hover:text-[color:var(--foreground)]">
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <button type="submit" disabled={isLoading || isAuthenticated} className="site-button w-full disabled:opacity-60">
        {isLoading ? "Registering..." : isAuthenticated ? "Redirecting..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-[color:var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[color:var(--accent)]">
          Login
        </Link>
      </p>
    </form>
  );
}

export default function Signup() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return (
      <AuthShell
        eyebrow="Register"
        title="Create your SaveBook account and start keeping your ideas in one place."
        description="Set up your account to save notes, organize knowledge, and keep important thoughts available whenever you need them."
        asideTitle="Loading"
        asideCopy="Your workspace is almost ready. In a moment you will be able to start building your personal notebook."
      >
        <SignupFormSkeleton />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Register"
      title="Create an account for a calmer way to save notes and shape ideas."
      description="Join SaveBook to keep your writing, reminders, research, and personal knowledge in one reliable space."
      asideTitle="What you get"
      asideCopy="With SaveBook, your notes stay accessible, organized, and ready when you want to return to them later."
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--background)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-2)]">
          <UserPlus className="h-3.5 w-3.5" />
          Create account
        </div>
        <h2 className="mt-5 text-3xl font-semibold text-[color:var(--foreground)]">Join SaveBook</h2>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          Start saving ideas, plans, and useful knowledge in your own cloud notebook.
        </p>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[color:var(--background)]/55 p-6 md:p-7">
        <SignupForm />
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[color:var(--background)]/45 px-4 py-3 text-sm text-[color:var(--muted)]">
        <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
        Create your account and begin building your personal note archive.
      </div>
    </AuthShell>
  );
}

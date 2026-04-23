"use t";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Menu, NotebookPen, User, X } from "lucide-react";
import { useAuth } from "@/context/auth/authContext";
import ThemeToggle from "@/components/common/ThemeToggle";

const PUBLIC_NAV_LINKS = [
  { href: "/#overview", label: "Overview" },
  { href: "/#features", label: "Features" },
  { href: "/#audiences", label: "Who it's for" },
  { href: "/docs", label: "Docs" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const { isAuthenticated, user, logout, loading } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenus = useCallback(() => {
    setDropdownOpen(false);
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenus();
    };

    const handleClickOutside = (event) => {
      const clickedDesktop = desktopDropdownRef.current?.contains(event.target);
      const clickedMobile = mobileDropdownRef.current?.contains(event.target);

      if (!clickedDesktop && !clickedMobile) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenus]);

  const brand = useMemo(
    () => (
      <Link
        href="/"
        className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[color:var(--background-elevated)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground)] shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-white shadow-[0_16px_36px_rgba(59,130,246,0.34)]">
          <NotebookPen className="h-4 w-4" />
        </span>
        SaveBook
      </Link>
    ),
    []
  );

  const navSurface = clsx(
    "fixed inset-x-0 top-0 z-50 transition-all duration-300",
    isScrolled ? "pt-2" : "pt-4"
  );

  const navInner = clsx(
    "site-container flex items-center justify-between rounded-full px-4 py-3 md:px-5",
    isScrolled ? "glass-panel" : "border border-transparent bg-transparent"
  );

  const navLinkClass = "text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)]";

  const initials = user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className={navSurface}>
      <div className={navInner}>
        {brand}

        <div className="hidden items-center gap-8 lg:flex">
          {!isAuthenticated && PUBLIC_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <Link href="/notes" className={navLinkClass}>Notes</Link>
              <Link href="/profile" className={navLinkClass}>Profile</Link>
              <Link href="/docs" className={navLinkClass}>Docs</Link>
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {!isClient || loading ? (
            <div className="h-11 w-11 rounded-full border border-[var(--border)] bg-[color:var(--background-elevated)] animate-pulse" />
          ) : isAuthenticated ? (
            <div className="relative" ref={desktopDropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-sm font-semibold text-white shadow-[0_20px_44px_rgba(59,130,246,0.3)]"
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="glass-panel absolute right-0 mt-3 w-60 rounded-3xl p-2">
                  <div className="rounded-2xl border border-[var(--border)] bg-[color:var(--background-strong)] px-4 py-3">
                    <p className="font-semibold text-[color:var(--foreground)]">{user?.username || "User"}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{user?.email || "Signed in"}</p>
                  </div>
                  <div className="mt-2 grid gap-1">
                    <Link href="/notes" className="rounded-2xl px-4 py-3 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--background-strong)]" onClick={closeMenus}>My Notes</Link>
                    <Link href="/profile" className="rounded-2xl px-4 py-3 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--background-strong)]" onClick={closeMenus}>Edit Profile</Link>
                    <button type="button" onClick={logout} className="rounded-2xl px-4 py-3 text-left text-sm text-red-500 hover:bg-[color:var(--background-strong)]">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="site-button-ghost">Login</Link>
              <Link href="/register" className="site-button">Sign Up</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="theme-button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="site-container mt-3 lg:hidden">
          <div className="glass-panel rounded-[2rem] p-3">
            <div className="grid gap-2">
              {(!loading && !isAuthenticated ? PUBLIC_NAV_LINKS : [
                { href: "/notes", label: "Notes" },
                { href: "/profile", label: "Profile" },
                { href: "/docs", label: "Docs" },
              ]).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-[color:var(--foreground)] hover:bg-[color:var(--background-strong)]"
                  onClick={closeMenus}
                >
                  {link.label}
                </Link>
              ))}

              {!loading && !isAuthenticated && (
                <div className="mt-2 grid gap-2">
                  <Link href="/login" className="site-button-ghost w-full" onClick={closeMenus}>Login</Link>
                  <Link href="/register" className="site-button w-full" onClick={closeMenus}>Sign Up</Link>
                </div>
              )}

              {!loading && isAuthenticated && (
                <div ref={mobileDropdownRef} className="mt-2 rounded-[1.6rem] border border-[var(--border)] bg-[color:var(--background-strong)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-sm font-semibold text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[color:var(--foreground)]">{user?.username || "User"}</p>
                      <p className="text-sm text-[color:var(--muted)]">{user?.email || "Signed in"}</p>
                    </div>
                  </div>
                  <button type="button" onClick={logout} className="mt-4 w-full rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

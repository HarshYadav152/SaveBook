"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/authContext";
import HeroSection from "@/components/landing/HeroSection";
import ValueSection from "@/components/landing/ValueSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import AudienceSection from "@/components/landing/AudienceSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className="site-shell">
        <section className="hero-surface min-h-screen pt-36">
          <div className="site-container px-4 pb-16 md:px-8">
            <div className="glass-panel rounded-[2.5rem] p-8 md:p-10 animate-pulse">
              <div className="h-5 w-32 rounded-full bg-slate-300/50 dark:bg-slate-700/50" />
              <div className="mt-6 h-20 max-w-4xl rounded-[2rem] bg-slate-300/50 dark:bg-slate-700/50" />
              <div className="mt-4 h-6 max-w-2xl rounded-full bg-slate-300/40 dark:bg-slate-700/40" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <HeroSection isAuthenticated={isAuthenticated} user={user} loading={loading} />
      <ValueSection />
      <FeatureGrid />
      <AudienceSection />
      <WorkflowSection />
      <CTASection isAuthenticated={isAuthenticated} loading={loading} />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/authContext";
import AudienceSection from "@/components/landing/AudienceSection";
import CTASection from "@/components/landing/CTASection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HeroSection from "@/components/landing/HeroSection";
import ValueSection from "@/components/landing/ValueSection";
import WorkflowSection from "@/components/landing/WorkflowSection";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className="landing-page">
        <div className="mx-auto min-h-screen max-w-7xl px-4 pt-32 sm:px-6 lg:px-8">
          <div className="landing-panel animate-pulse p-8 sm:p-10">
            <div className="h-4 w-40 rounded-full bg-slate-200" />
            <div className="mt-6 h-16 max-w-3xl rounded-[28px] bg-slate-200 sm:h-24" />
            <div className="mt-4 h-6 max-w-2xl rounded-full bg-slate-200" />
            <div className="mt-8 flex gap-4">
              <div className="h-14 w-40 rounded-full bg-slate-200" />
              <div className="h-14 w-36 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="landing-page">
      <HeroSection isAuthenticated={isAuthenticated} user={user} loading={loading} />
      <ValueSection />
      <FeatureGrid />
      <AudienceSection />
      <WorkflowSection />
      <CTASection isAuthenticated={isAuthenticated} loading={loading} />
    </main>
  );
}

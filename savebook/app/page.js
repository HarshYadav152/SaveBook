"use client";

import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import Features from "@/components/landing/Features";
import Comparison from "@/components/landing/Comparison";
import CallToAction from "@/components/landing/CallToAction";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrustedBy />
      <Features />
      <Comparison />
      <CallToAction />
    </div>
  );
}
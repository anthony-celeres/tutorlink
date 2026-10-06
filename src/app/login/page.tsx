"use client";

import React, { Suspense } from "react";
import { SlidingAuthCard } from "@/components/SlidingAuthCard";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-400">Loading sign-in portal...</div>}>
      <SlidingAuthCard initialMode="login" />
    </Suspense>
  );
}

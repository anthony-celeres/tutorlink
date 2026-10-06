"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 rounded-full border-2 border-brand-teal-500 border-t-transparent animate-spin" />
    </div>
  );
}

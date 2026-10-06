"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  useEffect(() => {
    if (resolvedParams.bookingId) {
      router.replace(`/chat?id=${resolvedParams.bookingId}`);
    } else {
      router.replace("/chat");
    }
  }, [resolvedParams, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-brand-teal-500 border-t-transparent animate-spin" />
    </div>
  );
}

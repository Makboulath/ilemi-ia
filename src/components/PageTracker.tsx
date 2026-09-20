"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    try {
      const key = `ilemi_pv:${pathname}`;
      const last = sessionStorage.getItem(key);
      const now = Date.now();
      if (last && now - Number(last) < 30_000) return;
      sessionStorage.setItem(key, String(now));
    } catch {
      // sessionStorage may be blocked
    }

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}

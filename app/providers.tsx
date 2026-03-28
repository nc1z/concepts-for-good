"use client";

import { SWRConfig } from "swr";

import { PUBLIC_API_DEDUPE_MS, PUBLIC_API_REFRESH_MS } from "@/lib/api/use-cached-feed";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        refreshInterval: PUBLIC_API_REFRESH_MS,
        dedupingInterval: PUBLIC_API_DEDUPE_MS,
        revalidateOnFocus: false,
        revalidateIfStale: true,
        shouldRetryOnError: false,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}

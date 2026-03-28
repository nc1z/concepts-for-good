"use client";

import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";

import { getJson, type ApiRequestConfig } from "@/lib/api/client";

export const PUBLIC_API_REFRESH_MS = 5 * 60 * 1000;
export const PUBLIC_API_DEDUPE_MS = 60 * 1000;

export type CachedFeedKey = readonly [
  url: string,
  config?: ApiRequestConfig,
];

export type CachedFeedOptions<T> = ApiRequestConfig & {
  swr?: SWRConfiguration<T>;
};

function cachedFeedFetcher<T>([url, config]: CachedFeedKey) {
  return getJson<T>(url, config);
}

export function useCachedFeed<T>(
  url: string | null,
  options: CachedFeedOptions<T> = {},
): SWRResponse<T> {
  const { swr, ...requestConfig } = options;
  const key = url ? ([url, requestConfig] as const) : null;

  return useSWR<T>(key, cachedFeedFetcher<T>, {
    refreshInterval: PUBLIC_API_REFRESH_MS,
    dedupingInterval: PUBLIC_API_DEDUPE_MS,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    shouldRetryOnError: false,
    keepPreviousData: true,
    ...swr,
  });
}

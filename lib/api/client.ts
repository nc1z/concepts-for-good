import axios from "axios";

export const apiClient = axios.create({
  timeout: 10000,
});

export type ApiRequestConfig = {
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
};

export async function getJson<T>(
  url: string,
  { baseURL, headers, params, timeoutMs }: ApiRequestConfig = {},
): Promise<T> {
  const response = await apiClient.get<T>(url, {
    baseURL,
    headers,
    params,
    timeout: timeoutMs,
  });

  return response.data;
}

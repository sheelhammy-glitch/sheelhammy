"use server";

import { cookies } from "next/headers";

const BASE_URL = "https://www.oxfmoney.com/api";

export async function fetcher<Response>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const reqCookies = await cookies();
  const token = reqCookies.get("token")?.value;
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(
    `${endpoint.startsWith("http") ? "" : BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      next: {
        revalidate: options.next?.revalidate || 60 * 60,
        tags: options.next?.tags ? ["ALL", ...options.next.tags] : ["ALL"],
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const jsonData = await response.json();

  return jsonData;
}

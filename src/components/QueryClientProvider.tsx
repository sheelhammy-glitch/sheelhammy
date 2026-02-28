"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { queryClient } from "@/lib/queryClient";

export default function QueryClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  if (!queryClient) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

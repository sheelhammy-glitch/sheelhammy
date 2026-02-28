 
"use client";  

import { QueryClient } from "@tanstack/react-query";

const getQueryClient = () => {
  if (typeof window === "undefined") { 
    return null;
  }
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });
};
 
export const queryClient = getQueryClient();
import { QueryResponse } from "@/types/api";
import { axiosBaseQuery } from "@/utils/axiosConfig";
import { useQuery } from "@tanstack/react-query";

interface Count {
  totalBlogs: number;
  totalUsers: number;
  totalCategories: number;
}
export const useDashboardCount = () => {
  return useQuery({
    queryKey: ["dashboardCount"],
    queryFn: async () => {
      const response = await axiosBaseQuery()({
        url: `/count`,
        method: "GET",
      });
      if (response.error) throw new Error("Failed to fetch blogs by category");
      return response.data as QueryResponse<Count>;
    },
    staleTime: 0,
    refetchOnMount: true,
  });
};

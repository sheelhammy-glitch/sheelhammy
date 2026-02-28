import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosBaseQuery } from "@/utils/axiosConfig";
import useAppStore from "../store";
import { deleteCookie } from "cookies-next/client";

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface UserData {
  user: {
    id: number;
    firebase_uid: string;
    name: string;
    email: string;
    created_at: string;
  };
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const response = await axiosBaseQuery()({
        url: "/user/register",
        method: "POST",
        data,
      });
      if (response.error) throw new Error("Registration failed");
      return response.data as { token: string; user: User };
    },
    onSuccess: (data) => {
      toast.success("회원가입 성공");
    },
    onError: () => {
      toast.error("회원가입 실패");
    },
  });
};

// Create: Login
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axiosBaseQuery()({
        url: "/user/login",
        method: "POST",
        data,
      });
      if (response.error) throw new Error("Login failed");
      return response.data as { token: string; user: User };
    },
    onSuccess: () => {
      toast.success("로그인 성공");
    },
    onError: () => {
      toast.error("로그인 실패");
    },
  });
};

export const useUserData = () => {
  const { setUser } = useAppStore();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosBaseQuery()({
        url: "/users/me",
        method: "GET",
      });
      if (response.error) {
        console.error("Error fetching user data:", response.error);
        if (response.error.status === 401) {
          deleteCookie("token");
          window.location.href = "/login";
        }
        throw new Error("Failed to fetch user data");
      }
      const data = response.data as UserData;
      setUser(data.user);
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { deleteCookie, getCookie } from "cookies-next/client";
import { toast } from "@/components/ui/use-toast";
export const mainApi = axios.create({
  baseURL: "https://www.oxfmoney.com/api",
});

mainApi.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: "" }) =>
  async ({
    url,
    method,
    data,
    params,
  }: {
    url: string;
    method?: AxiosRequestConfig["method"];
    data?: unknown;
    params?: unknown;
  }) => {
    try {
      const result = await mainApi({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      if (
        err.response?.status === 401 &&
        window.location.pathname !== "/login"
      ) {
        deleteCookie("token");
        if (!window.location.href.endsWith("login")) {
          window.location.href = "/login";
          toast({
            title: "Session Expired",
            description: "Please login again",
            variant: "destructive",
          });
        }
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

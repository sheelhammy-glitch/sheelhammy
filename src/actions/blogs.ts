import { fetcher } from "@/utils/fetcher";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const getPosts = async () => {
  const res = await fetcher<Post[]>(`/posts`, {
    next: { tags: ["Posts"] },
  });
  return res;
};

export const usePosts = () =>
  useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

const createPost = async (post: Post) => {
  const res = await fetcher<Post>(`/posts`, {
    method: "POST",
    body: JSON.stringify(post),
  });
  return res;
};

export const useCreatePost = () =>
  useMutation({
    mutationFn: createPost,
  });

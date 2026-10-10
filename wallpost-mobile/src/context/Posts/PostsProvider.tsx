import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import ApiService from "../../api/ApiService";
import type { Post } from "../../types/post";
import { PostsContext } from "./PostsContext";

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const value = useMemo(
    () => ({ posts, loading, error, fetchPosts }),
    [posts, loading, error, fetchPosts],
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};

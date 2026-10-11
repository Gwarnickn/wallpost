import { createContext } from "react";
import type { Post } from "../../types/post";

export interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  updatePost: (post: Post) => void;
}

export const PostsContext = createContext<PostsContextType | null>(null);

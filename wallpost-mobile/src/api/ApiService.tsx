import type { AxiosError } from "axios";
import api from "./api";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const REFRESH_TOKEN_KEY = "refresh_token";

let accessToken: string | null = null;
let isRefreshing: boolean = false;

const getConfig = () => {
  return {
    headerWithoutAuth: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
    },
    headerWithAuth: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export type Post = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
  likes: number;
  slop: number;
};

const ApiService = {
  URL: import.meta.env.VITE_API_LINK,

  //How get should look like
  async getPosts(): Promise<Post[]> {
    console.log(this.URL);
    const response = await api.get(this.URL + `/posts`, {
      headers: getConfig().headerWithoutAuth,
    });
    return response.data;
  },

  async me() {
    const response = await api.get(this.URL + `/auth/me`, {
      headers: getConfig().headerWithAuth,
    });
    return response.data;
  },

  async likePost(id: string): Promise<Post> {
    const response = await api.patch(this.URL + `/posts/like/${id}`);
    return response.data;
  },

  async unlikePost(id: string): Promise<Post> {
    const response = await api.patch(this.URL + `/posts/unlike/${id}`);
    return response.data;
  },
  async slopPost(id: string): Promise<Post> {
    const response = await api.patch(this.URL + `/posts/slop/${id}`);
    return response.data;
  },

  async scanPoster(image: string) {
    const response = await api.post(this.URL + `/posts/scan`, { image });
    return response.data;
  },

  async createPost(post: Omit<Post, "id" | "likes" | "slop">): Promise<Post> {
    const response = await api.post(this.URL + `/posts`, post);
    return response.data;
  },

  //How post should look like
  //   async login(email: string, password: string) {
  //     const response = await api
  //       .post(this.URL + "/auth/login",{
  //           email: email,
  //           password: password,
  //         },
  //         { headers: getConfig().headerWithoutAuth },
  //       )
  //     const { data } = response;
  //     await this.setTokens(data.token,data.refreshToken);
  //     delete data.token;
  //     delete data.refreshToken;
  //     return data;
  //   },
};

export default ApiService;

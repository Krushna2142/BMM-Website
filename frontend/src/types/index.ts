export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  createdAt: Date;
}

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  backgroundImageId: string | null;
  backgroundImage?: MediaAsset;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  path: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
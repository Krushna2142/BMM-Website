import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/src/services/api";
import { User, AuthResponse, LoginForm } from "@/src/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("bmm_token");
    if (token) {
      // Validate token on mount
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      // Implement token validation endpoint call
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("bmm_token");
      setLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginForm) => {
    try {
      const response = await apiService.post<AuthResponse>("/auth/login", credentials);
      if (response.success && response.data) {
        apiService.setToken(response.data.access_token);
        setUser(response.data.user);
        router.push("/admin/dashboard");
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (error) {
      return { success: false, error: "Invalid credentials" };
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("bmm_token");
    setUser(null);
    router.push("/");
  }, [router]);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User, AuthResponse, LoginForm } from "@/src/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ✅ Use cookies to match login page
    const token = Cookies.get("bmm_admin_token");
    const userData = Cookies.get("bmm_admin_user");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginForm) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, error: error.message || "Login failed" };
      }

      const data: AuthResponse = await res.json();

      // ✅ Store in cookies (matches login page & middleware)
      Cookies.set("bmm_admin_token", data.access_token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/", // ✅ FIX: Makes the cookie accessible across the entire app
      });
      Cookies.set("bmm_admin_user", JSON.stringify(data.user), { 
        expires: 1,
        path: "/", // ✅ FIX: Makes the cookie accessible across the entire app
      });

      setUser(data.user);
      router.push("/admin/dashboard");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Invalid credentials" };
    }
  }, [router]);

  const logout = useCallback(() => {
    // ✅ Remove from cookies
    Cookies.remove("bmm_admin_token", { path: "/" }); // ✅ FIX: Must match the path it was set with
    Cookies.remove("bmm_admin_user", { path: "/" }); // ✅ FIX: Must match the path it was set with
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
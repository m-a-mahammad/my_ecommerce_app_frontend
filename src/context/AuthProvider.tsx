// src/context/AuthProvider.tsx
import { useState, useEffect } from "react";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async (): Promise<User | null> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
      return data;
    } catch (error) {
      console.error("Fetch user error:", error);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      await fetchUser();
      setIsLoadingUser(false);
    };
    fetchUserData();
  }, []);

  // src/context/AuthProvider.tsx
  const updateProfile = async (
    data: Partial<User> | FormData
  ): Promise<User | null> => {
    try {
      const isFormData = data instanceof FormData;
      const url = `${import.meta.env.VITE_API_URL}/api/auth/me`;

      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        body: isFormData ? data : JSON.stringify(data),
        /* 
        FormData لو كنت بتستقبل
        FormData يدويا لأن المتصفح بيظبطها تلقائيا لما تبعت Content-Type لازم ما تضيفش

        headers: isFormData
          ? undefined
          : { "Content-Type": "application/json" },
        */
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error; // Re-throw to handle in components
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }

      const userData = await res.json();
      setUser(userData); // ⬅️ علشان يعكس التحديث فورًا في الواجهة
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null); // 👈 ده لازم يحصل فورًا
      localStorage.removeItem("user");
    } catch (err) {
      console.error("logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, updateProfile, login, logout, isLoadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

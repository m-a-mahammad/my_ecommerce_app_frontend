// src/context/AuthContext.ts
import { createContext } from "react";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: { url: string };
};

export type AuthContextType = {
  user: User | null;
  updateProfile: (data: Partial<User> | FormData) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>; // ⬅️ أضف السطر ده
  isLoadingUser: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  updateProfile: async () => null,
  login: async () => null, // ⬅️ أضف ده علشان يرضى
  logout: async () => {}, // ⬅️ أضف السطر ده كمان هنا
  isLoadingUser: true, // لو ضفته
});

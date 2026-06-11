import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      email: null,
      role: null,
      firstname: null,
      department: null,
      setAuth: (accessToken, refreshToken) => {
        const decoded = jwtDecode(accessToken);
        set({
          accessToken,
          refreshToken,

          email: decoded.email,
          role: decoded.role,
          firstname: decoded.firstname,
          department: decoded.department,
        });
      },

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          email: null,
          role: null,
          firstname: null,
          department: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
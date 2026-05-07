"use client";
import { setUserLogin, setUserToken } from "@/redux/features/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehidratación de Redux
    if (typeof window !== "undefined") {
      const userLoginJSON = localStorage.getItem("userLogin");
      const token = localStorage.getItem("usertoken");

      if (userLoginJSON && token) {
        try {
          const userLogin = JSON.parse(userLoginJSON);
          dispatch(setUserLogin(userLogin));
          dispatch(setUserToken(token));
        } catch (error) {
          console.error("Error al parsear datos de localStorage:", error);
        }
      }
    }

  }, [dispatch]);

  return null;
}

import {  useEffect, useState, type ReactNode } from "react";
import { createContext } from "react";
import { getUserProfile } from "../user/services/profileServices";
import { setLogoutHandler } from "../api/userApi";
import { login, logout } from "../user/services/authServices";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "instructor";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  userLogin: (data: { email: string; password: string }) => Promise<void>;
  userLogout: () => Promise<void>;
}


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children:ReactNode}) =>{
    const [user , setUser] = useState<User | null>(null)
    const [loading , setLoading ] = useState(true)

    useEffect(() => {
    setLogoutHandler(() => {
      setUser(null);
    });
  }, []);

   useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getUserProfile()
        if(!res) return
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const userLogin = async (data: { email: string; password: string }) => {
    const res = await login(data)
    if(!res) return
    // if backend returns accessToken
    if (res.data.accessToken) {
      localStorage.setItem("token", res.data.accessToken);
    }

    setUser(res.data.user ?? res.data);
  };

  const userLogout = async () => {
    try {
      await logout()
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };


  return (
    <AuthContext.Provider
    value = {{
        user,
        isAuthenticated : !!user,
        loading,
        userLogin,
        userLogout,
    }}
    >
    {children} 
    </AuthContext.Provider>
  )

}


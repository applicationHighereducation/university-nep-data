import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';


interface User {
  id: string;
  username: string;
  email: string;
  u_id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
  const checkAuth = async () => {
    try {
      // Call backend to verify token via cookies
      const response = await axios.get("/api/me", {
        withCredentials: true, // 👈 important, sends cookies
      });

      if (response.data.data) {
        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);


  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post('/api/user', userData);
      
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Registration Successful",
          description: "OTP has been sent to your email. Please verify to complete registration.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post('/api/verify', { email, otp });
      
      if (response.status === 200) {
        toast({
          title: "Verification Successful",
          description: "Your account has been verified. You can now log in.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setLoading(true);
    const response = await axios.post(
      "/api/login",
      { email, password },
      { withCredentials: true } // 👈 Important: allow cookies
    );

    if (response.status === 200 && response.data.data) {
      const userData = response.data.data;

      // Save only user info (NOT tokens)
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.username}!`,
      });

      return true;
    }


    

    return false;
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    toast({
      title: "Login Failed",
      description: message,
      variant: "destructive",
    });
    return false;
  } finally {
    setLoading(false);
  }
};


  const logout = async (): Promise<void> => {
  try {
    await axios.post(
      "/api/logout",
      {},
      { withCredentials: true } 
    );
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  }
};


  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    verifyOtp,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
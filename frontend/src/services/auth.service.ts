import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post("auth/signup", data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post("auth/login", credentials);

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.get("auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get("/users/me");
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  }
}

export const authService = new AuthService();

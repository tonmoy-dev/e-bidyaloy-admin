import type { LoginResponse, User } from '../store/types';

export interface RegistrationData {
  // Backend required fields
  name: string;
  slug: string;
  website?: string;
  ieen_no: string;
  phone: string;
  email: string;
  admin_username: string;
  admin_email: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_password: string;
  admin_password_confirm: string;

  // Additional data (optional)
  additional_data?: {
    address?: string;
    total_teachers?: number;
    total_students?: number;
    classes?: string;
    total_sections?: number;
    has_biometric_system?: boolean;
    has_unique_ids?: boolean;
    has_existing_website?: boolean;
  };
}

export interface RegistrationResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    subscription_plan: string;
  };
  message: string;
}

export interface VerificationData {
  email: string;
  code: string;
}

export interface VerificationResponse {
  message: string;
  access?: string;
  refresh?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    user_type: string;
    date_joined: string;
  };
}

export interface ResendVerificationData {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

// Auth utilities that don't depend on RTK Query
export const authUtils = {
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    const accessToken =
      localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    return !!(user && accessToken);
  },

  getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData.user || userData;
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      this.clearStoredAuth();
    }
    return null;
  },

  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    const accessToken =
      localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const refreshToken =
      localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    return { accessToken, refreshToken };
  },

  storeAuthData(data: LoginResponse, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    // Store the complete user data
    storage.setItem('user', JSON.stringify(data));

    // Extract and store tokens separately for baseApi to use
    if (data.access) {
      storage.setItem('access_token', data.access);
    }
    if (data.refresh) {
      storage.setItem('refresh_token', data.refresh);
    }
  },

  updateStoredTokens(access: string, refresh?: string): void {
    // Determine which storage was used originally
    const useLocalStorage = !!localStorage.getItem('access_token');
    const storage = useLocalStorage ? localStorage : sessionStorage;

    storage.setItem('access_token', access);
    if (refresh) {
      storage.setItem('refresh_token', refresh);
    }
  },

  clearStoredAuth(): void {
    // Clear from both storages to be safe
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  },
};

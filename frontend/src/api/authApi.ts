import { AuthResponse, LoginCredentials, SignupData, User } from '../types/auth';

/**
 * ============================================================================
 * CartVerse Auth API Client
 * ============================================================================
 * 
 * Configured endpoints:
 * - Login:       POST /auth/login (fallback: /users/login)
 * - Signup:      POST /auth/register (fallback: /users)
 * - Current User: GET /auth/me (fallback: /users/profile)
 * - Logout:      POST /auth/logout (fallback: /users/logout)
 * 
 * Base URL can be configured via VITE_API_BASE_URL (defaults to http://localhost:5000/api).
 * 
 * NOTE: If your backend uses different route paths (such as /api/users/login),
 * you can easily adjust the ENDPOINTS constants below.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ENDPOINTS = {
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  me: `${BASE_URL}/auth/me`,
  logout: `${BASE_URL}/auth/logout`,
};

// Alternative endpoints for standard MERN pattern compatibility
const FALLBACK_ENDPOINTS = {
  login: `${BASE_URL}/users/login`,
  register: `${BASE_URL}/users`,
  me: `${BASE_URL}/users/profile`,
  logout: `${BASE_URL}/users/logout`,
};

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Normalizes backend user shapes into standard frontend User model.
 * Handles both {_id, name, email} and {id, name, email} or nested {user: {...}}.
 */
function normalizeAuthResponse(data: any): AuthResponse {
  if (!data) {
    throw new ApiError('Empty response received from authentication server.');
  }

  const rawUser = data.user || data;
  const token = data.token || data.jwt || '';

  const user: User = {
    id: rawUser.id || rawUser._id || String(Date.now()),
    name: rawUser.name || 'Gamer',
    email: rawUser.email || '',
    phone: rawUser.phone,
    isAdmin: Boolean(rawUser.isAdmin),
  };

  return {
    user,
    token,
    message: data.message,
  };
}

/**
 * Core fetch wrapper with error parsing and network failure handling.
 */
async function request<T>(url: string, options: RequestInit = {}, fallbackUrl?: string): Promise<T> {
  let response: Response;
  
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    // If 404 on custom route and fallback exists, try fallback endpoint
    if (response.status === 404 && fallbackUrl && fallbackUrl !== url) {
      response = await fetch(fallbackUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
      });
    }
  } catch (err: any) {
    // Catch network / CORS / unreachable server errors
    throw new ApiError('Unable to connect to the server. Please check your network connection or ensure the backend is running.');
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // If response is not JSON
    data = null;
  }

  if (!response.ok) {
    let errorMessage = data?.message || data?.error || 'An unexpected error occurred.';

    if (response.status === 401) {
      errorMessage = data?.message || 'Invalid email or password.';
    } else if (response.status === 409) {
      errorMessage = data?.message || 'An account with this email already exists.';
    } else if (response.status === 403) {
      errorMessage = data?.message || 'Access denied.';
    } else if (response.status >= 500) {
      errorMessage = data?.message || 'Server error. Please try again later.';
    }

    throw new ApiError(errorMessage, response.status);
  }

  return data as T;
}

/**
 * Logs in with email and password
 */
export async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  const data = await request<any>(
    ENDPOINTS.login,
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    },
    FALLBACK_ENDPOINTS.login
  );
  return normalizeAuthResponse(data);
}

/**
 * Registers a new user account
 */
export async function signupRequest(data: SignupData): Promise<AuthResponse> {
  const responseData = await request<any>(
    ENDPOINTS.register,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    FALLBACK_ENDPOINTS.register
  );
  return normalizeAuthResponse(responseData);
}

/**
 * Fetches the currently authenticated user's profile using JWT token
 */
export async function getCurrentUser(token?: string): Promise<User> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const data = await request<any>(
    ENDPOINTS.me,
    {
      method: 'GET',
      headers,
    },
    FALLBACK_ENDPOINTS.me
  );

  const normalized = normalizeAuthResponse(data);
  return normalized.user;
}

/**
 * Calls backend logout endpoint if available (clears server-side cookies)
 */
export async function logoutRequest(token?: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    await request<any>(
      ENDPOINTS.logout,
      {
        method: 'POST',
        headers,
      },
      FALLBACK_ENDPOINTS.logout
    );
  } catch {
    // Client-side logout still completes even if server logout fails
  }
}

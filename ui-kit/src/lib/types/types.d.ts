export interface NavLink {
  title: string;
  href: string;
  icon?: string;
  external?: boolean;
}

export type MessageType = 'error' | 'warn' | 'info' | 'success';

export interface Message {
    text: string;
    type: MessageType;
}

export interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
}

// Common response type for auth endpoints that return tokens
export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Auth API Types
export interface OnboardingRequest {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber?: string;
}

export interface OnboardingResponse extends AuthTokenResponse {
  user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      displayName: string;
      phoneNumber?: string;
  }
}
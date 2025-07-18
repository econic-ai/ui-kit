export type MessageType = 'error' | 'warn' | 'info' | 'success';

export interface Message {
    text: string;
    type: MessageType;
}

export interface ApiError {
    message: string;
    status: number;
}

export interface ApiOptions {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export interface OnboardingRequest {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber?: string;
}

export interface OnboardingResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        displayName: string;
        phoneNumber?: string;
    }
}
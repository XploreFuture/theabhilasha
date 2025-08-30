// src/types/api.ts
export interface UserProfile {
    id: string;
    username: string;
    email: string;
     role: 'user' | 'admin';
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    dob?: string; 
    collegeName?: string;
    avatar?: string;
    social?: {
        instagram?: string;
        website?: string;
        youtube?: string;
        [key: string]: string | null | undefined;
    };
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    accessToken: string;
}
export interface LoginRequest { 
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    msg: string;
}

export interface UpdateProfileRequest {
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | null;
    dob?: string | null;
    collegeName?: string | null;
    avatar?: string | null;
    social?: {
        instagram?: string | null;
        website?: string | null;
        youtube?: string | null;
        [key: string]: string | null | undefined;
    };
}

export interface ApiErrorResponse {
    msg?: string; 
    error?: string; 
    details?: string; 
    errors?: { [key: string]: string }; 
}
export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participationFee: number;
  audienceFee: number;
  image: string;
  category?: 'Open Mic' | 'Puppet Show';  
}
export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  location: string;
  participationFee?: number;
  audienceFee?: number;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;


  export interface RazorpayPrefill {
    name: string;
    email: string;
    contact: string;
  }

  export interface RazorpayTheme {
    color: string;
  }

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

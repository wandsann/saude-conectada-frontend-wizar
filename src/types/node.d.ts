declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_API_URL: string;
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_STORAGE_URL: string;
    VITE_TWILIO_ACCOUNT_SID: string;
    VITE_TWILIO_AUTH_TOKEN: string;
    VITE_TWILIO_PHONE_NUMBER: string;
  }
} 
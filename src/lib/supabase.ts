import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Guest {
  id: string;
  name: string;
  adults: number;
  children: number;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  link: string | null;
  image_url: string | null;
  is_purchased: boolean;
  purchased_by: string | null;
  created_at: string;
}
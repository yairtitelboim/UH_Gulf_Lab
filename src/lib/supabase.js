import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null when the env vars are missing; the app then falls back to sample data.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

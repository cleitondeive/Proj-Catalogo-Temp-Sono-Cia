import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zfonwqmpatubcnpuxcyr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GidJwMFuH6e0-McO4fKBOA_zkmGd5S0';

export const supabase = createClient(supabaseUrl, supabaseKey);

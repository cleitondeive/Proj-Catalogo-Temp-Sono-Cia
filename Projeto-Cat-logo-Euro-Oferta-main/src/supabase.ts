import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yeeewsjkfbxdshliqxli.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yrSrs10YKKmPfo3b3wJmqQ_JbiyW_Dh';

export const supabase = createClient(supabaseUrl, supabaseKey);

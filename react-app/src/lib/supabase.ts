import { createClient } from '@supabase/supabase-js'

// Verificar que las variables de entorno existen
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
    throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Crear y exportar el cliente de Supabase
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseClient;
import { User as SupabaseUser, Session as SupabaseSession, AuthError as SupabaseAuthError } from '@supabase/supabase-js';

// Extender los tipos de Supabase para mayor seguridad
export interface User extends SupabaseUser { }
export interface Session extends SupabaseSession { }
export interface AuthError extends SupabaseAuthError { }

export interface AuthResponse {
    data: {
        user: User | null;
        session: Session | null;
    };
    error: AuthError | null;
}

export interface SignUpResponse {
    data: {
        user: User | null;
        session: Session | null;
    };
    error: AuthError | null;
}

export interface SignInResponse {
    data: {
        user: User | null;
        session: Session | null;
    };
    error: AuthError | null;
}

export interface OAuthResponse {
    data: {
        provider: string;
        url: string;
    } | null;
    error: AuthError | null;
}
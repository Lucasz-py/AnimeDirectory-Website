import supabase from './supabase';
import { UserProfile } from '../types/supabase';

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data as UserProfile;
};

export const getProfileByUsername = async (username: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (error) return null;
    return data as UserProfile;
};
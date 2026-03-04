import { writable } from 'svelte/store';
import { supabase } from './supabaseClient.js';

export const user = writable(null);
export const isLoading = writable(true);

export async function initAuth() {
  isLoading.set(true);

  const { data: { session } } = await supabase.auth.getSession();
  user.set(session?.user || null);
  isLoading.set(false);

  supabase.auth.onAuthStateChange((event, session) => {
    user.set(session?.user || null);
    isLoading.set(false);
  });
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
    return { error };
  }
  return { error: null };
}
import { writable } from 'svelte/store';
import { supabase } from './supabaseClient.js';

// Store for the authenticated user and loading state.
export const user = writable(null);
export const isLoading = writable(true);

export async function initAuth() {
  isLoading.set(true);
// Check for an active session on initialization and set up auth state listener.
// call supabase.auth.getSession() to get the current session
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
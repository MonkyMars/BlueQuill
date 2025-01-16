'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

interface UserProfile {
  displayName: string;
  email: string;
}

interface DatabaseContext {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<DatabaseContext>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUserProfile = async (profile: UserProfile) => {
    if (!user) throw new Error('Not authenticated');
    
    // First update auth metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { display_name: profile.displayName }
    });
    
    if (metadataError) throw metadataError;

    // Then update profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        fullname: profile.displayName,
      })
      .eq('user_id', parseInt(user.id));
    
    if (profileError) throw profileError;
    
    // Update local user state
    setUser(prev => prev ? {
      ...prev,
      user_metadata: {
        ...prev.user_metadata,
        display_name: profile.displayName,
      }
    } : null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
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
  signUp: (email: string, password: string, fullName: string, plan: 'free' | 'pro' | 'enterprise') => Promise<{ user: User; profile: { created_at: string; fullname: string; id: number; plan: string; role: string; user_id: number; }; }>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<DatabaseContext>({
  user: null,
  signIn: async () => {},
  signUp: async () => {
    throw new Error('Not implemented');
  },
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const database = createClientComponentClient<Database>();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await database.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = database.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [database.auth]);

  const signIn = async (email: string, password: string) => {
    const { error } = await database.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    plan: 'free' | 'pro' | 'enterprise' = 'free'
  ) => {
    try {
      const { data: authData, error: signUpError } = await database.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('User not found');
    
      const { data: profileData, error: profileError } = await database
        .from('profiles')
        .insert([
          {
            user_id: parseInt(authData.user.id), 
            fullname: fullName,
            plan: plan,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
        
      if (profileError) {
        await database.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }
      
      return {
        user: authData.user,
        profile: profileData
      };
      
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await database.auth.signOut();
    if (error) throw error;
  };

  const updateUserProfile = async (profile: UserProfile) => {
    if (!user) throw new Error('Not authenticated');
    
    // First update auth metadata
    const { error: metadataError } = await database.auth.updateUser({
      data: { display_name: profile.displayName }
    });
    
    if (metadataError) throw metadataError;

    // Then update profile in profiles table
    const { error: profileError } = await database
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
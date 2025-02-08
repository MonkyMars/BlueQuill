import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Collaborator = Database['public']['Tables']['collaborators']['Row'];

export type CollaboratorWithProfile = Collaborator & {
  profiles: Profile;
};

export async function addCollaborator(documentId: string, email: string, role: 'editor' | 'viewer') {
  const supabase = createClient();

  try {
    // Find the profile by email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    console.log('Profile search result:', { profile, profileError });

    if (!profile) {
      console.error('No profile found for email:', email);
      return { success: false, error: 'No user found with this email address' };
    }

    // Check if user is already a collaborator
    const { data: existingCollaborator, error: existingError } = await supabase
      .from('collaborators')
      .select('*, profiles(*)')
      .eq('document_id', documentId)
      .eq('user_id', profile.id)
      .single();

    console.log('Existing collaborator check:', { existingCollaborator, existingError });

    if (existingCollaborator) {
      return { success: false, error: 'User is already a collaborator' };
    }

    // Add collaborator
    const { data: collaborator, error: collaboratorError } = await supabase
      .from('collaborators')
      .insert([
        {
          document_id: documentId,
          user_id: profile.id,
          role: role
        }
      ])
      .select('*, profiles(*)')
      .single();

    console.log('Add collaborator result:', { collaborator, collaboratorError });

    if (collaboratorError) {
      console.error('Error adding collaborator:', collaboratorError);
      return { success: false, error: collaboratorError.message };
    }

    return {
      success: true,
      collaborator: collaborator as CollaboratorWithProfile
    };
  } catch (error) {
    console.error('Error adding collaborator:', error);
    return { success: false, error: 'Failed to add collaborator' };
  }
}

export async function removeCollaborator(documentId: string, userId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('document_id', documentId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing collaborator:', error);
    return { success: false, error: 'Failed to remove collaborator' };
  }
}

export async function updateCollaboratorRole(documentId: string, userId: string, role: 'editor' | 'viewer') {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('collaborators')
      .update({ role })
      .eq('document_id', documentId)
      .eq('user_id', userId)
      .select('*, profiles(*)')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, collaborator: data as CollaboratorWithProfile };
  } catch (error) {
    console.error('Error updating collaborator role:', error);
    return { success: false, error: 'Failed to update collaborator role' };
  }
}

export async function getCollaborators(documentId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select(`
        *,
        profiles (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('document_id', documentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      collaborators: data as CollaboratorWithProfile[]
    };
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return { success: false, error: 'Failed to fetch collaborators' };
  }
}
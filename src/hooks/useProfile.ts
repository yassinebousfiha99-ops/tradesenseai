import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ProfileData {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  avatar_url: string | null;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<ProfileData>) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Profil mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    },
  });
}

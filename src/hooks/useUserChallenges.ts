import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

export type UserChallenge = Tables<'user_challenges'> & {
  challenge_plans: Tables<'challenge_plans'> | null;
};

export function useUserChallenges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenge_plans (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserChallenge[];
    },
    enabled: !!user,
  });
}

export function useActiveChallenge() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['active-challenge', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenge_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as UserChallenge | null;
    },
    enabled: !!user,
  });
}

export function useChallengePlans() {
  return useQuery({
    queryKey: ['challenge-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_plans')
        .select('*')
        .eq('is_active', true)
        .order('account_size', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

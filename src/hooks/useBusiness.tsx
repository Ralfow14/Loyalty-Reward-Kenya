
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const useBusiness = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  const createBusiness = useMutation({
    mutationFn: async (businessData: {
      name: string;
      phone: string;
      email?: string;
      address?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          ...businessData,
          owner_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast({
        title: "Success",
        description: "Business profile created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create business profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateBusiness = useMutation({
    mutationFn: async (updates: Partial<{
      name: string;
      phone: string;
      email: string;
      address: string;
      points_per_shilling: number;
      reward_threshold: number;
      reward_value: number;
    }>) => {
      if (!business) throw new Error('No business found');
      
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', business.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast({
        title: "Success",
        description: "Business profile updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update business profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    business,
    isLoading,
    createBusiness,
    updateBusiness,
  };
};

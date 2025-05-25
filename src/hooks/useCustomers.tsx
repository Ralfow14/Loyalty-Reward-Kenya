
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusiness } from './useBusiness';
import { useToast } from '@/hooks/use-toast';

export const useCustomers = () => {
  const { business } = useBusiness();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', business?.id],
    queryFn: async () => {
      if (!business) return [];
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!business,
  });

  const createCustomer = useMutation({
    mutationFn: async (customerData: {
      name: string;
      phone: string;
      email?: string;
    }) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Success",
        description: "Customer added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const findCustomerByPhone = async (phone: string) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  };

  return {
    customers,
    isLoading,
    createCustomer,
    findCustomerByPhone,
  };
};

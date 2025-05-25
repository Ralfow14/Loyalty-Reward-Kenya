
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusiness } from './useBusiness';
import { useToast } from '@/hooks/use-toast';

export const useTransactions = () => {
  const { business } = useBusiness();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', business?.id],
    queryFn: async () => {
      if (!business) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          customers (
            name,
            phone
          )
        `)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!business,
  });

  const createTransaction = useMutation({
    mutationFn: async (transactionData: {
      customer_id: string;
      amount: number;
      mpesa_transaction_id?: string;
    }) => {
      if (!business) throw new Error('No business found');
      
      // Calculate points using the database function
      const { data: pointsData, error: pointsError } = await supabase
        .rpc('calculate_points', {
          business_uuid: business.id,
          amount_kes: transactionData.amount
        });
      
      if (pointsError) throw pointsError;
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          business_id: business.id,
          points_awarded: pointsData,
        })
        .select(`
          *,
          customers (
            name,
            phone
          )
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast({
        title: "Success",
        description: "Transaction recorded successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction,
  };
};

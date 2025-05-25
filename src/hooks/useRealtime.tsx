
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useRealtime = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up realtime subscriptions');

    // Subscribe to transaction updates
    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          console.log('New transaction:', payload);
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['customers'] });
          
          toast({
            title: "New Transaction",
            description: `Payment of KES ${payload.new.amount} received`,
          });
        }
      )
      .subscribe();

    // Subscribe to customer updates
    const customersChannel = supabase
      .channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('Customer updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
      )
      .subscribe();

    // Subscribe to rewards updates
    const rewardsChannel = supabase
      .channel('rewards-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rewards'
        },
        (payload) => {
          console.log('New reward:', payload);
          queryClient.invalidateQueries({ queryKey: ['rewards'] });
          
          toast({
            title: "Reward Earned!",
            description: `A customer just earned a reward worth KES ${payload.new.reward_value}!`,
          });
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(customersChannel);
      supabase.removeChannel(rewardsChannel);
    };
  }, [queryClient, toast]);
};

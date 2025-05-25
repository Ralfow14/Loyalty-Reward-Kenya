
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MpesaPayment {
  phone: string;
  amount: number;
  businessId: string;
  description?: string;
}

export const useMpesa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initiatePayment = async (paymentData: MpesaPayment) => {
    setIsLoading(true);
    try {
      console.log('Initiating M-PESA payment:', paymentData);
      
      // Call the M-PESA edge function
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          action: 'stkpush',
          ...paymentData
        }
      });

      if (error) throw error;

      toast({
        title: "Payment Initiated",
        description: "Please check your phone for M-PESA prompt",
      });

      return data;
    } catch (error: any) {
      console.error('M-PESA payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const processPaymentCallback = async (callbackData: any) => {
    try {
      console.log('Processing M-PESA callback:', callbackData);
      
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          action: 'callback',
          ...callbackData
        }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('M-PESA callback error:', error);
      throw error;
    }
  };

  return {
    isLoading,
    initiatePayment,
    processPaymentCallback,
  };
};

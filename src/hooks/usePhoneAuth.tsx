
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePhoneAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'details'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const verifyPhone = async (phone: string) => {
    setIsLoading(true);
    try {
      // Check if customer exists
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPhoneNumber(phone);
      
      if (customer) {
        // Customer exists, proceed to login
        return { exists: true, customer };
      } else {
        // Customer doesn't exist, go to registration
        setStep('details');
        return { exists: false };
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify phone number",
        variant: "destructive",
      });
      return { exists: false };
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomer = async (customerData: {
    name: string;
    phone: string;
    email?: string;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer account created successfully!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create customer account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('phone');
    setPhoneNumber('');
  };

  return {
    isLoading,
    step,
    phoneNumber,
    verifyPhone,
    createCustomer,
    resetFlow,
  };
};

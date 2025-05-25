
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, phone, amount, businessId, description, ...callbackData } = await req.json();
    
    console.log('M-PESA function called with action:', action);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'stkpush') {
      // STK Push implementation
      console.log('Processing STK Push for:', { phone, amount, businessId });
      
      // Validate inputs
      if (!phone || !amount || !businessId) {
        throw new Error('Missing required fields: phone, amount, businessId');
      }

      // Check if customer exists
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

      if (customerError && customerError.code !== 'PGRST116') {
        throw customerError;
      }

      if (!customer) {
        throw new Error('Customer not found. Please register first.');
      }

      // Get business details
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (businessError) {
        throw businessError;
      }

      // Simulate M-PESA STK Push (replace with actual M-PESA API call)
      const transactionId = `MPESA${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      // For demo purposes, we'll simulate a successful payment after 3 seconds
      setTimeout(async () => {
        try {
          // Calculate points
          const pointsAwarded = Math.floor(amount * (business.points_per_shilling || 0.01));
          
          // Create transaction record
          const { data: transaction, error: transactionError } = await supabase
            .from('transactions')
            .insert({
              business_id: businessId,
              customer_id: customer.id,
              amount: amount,
              points_awarded: pointsAwarded,
              mpesa_transaction_id: transactionId,
              status: 'completed'
            })
            .select()
            .single();

          if (transactionError) {
            console.error('Transaction creation error:', transactionError);
            return;
          }

          console.log('Transaction created successfully:', transaction);

          // Send notification
          await supabase
            .from('notifications')
            .insert({
              customer_id: customer.id,
              type: 'transaction',
              title: 'Payment Received',
              message: `You earned ${pointsAwarded} points from your KES ${amount} payment at ${business.name}`,
            });

        } catch (error) {
          console.error('Callback processing error:', error);
        }
      }, 3000);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'STK push initiated successfully',
          transactionId,
          CheckoutRequestID: transactionId,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );

    } else if (action === 'callback') {
      // M-PESA callback handler
      console.log('Processing M-PESA callback:', callbackData);
      
      // Process the callback data (this would be called by M-PESA)
      // Implementation depends on actual M-PESA callback structure
      
      return new Response(
        JSON.stringify({ success: true, message: 'Callback processed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    throw new Error('Invalid action specified');

  } catch (error) {
    console.error('M-PESA function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

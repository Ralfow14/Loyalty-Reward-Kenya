import { serve } from "std/http";
import { createClient } from "supabase";
import { encode as btoa } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let action: string | undefined;
  let phone: string | undefined;
  let amount: number | undefined;
  let businessId: string | undefined;
  let description: string | undefined;
  let callbackData: any = {};

  try {
    // Parse request body
    try {
      const body = await req.json();
      action = body.action;
      phone = body.phone;
      amount = body.amount;
      businessId = body.businessId;
      description = body.description;
      callbackData = body;
    } 
    catch (e: unknown) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid or missing JSON body',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log('M-PESA function called with action:', action);

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'stkpush') {
      // Validate required fields
      if (!phone || !amount || !businessId) {
        throw new Error('Missing required fields: phone, amount, businessId');
      }

      // Check customer existence
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

      // Get business info
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (businessError) {
        throw businessError;
      }

      // --- M-PESA STK Push ---
      const authResponse = await fetch(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(
              `${Deno.env.get('MPESA_CONSUMER_KEY')}:${Deno.env.get('MPESA_CONSUMER_SECRET')}`
            )
          }
        }
      );

      const authData = await authResponse.json();
      const accessToken = authData.access_token;

      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = btoa(
        `${Deno.env.get('MPESA_SHORTCODE')}${Deno.env.get('MPESA_PASSKEY')}${timestamp}`
      );

      const stkPushResponse = await fetch(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            BusinessShortCode: Deno.env.get('MPESA_SHORTCODE'),
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerBuyGoodsOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: Deno.env.get('MPESA_SHORTCODE'),
            PhoneNumber: phone,
            CallBackURL: Deno.env.get('MPESA_CALLBACK_URL'),
            AccountReference: business.name,
            TransactionDesc: description || "Payment for services"
          })
        }
      );

      const stkPushData = await stkPushResponse.json();

      if (stkPushData.ResponseCode === "0") {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'STK push initiated successfully',
            transactionId: stkPushData.CheckoutRequestID,
            CheckoutRequestID: stkPushData.CheckoutRequestID,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } else {
        throw new Error(`STK push failed: ${stkPushData.errorMessage || JSON.stringify(stkPushData)}`);
      }

    } else if (action === 'callback') {
      // --- M-PESA Callback Handler ---
      console.log('Processing M-PESA callback:', callbackData);

      // TODO: Save transaction data to DB or perform necessary updates

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
        success: false,
        error:  typeof error === 'object' && error !== null && 'message' in error
           ? (error as { message: string }).message
            : String(error) || 'Internal server error'
            }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

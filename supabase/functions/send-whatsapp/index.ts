import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_WHATSAPP_NUMBER = Deno.env.get('TWILIO_WHATSAPP_NUMBER');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppRequest {
  to: string;
  teamLeadName: string;
  location: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, teamLeadName, location, message }: WhatsAppRequest = await req.json();

    console.log('Sending WhatsApp message to:', to);

    // Format phone number for WhatsApp (remove any formatting)
    const cleanPhoneNumber = to.replace(/[^0-9+]/g, '');
    const whatsappTo = `whatsapp:${cleanPhoneNumber}`;

    // Construct the emergency message
    const emergencyMessage = `🚨 EMERGENCY DISPATCH ALERT 🚨\n\nHello ${teamLeadName},\n\nYou have been dispatched to handle an emergency situation.\n\n📍 Location: ${location}\n⚠️ Alert: ${message}\n\nPlease proceed to the location immediately and confirm your arrival.\n\n- Mahakumbh 2025 Control Center`;

    // Send WhatsApp message using Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('From', TWILIO_WHATSAPP_NUMBER!);
    formData.append('To', whatsappTo);
    formData.append('Body', emergencyMessage);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Twilio API error:', errorData);
      throw new Error(`Twilio API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('WhatsApp message sent successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: data.sid,
        to: whatsappTo 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-whatsapp function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

import { supabase } from '@/lib/supabase';

// Update to the correct environment variable name
const elizaUrl = process.env.EXPO_PUBLIC_ELIZA_OS_API_URL;

export async function sendMessage(request: FormData): Promise<Response> {
  try {
    const userId = request.get('userId') || 'user';
    const userName = request.get('userName') || '';
    const name = request.get('name') || '';
    const text = request.get('text');
    const agentId = request.get('agentId');

    if (!text) {
      return new Response(JSON.stringify({ error: 'No message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!agentId) {
      return new Response(JSON.stringify({ error: 'Agent ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get agent from database
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      console.error('Agent error:', agentError);
      return new Response(JSON.stringify({ error: 'Agent not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Forward to elizaOS API
    const elizaFormData = new FormData();
    elizaFormData.append('userId', userId);
    elizaFormData.append('userName', userName);
    elizaFormData.append('name', name);
    elizaFormData.append('text', text);

    console.log('Forwarding message to elizaOS:', `${elizaUrl}/${agentId}/message`);

    // Add timeout and error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch(`${elizaUrl}/${agentId}/message`, {
        method: 'POST',
        body: elizaFormData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`elizaOS API error (${response.status}): ${errorText}`);
      }

      // Parse the JSON response
      const responseData = await response.json();
      
      // Handle the array format that ElizaOS returns
      let textResponse = '';
      let actionType = 'NONE';
      
      if (Array.isArray(responseData) && responseData.length > 0) {
        // Get the first response in the array
        const elizaResponse = responseData[0];
        textResponse = elizaResponse.text || '';
        actionType = elizaResponse.action || 'NONE';
      } else {
        // Fallback for backward compatibility
        textResponse = responseData.text || '';
      }

      // Store interaction in database
      const { error: interactionError } = await supabase
        .from('agent_interactions')
        .insert({
          agent_id: agentId,
          user_id: userId,
          input: text,
          output: textResponse,
          metadata: {
            userName,
            timestamp: new Date().toISOString(),
            action: actionType
          },
        });

      if (interactionError) {
        console.error('Error storing interaction:', interactionError);
      }

      // Return a standardized response format that the frontend expects
      return new Response(JSON.stringify({ 
        text: textResponse, 
        action: actionType,
        original: responseData 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({ error: 'Request timed out', text: 'I apologize, but the service is currently not responding. Please try again later.' }), {
          status: 408,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error in message endpoint:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        text: 'I encountered an error processing your message. Please try again later.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export default sendMessage;
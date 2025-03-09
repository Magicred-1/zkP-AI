import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type AgentInsert = Database['public']['Tables']['agents']['Insert'];

export async function createAgent(agent: AgentInsert) {
  try {
    // Validate required fields
    if (!agent.name) {
      throw new Error('Agent name is required');
    }
    if (!agent.type) {
      throw new Error('Agent type is required');
    }
    if (!agent.created_by) {
      throw new Error('Created by is required');
    }

    // Ensure avatar_url is a valid URL if provided
    if (agent.avatar_url && !isValidUrl(agent.avatar_url)) {
      throw new Error('Invalid avatar URL');
    }

    // Ensure config has required fields
    const config = agent.config as any;
    if (!config?.bio?.length) {
      throw new Error('At least one bio entry is required');
    }
    if (!config?.lore?.length) {
      throw new Error('At least one lore entry is required');
    }

    // Insert the agent
    const { data, error } = await supabase
      .from('agents')
      .insert({
        name: agent.name,
        description: agent.description,
        type: agent.type,
        avatar_url: agent.avatar_url,
        config: {
          bio: config.bio,
          lore: config.lore,
          style: config.style || {
            all: ["keep responses concise and sharp"],
            chat: ["respond with quick wit"],
            post: ["craft concise thought bombs"]
          },
          topics: config.topics || [],
          plugins: config.plugins || [],
          adjectives: config.adjectives || ["brilliant", "enigmatic", "witty"],
          postExamples: config.postExamples || [],
          modelProvider: config.modelProvider || "groq",
          messageExamples: config.messageExamples || []
        },
        is_active: true,
        created_by: agent.created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating agent:', error);
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error in createAgent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create agent',
    };
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { createAgent as createAgentApi } from '@/app/api/agents/create';
import type { Database } from '@/types/database.types';
import { useAuth } from './useAuth';

export type Agent = Database['public']['Tables']['agents']['Row'];
export type AgentInsert = Database['public']['Tables']['agents']['Insert'];
export type AgentUpdate = Database['public']['Tables']['agents']['Update'];

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  const fetchAgents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('agents')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAgents(data || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agent: AgentInsert) => {
    try {
      setError(null);
      const result = await createAgentApi(agent);

      if (!result.success) {
        throw new Error(result.error);
      }

      setAgents(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      console.error('Error creating agent:', err);
      setError(err instanceof Error ? err.message : 'Failed to create agent');
      throw err;
    }
  };

  const updateAgent = async (id: string, updates: AgentUpdate) => {
    if (!user) return;

    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('agents')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('created_by', user.id) // Ensure user can only update their own agents
        .select()
        .single();

      if (updateError) throw updateError;
      setAgents(prev => prev.map(agent => agent.id === id ? data : agent));
      return data;
    } catch (err) {
      console.error('Error updating agent:', err);
      setError(err instanceof Error ? err.message : 'Failed to update agent');
      throw err;
    }
  };

  const deleteAgent = async (id: string) => {
    if (!user) return;

    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id); // Ensure user can only delete their own agents

      if (deleteError) throw deleteError;
      setAgents(prev => prev.filter(agent => agent.id !== id));
    } catch (err) {
      console.error('Error deleting agent:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete agent');
      throw err;
    }
  };

  return {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    refreshAgents: fetchAgents,
  };
}
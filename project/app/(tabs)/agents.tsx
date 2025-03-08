import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, ChartBar as BarChart2, MessageSquare } from 'lucide-react-native';
import { useAgents } from '@/hooks/useAgents';

export default function AgentsScreen() {
  const { agents, loading, error } = useAgents();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>My Agents</Text>
          <Text style={styles.subtitle}>Manage and monitor your AI agents</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{agents.length}</Text>
            <Text style={styles.statLabel}>Total Agents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {agents.filter(a => a.is_active).length}
            </Text>
            <Text style={styles.statLabel}>Active Now</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {agents.reduce((sum, a) => sum + ((a.config as any)?.interactions || 0), 0)}
            </Text>
            <Text style={styles.statLabel}>Total Interactions</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Agents</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading agents...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : agents.length === 0 ? (
            <Text style={styles.emptyText}>No agents found. Create one to get started!</Text>
          ) : (
            agents.map((agent) => (
              <View key={agent.id} style={styles.agentCard}>
                <View style={styles.agentHeader}>
                  <View style={styles.agentProfile}>
                    <Image 
                      source={{ 
                        uri: agent.avatar_url || 
                        'https://images.unsplash.com/photo-1675426513962-63c6022a8626?w=400&auto=format&fit=crop&q=80'
                      }}
                      style={styles.agentAvatar}
                    />
                    <View>
                      <Text style={styles.agentName}>{agent.name}</Text>
                      <Text style={styles.agentType}>{agent.type}</Text>
                    </View>
                  </View>
                  <Pressable
                    style={[
                      styles.statusButton,
                      { backgroundColor: agent.is_active ? '#DCF7E3' : '#FEE2E2' },
                    ]}>
                    {agent.is_active ? (
                      <Play size={16} color="#059669" />
                    ) : (
                      <Pause size={16} color="#DC2626" />
                    )}
                    <Text
                      style={[
                        styles.statusText,
                        { color: agent.is_active ? '#059669' : '#DC2626' },
                      ]}>
                      {agent.is_active ? 'Active' : 'Paused'}
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.agentStats}>
                  <View style={styles.statItem}>
                    <MessageSquare size={16} color="#6B7280" />
                    <Text style={styles.statText}>
                      {((agent.config as any)?.interactions || 0)} interactions
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <BarChart2 size={16} color="#6B7280" />
                    <Text style={styles.statText}>
                      {((agent.config as any)?.accuracy || 95)}% accuracy
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
  },
  title: {
    fontFamily: 'LexendBold',
    fontSize: 32,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontFamily: 'LexendBold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'LexendBold',
    fontSize: 20,
    color: '#111827',
    marginLeft: 24,
    marginBottom: 16,
  },
  agentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  agentProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  agentName: {
    fontFamily: 'LexendSemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  agentType: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: 'LexendSemiBold',
    fontSize: 14,
    marginLeft: 6,
  },
  agentStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  loadingText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
  errorText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 24,
  },
  emptyText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
});
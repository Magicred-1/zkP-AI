import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, ChartBar as BarChart2, MessageSquare } from 'lucide-react-native';

export default function AgentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>My Agents</Text>
          <Text style={styles.subtitle}>Manage and monitor your AI agents</Text>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Agents</Text>
          {agents.map((agent, index) => (
            <View key={index} style={styles.agentCard}>
              <View style={styles.agentHeader}>
                <View>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <Text style={styles.agentType}>{agent.type}</Text>
                </View>
                <Pressable
                  style={[
                    styles.statusButton,
                    { backgroundColor: agent.active ? '#DCF7E3' : '#FEE2E2' },
                  ]}>
                  {agent.active ? (
                    <Play size={16} color="#059669" />
                  ) : (
                    <Pause size={16} color="#DC2626" />
                  )}
                  <Text
                    style={[
                      styles.statusText,
                      { color: agent.active ? '#059669' : '#DC2626' },
                    ]}>
                    {agent.active ? 'Active' : 'Paused'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.agentStats}>
                <View style={styles.statItem}>
                  <MessageSquare size={16} color="#6B7280" />
                  <Text style={styles.statText}>{agent.interactions} interactions</Text>
                </View>
                <View style={styles.statItem}>
                  <BarChart2 size={16} color="#6B7280" />
                  <Text style={styles.statText}>{agent.accuracy}% accuracy</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const stats = [
  { label: 'Total Agents', value: '12' },
  { label: 'Active Now', value: '5' },
  { label: 'Total Interactions', value: '2.4k' },
];

const agents = [
  {
    name: 'Customer Support',
    type: 'Service Agent',
    active: true,
    interactions: 1234,
    accuracy: 98,
  },
  {
    name: 'Data Analyzer',
    type: 'Analysis Agent',
    active: true,
    interactions: 856,
    accuracy: 95,
  },
  {
    name: 'Content Writer',
    type: 'Creative Agent',
    active: false,
    interactions: 432,
    accuracy: 92,
  },
];

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
    fontFamily: 'SpaceGrotesk',
    fontSize: 32,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter',
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
    fontFamily: 'InterBold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'InterBold',
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
  agentName: {
    fontFamily: 'InterSemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  agentType: {
    fontFamily: 'Inter',
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
    fontFamily: 'InterSemiBold',
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
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
});
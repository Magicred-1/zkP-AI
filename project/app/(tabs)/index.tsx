import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ChevronRight } from 'lucide-react-native';

export default function BuildScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Agent Builder</Text>
          <Text style={styles.subtitle}>Create powerful AI agents without code</Text>
        </View>

        <Pressable style={styles.createButton}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create New Agent</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
            {templates.map((template, index) => (
              <Pressable key={index} style={styles.templateCard}>
                <Image source={{ uri: template.image }} style={styles.templateImage} />
                <View style={styles.templateContent}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Agents</Text>
          {recentAgents.map((agent, index) => (
            <Pressable key={index} style={styles.agentCard}>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentType}>{agent.type}</Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const templates = [
  {
    title: 'Customer Service',
    description: 'Build an AI agent that handles customer inquiries',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&auto=format&fit=crop&q=80',
  },
  {
    title: 'Data Analysis',
    description: 'Create an agent that processes and analyzes data',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
  },
  {
    title: 'Content Writer',
    description: 'Design an AI that generates engaging content',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80',
  },
];

const recentAgents = [
  { name: 'Support Bot', type: 'Customer Service' },
  { name: 'Data Analyzer', type: 'Analytics' },
  { name: 'Content Assistant', type: 'Content Generation' },
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
  createButton: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    marginLeft: 12,
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
  templatesScroll: {
    paddingLeft: 24,
  },
  templateCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  templateImage: {
    width: '100%',
    height: 160,
  },
  templateContent: {
    padding: 16,
  },
  templateTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
  },
  templateDescription: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#6B7280',
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  agentType: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#6B7280',
  },
});
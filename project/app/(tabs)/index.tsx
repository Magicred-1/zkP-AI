import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ChevronRight, Bot, MessageSquare, Code, Database } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type Template = {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  config: {
    name: string;
    description: string;
    type: string;
    bio: string[];
    lore: string[];
    knowledge: string[];
    topics: string[];
  };
};

const templates: Template[] = [
  {
    id: 'customer-service',
    title: 'Customer Service',
    description: 'Build an AI agent that handles customer inquiries',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&auto=format&fit=crop&q=80',
    icon: <MessageSquare size={24} color="#7C3AED" />,
    config: {
      name: 'Customer Support Agent',
      description: 'An AI assistant specialized in customer service and support',
      type: 'chat',
      bio: [
        'Professional and empathetic customer service representative',
        'Experienced in handling customer inquiries and complaints',
        'Trained to provide clear and helpful solutions'
      ],
      lore: [
        'Deep understanding of customer service best practices',
        'Knowledge of common customer pain points and solutions'
      ],
      knowledge: [
        'Customer service protocols and procedures',
        'Conflict resolution techniques',
        'Product knowledge and support guidelines'
      ],
      topics: [
        'Customer Support',
        'Technical Assistance',
        'Product Information',
        'Order Management'
      ]
    }
  },
  {
    id: 'code-assistant',
    title: 'Code Assistant',
    description: 'Create an AI that helps with programming tasks',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    icon: <Code size={24} color="#7C3AED" />,
    config: {
      name: 'Code Helper',
      description: 'An AI assistant specialized in programming and development',
      type: 'code',
      bio: [
        'Expert programmer with broad language knowledge',
        'Specializes in code review and optimization',
        'Experienced in debugging and problem-solving'
      ],
      lore: [
        'Deep understanding of software development principles',
        'Knowledge of best practices across different programming paradigms'
      ],
      knowledge: [
        'Multiple programming languages and frameworks',
        'Software architecture patterns',
        'Testing and debugging methodologies'
      ],
      topics: [
        'Programming',
        'Code Review',
        'Debugging',
        'Software Architecture'
      ]
    }
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Design an AI that processes and analyzes data',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
    icon: <Database size={24} color="#7C3AED" />,
    config: {
      name: 'Data Analysis Assistant',
      description: 'An AI assistant specialized in data analysis and insights',
      type: 'data',
      bio: [
        'Expert in data analysis and visualization',
        'Skilled in statistical analysis and interpretation',
        'Experienced in generating actionable insights'
      ],
      lore: [
        'Deep understanding of data analysis methodologies',
        'Knowledge of statistical principles and techniques'
      ],
      knowledge: [
        'Statistical analysis methods',
        'Data visualization techniques',
        'Machine learning principles'
      ],
      topics: [
        'Data Analysis',
        'Statistics',
        'Data Visualization',
        'Business Intelligence'
      ]
    }
  }
];

const recentAgents = [
  { name: 'Support Bot', type: 'Customer Service' },
  { name: 'Data Analyzer', type: 'Analytics' },
  { name: 'Content Assistant', type: 'Content Generation' },
];

export default function BuildScreen() {
  const createButtonScale = useSharedValue(1);
  const templateAnimations = templates.map(() => ({
    scale: useSharedValue(1),
  }));

  const handleCreateFromTemplate = (template: Template) => {
    const index = templates.findIndex(t => t.id === template.id);
    templateAnimations[index].scale.value = withSequence(
      withSpring(0.95),
      withSpring(1, undefined, () => {
        router.push({
          pathname: '/(tabs)/create',
          params: {
            template: JSON.stringify(template.config)
          }
        });
      })
    );
  };

  const handleCreateNew = () => {
    createButtonScale.value = withSequence(
      withSpring(0.95),
      withSpring(1, undefined, () => {
        router.push('/(tabs)/create');
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Agent Builder</Text>
          <Text style={styles.subtitle}>Create powerful AI agents without code</Text>
        </View>

        <AnimatedPressable 
          style={[
            styles.createButton,
            useAnimatedStyle(() => ({
              transform: [{ scale: createButtonScale.value }]
            }))
          ]}
          onPress={handleCreateNew}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create New Agent</Text>
        </AnimatedPressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
            {templates.map((template, index) => (
              <AnimatedPressable 
                key={template.id} 
                style={[
                  styles.templateCard,
                  useAnimatedStyle(() => ({
                    transform: [{ scale: templateAnimations[index].scale.value }]
                  }))
                ]}
                onPress={() => handleCreateFromTemplate(template)}>
                <Image source={{ uri: template.image }} style={styles.templateImage} />
                <View style={styles.templateContent}>
                  <View style={styles.templateHeader}>
                    {template.icon}
                    <Text style={styles.templateTitle}>{template.title}</Text>
                  </View>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                </View>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Agents</Text>
          {recentAgents.map((agent, index) => (
            <Pressable 
              key={index} 
              style={styles.agentCard}
              onPress={() => router.push('/(tabs)/agents')}>
              <View style={styles.agentInfo}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1675426513962-63c6022a8626?w=400&auto=format&fit=crop&q=80' }}
                  style={styles.agentAvatar}
                />
                <View>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <Text style={styles.agentType}>{agent.type}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </Pressable>
          ))}
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
    fontFamily: 'LexendSemiBold',
    fontSize: 16,
    marginLeft: 12,
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
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  templateTitle: {
    fontFamily: 'LexendSemiBold',
    fontSize: 18,
    color: '#111827',
  },
  templateDescription: {
    fontFamily: 'Lexend',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentName: {
    fontFamily: 'LexendSemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  agentType: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
});
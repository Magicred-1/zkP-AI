import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Brain, ChevronLeft, Plus, Trash2, Shield, Blocks as Blockchain, Bot, MessageSquare, Code, Database, Camera } from 'lucide-react-native';
import { useAgents } from '@/hooks/useAgents';
import { useAuth } from '@/hooks/useAuth';
import { useStorage } from '@/hooks/useStorage';
import { PluginId, PluginRegistry } from '@/constants/plugins';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

type AgentType = {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: React.ReactNode;
};

const agentTypes: AgentType[] = [
  {
    id: 'chat',
    name: 'Chat Agent',
    description: 'Create an AI agent for natural conversations',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&auto=format&fit=crop&q=80',
    icon: <MessageSquare size={24} color="#7C3AED" />,
  },
  {
    id: 'code',
    name: 'Code Assistant',
    description: 'Build an AI that helps with programming',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    icon: <Code size={24} color="#7C3AED" />,
  },
  {
    id: 'data',
    name: 'Data Analyst',
    description: 'Design an AI for data analysis',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
    icon: <Database size={24} color="#7C3AED" />,
  },
];

type FormData = {
  name: string;
  description: string;
  type: string;
  avatar_url: string;
  bio: string[];
  lore: string[];
  knowledge: string[];
  topics: string[];
  plugins: PluginId[];
};

export default function CreateAgentScreen() {
  const { createAgent } = useAgents();
  const { user } = useAuth();
  const { pickImage, uploadAvatar, uploading: uploadingAvatar, previewUrl } = useStorage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const params = useLocalSearchParams();
  const [isHovered, setIsHovered] = useState(false);
  const overlayOpacity = useSharedValue(0);
  
  const [formData, setFormData] = useState<FormData>(() => {
    let template;
    
    try {
      template = params.template ? JSON.parse(params.template as string) : null;
    } catch (e) {
      console.error('Failed to parse template:', e);
    }
    
    return {
      name: template?.name || '',
      description: template?.description || '',
      type: template?.type || 'chat',
      avatar_url: template?.avatar_url || agentTypes.find(t => t.id === 'chat')?.image || '',
      bio: template?.bio || [''],
      lore: template?.lore || [''],
      knowledge: template?.knowledge || [''],
      topics: template?.topics || [''],
      plugins: [PluginId.MARLIN_TEE], // Always include Marlin TEE
    };
  });

  const fieldAnimations = {
    type: {
      scale: useSharedValue(1),
    },
  };

  useEffect(() => {
    overlayOpacity.value = withTiming(isHovered ? 1 : 0, {
      duration: 200,
    });
  }, [isHovered]);

  const handleAddItem = (field: keyof Omit<FormData, 'name' | 'description' | 'type' | 'avatar_url' | 'plugins'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveItem = (field: keyof Omit<FormData, 'name' | 'description' | 'type' | 'avatar_url' | 'plugins'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleUpdateItem = (
    field: keyof Omit<FormData, 'name' | 'description' | 'type' | 'avatar_url' | 'plugins'>,
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleTypeSelect = (typeId: string) => {
    const animation = fieldAnimations.type;
    animation.scale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    
    const selectedType = agentTypes.find(t => t.id === typeId);
    setFormData(prev => ({
      ...prev,
      type: typeId,
      avatar_url: selectedType?.image || prev.avatar_url,
    }));
  };

  const togglePlugin = (pluginId: PluginId) => {
    // Don't allow toggling Marlin TEE as it's required
    if (pluginId === PluginId.MARLIN_TEE) return;
    
    setFormData(prev => ({
      ...prev,
      plugins: prev.plugins.includes(pluginId)
        ? prev.plugins.filter(id => id !== pluginId)
        : [...prev.plugins, pluginId],
    }));
  };

  const handleAvatarPress = async () => {
    try {
      const base64Image = await pickImage();
      if (!base64Image) return;

      const publicUrl = await uploadAvatar(base64Image, `agent-avatars/${user?.id}`);
      if (publicUrl) {
        setFormData(prev => ({
          ...prev,
          avatar_url: publicUrl,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      // Filter out empty strings
      const cleanedFormData = {
        ...formData,
        bio: formData.bio.filter(Boolean),
        lore: formData.lore.filter(Boolean),
        knowledge: formData.knowledge.filter(Boolean),
        topics: formData.topics.filter(Boolean),
      };

      if (!cleanedFormData.name) {
        throw new Error('Agent name is required');
      }

      const agent = await createAgent({
        name: cleanedFormData.name,
        description: cleanedFormData.description,
        type: cleanedFormData.type,
        avatar_url: cleanedFormData.avatar_url,
        created_by: user.id,
        config: {
          bio: cleanedFormData.bio,
          lore: cleanedFormData.lore,
          knowledge: cleanedFormData.knowledge,
          topics: cleanedFormData.topics,
          plugins: cleanedFormData.plugins,
          modelProvider: 'groq',
          settings: {
            voice: {
              model: 'en_US-male-medium'
            }
          }
        },
      });

      router.push('/(tabs)/agents');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (
    field: keyof Omit<FormData, 'name' | 'description' | 'type' | 'avatar_url' | 'plugins'>,
    title: string,
    placeholder: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldTitle}>{title}</Text>
      {formData[field].map((item, index) => (
        <View key={index} style={styles.arrayItemContainer}>
          <TextInput
            style={styles.arrayInput}
            value={item}
            onChangeText={(value) => handleUpdateItem(field, index, value)}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            multiline
          />
          <Pressable
            style={styles.removeButton}
            onPress={() => handleRemoveItem(field, index)}>
            <Trash2 size={20} color="#DC2626" />
          </Pressable>
        </View>
      ))}
      <Pressable
        style={styles.addButton}
        onPress={() => handleAddItem(field)}>
        <Plus size={20} color="#7C3AED" />
        <Text style={styles.addButtonText}>Add {title}</Text>
      </Pressable>
    </View>
  );

  const avatarOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111827" />
        </Pressable>
        <Text style={styles.title}>Create Agent</Text>
        <Brain size={24} color="#7C3AED" />
      </View>

      <ScrollView style={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <Pressable 
            style={styles.avatarContainer} 
            onPress={handleAvatarPress}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={uploadingAvatar}>
            <Image
              source={{ uri: previewUrl || formData.avatar_url }}
              style={styles.avatarImage}
            />
            <AnimatedView style={[styles.avatarOverlay, avatarOverlayStyle]}>
              <Camera size={24} color="#FFFFFF" />
              <Text style={styles.avatarText}>
                {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
              </Text>
            </AnimatedView>
          </Pressable>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Agent Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
              placeholder="Enter agent name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Enter agent description"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Agent Type</Text>
            <View style={styles.typeGrid}>
              {agentTypes.map((type) => (
                <AnimatedPressable
                  key={type.id}
                  style={[
                    styles.typeCard,
                    formData.type === type.id && styles.typeCardSelected,
                    useAnimatedStyle(() => ({
                      transform: [
                        { scale: formData.type === type.id ? fieldAnimations.type.scale.value : 1 }
                      ]
                    }))
                  ]}
                  onPress={() => handleTypeSelect(type.id)}>
                  <View style={styles.typeIcon}>
                    {type.icon}
                  </View>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeName}>{type.name}</Text>
                    <Text style={styles.typeDescription}>{type.description}</Text>
                  </View>
                </AnimatedPressable>
              ))}
            </View>
          </View>

          {renderArrayField('bio', 'Bio', 'Enter bio point')}
          {renderArrayField('lore', 'Lore', 'Enter lore point')}
          {renderArrayField('knowledge', 'Knowledge', 'Enter knowledge point')}
          {renderArrayField('topics', 'Topics', 'Enter topic')}

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Plugins</Text>
            <View style={styles.pluginsGrid}>
              {Object.entries(PluginRegistry).map(([id, plugin]) => (
                <Pressable
                  key={id}
                  style={[
                    styles.pluginCard,
                    id === PluginId.MARLIN_TEE && styles.pluginCardRequired,
                    formData.plugins.includes(id as PluginId) && styles.pluginCardSelected,
                  ]}
                  onPress={() => togglePlugin(id as PluginId)}>
                  <View style={styles.pluginIcon}>
                    {plugin.category === 'security' ? (
                      <Shield size={24} color="#7C3AED" />
                    ) : plugin.category === 'ai' ? (
                      <Bot size={24} color="#7C3AED" />
                    ) : (
                      <Blockchain size={24} color="#7C3AED" />
                    )}
                  </View>
                  <View style={styles.pluginInfo}>
                    <View style={styles.pluginNameContainer}>
                      <Text style={styles.pluginName}>{plugin.name}</Text>
                      {id === PluginId.MARLIN_TEE && (
                        <Text style={styles.requiredBadge}>Required</Text>
                      )}
                    </View>
                    <Text style={styles.pluginDescription}>{plugin.description}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Agent'}
            </Text>
          </Pressable>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontFamily: 'LexendBold',
    fontSize: 24,
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  form: {
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldTitle: {
    fontFamily: 'LexendSemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeGrid: {
    gap: 12,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 16,
  },
  typeCardSelected: {
    backgroundColor: '#F3E8FF',
    borderColor: '#7C3AED',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontFamily: 'LexendSemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  typeDescription: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
  },
  arrayItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  arrayInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#111827',
  },
  removeButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  addButtonText: {
    fontFamily: 'LexendSemiBold',
    fontSize: 14,
    color: '#7C3AED',
  },
  pluginsGrid: {
    gap: 12,
  },
  pluginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 16,
  },
  pluginCardSelected: {
    backgroundColor: '#F3E8FF',
    borderColor: '#7C3AED',
  },
  pluginIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pluginInfo: {
    flex: 1,
  },
  pluginName: {
    fontFamily: 'LexendSemiBold',
    fontSize: 16,
    color: '#111827',
  },
  pluginDescription: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: 'LexendSemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  error: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  pluginNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  requiredBadge: {
    fontFamily: 'LexendMedium',
    fontSize: 12,
    color: '#7C3AED',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  pluginCardRequired: {
    borderColor: '#7C3AED',
    borderWidth: 2,
  },
  avatarContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: 'LexendMedium',
    fontSize: 14,
    marginTop: 8,
  },
});
import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot } from 'lucide-react-native';
import { useAgents } from '@/hooks/useAgents';
import { useAuth } from '@/hooks/useAuth';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import sendMessage from '../../lib/message';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Update the Message type to include the optional action property
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: string;
};


export default function ChatScreen() {
  const { agents } = useAgents();
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const sendButtonScale = useSharedValue(1);

  const activeAgents = agents.filter(agent => agent.is_active);

  const handleSend = async () => {
    if (!input.trim() || !selectedAgent || !user) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
  
    try {
      // Apply animation to send button
      sendButtonScale.value = withSequence(
        withSpring(0.8, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
  
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('userName', user.email ?? '');
      formData.append('name', activeAgents.find(a => a.id === selectedAgent)?.name ?? '');
      formData.append('text', userMessage.content);
      formData.append('agentId', selectedAgent);
  
      const response = await sendMessage(formData);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Error sending message');
      }
  
      // Create assistant message with the text from the response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'I apologize, but I was unable to process your request.',
        timestamp: new Date(),
        action: data.action || 'NONE', // Add action to the message type
      };
  
      setMessages(prev => [...prev, assistantMessage]);
      
      // Handle special actions if needed
      if (data.action && data.action !== 'NONE') {
        handleAgentAction(data.action, data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I encountered an error processing your message: ${errorMessage}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      // Ensure scroll to bottom works properly with a slight delay
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  

const handleAgentAction = (action: string, data: any) => {
  // Handle different action types if needed
  switch (action) {
    case 'THINKING':
      // Maybe show a special thinking indicator
      console.log('Agent is thinking deeply...');
      break;
    case 'CONFUSED':
      // Maybe show a confused animation
      console.log('Agent is confused...');
      break;
    // Add more action handlers as needed
    default:
      // No special handling for unknown actions
      break;
  }
};

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    setMessages([]);
  };

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.role === 'user' ? styles.userMessage : styles.assistantMessage
    ]}>
      {item.role === 'assistant' && selectedAgent && (
        <Image
          source={{ 
            uri: activeAgents.find(a => a.id === selectedAgent)?.avatar_url || 
            'https://images.unsplash.com/photo-1675426513962-63c6022a8626?w=400&auto=format&fit=crop&q=80'
          }}
          style={styles.messageAvatar}
        />
      )}
      <View style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.role === 'user' ? styles.userText : styles.assistantText
        ]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  ), [selectedAgent, activeAgents]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <Text style={styles.subtitle}>Talk with your AI agents</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.agentsScroll}
        contentContainerStyle={styles.agentsContainer}>
        {activeAgents.map((agent) => (
          <Pressable
            key={agent.id}
            style={[
              styles.agentCard,
              selectedAgent === agent.id && styles.selectedAgent
            ]}
            onPress={() => handleAgentSelect(agent.id)}>
            <Image
              source={{ 
                uri: agent.avatar_url || 
                'https://images.unsplash.com/photo-1675426513962-63c6022a8626?w=400&auto=format&fit=crop&q=80'
              }}
              style={styles.agentAvatar}
            />
            <Text style={[
              styles.agentName,
              selectedAgent === agent.id && styles.selectedAgentText
            ]}>
              {agent.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
          {selectedAgent ? (
            messages.length > 0 ? (
              messages.map(message => renderMessage({ item: message }))
            ) : (
              <View style={styles.emptyContainer}>
                <Bot size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>Start a conversation</Text>
              </View>
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Bot size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>Select an agent to start chatting</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={1000}
            editable={!!selectedAgent && !loading}
          />
          <AnimatedPressable
            style={[
              styles.sendButton,
              (!input.trim() || !selectedAgent || loading) && styles.sendButtonDisabled,
              useAnimatedStyle(() => ({
                transform: [{ scale: sendButtonScale.value }]
              }))
            ]}
            onPress={handleSend}
            disabled={!input.trim() || !selectedAgent || loading}>
            <Send size={20} color="#FFFFFF" />
          </AnimatedPressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  agentsScroll: {
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  agentsContainer: {
    padding: 16,
    gap: 16,
  },
  agentCard: {
    alignItems: 'center',
    gap: 8,
    opacity: 0.7,
  },
  selectedAgent: {
    opacity: 1,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  agentName: {
    fontFamily: 'LexendMedium',
    fontSize: 14,
    color: '#6B7280',
  },
  selectedAgentText: {
    color: '#7C3AED',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: '#7C3AED',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    marginBottom: 4,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#111827',
  },
  timestamp: {
    fontFamily: 'Lexend',
    fontSize: 12,
    color: '#9CA3AF',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#111827',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  emptyText: {
    fontFamily: 'LexendMedium',
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
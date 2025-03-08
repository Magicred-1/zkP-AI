import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowRight, Apple, Twitter } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMagicLink = async () => {
    try {
      setError('');
      setLoading(true);

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signInError) throw signInError;

      alert('Check your email for the login link!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'twitter') => {
    try {
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&auto=format&fit=crop&q=80' }}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to zkP-AI</Text>
          <Text style={styles.subtitle}>Sign in to continue building secure AI agents</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Pressable 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleMagicLink}
            disabled={loading}>
            <Text style={styles.buttonText}>Continue with Email</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <Pressable 
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}>
              <Image 
                source={{ uri: 'https://www.google.com/favicon.ico' }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>

            <Pressable 
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}>
              <Apple size={24} color="#000000" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </Pressable>

            <Pressable 
              style={styles.socialButton}
              onPress={() => handleSocialLogin('twitter')}>
              <Twitter size={24} color="#1DA1F2" />
              <Text style={styles.socialButtonText}>Twitter</Text>
            </Pressable>
          </View>
        </View>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1676299081847-5c7fe2a16d3f?w=800&auto=format&fit=crop&q=80' }}
          style={styles.backgroundImage}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'LexendBold',
    fontSize: 32,
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#111827',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    height: 48,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'LexendSemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  socialButtonText: {
    fontFamily: 'LexendMedium',
    fontSize: 14,
    color: '#111827',
  },
  error: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.1,
  },
});
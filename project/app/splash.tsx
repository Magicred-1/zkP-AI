import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1, { damping: 15 }),
      withDelay(1000, withSpring(0.8, { damping: 15 }))
    );
    opacity.value = withSequence(
      withSpring(1),
      withDelay(1000, withSpring(0, { damping: 15 }))
    );

    const timeout = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={['#7C3AED', '#4F46E5']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&auto=format&fit=crop&q=80' }}
          style={styles.logo}
        />
        <Text style={styles.title}>zkP-AI</Text>
        <Text style={styles.subtitle}>Secure AI Agent Builder</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'LexendBold',
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: 24,
  },
  subtitle: {
    fontFamily: 'LexendLight',
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 8,
  },
});
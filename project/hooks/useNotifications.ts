import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const { user } = useAuth();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        // Handle received notification
        console.log('Notification received:', notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        // Handle notification response (e.g., when user taps notification)
        console.log('Notification response:', response);
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      // Subscribe to realtime notifications for new messages
      const subscription = supabase
        .channel('agent_interactions')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'agent_interactions',
            filter: `user_id=eq.${user.id}`,
          },
          async payload => {
            const { new: newMessage } = payload;
            
            // Get agent details
            const { data: agent } = await supabase
              .from('agents')
              .select('name, avatar_url')
              .eq('id', newMessage.agent_id)
              .single();

            if (agent) {
              await schedulePushNotification({
                title: `New message from ${agent.name}`,
                body: newMessage.output,
                data: {
                  agentId: newMessage.agent_id,
                  messageId: newMessage.id,
                },
              });
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return null;
}

async function schedulePushNotification({
  title,
  body,
  data,
}: {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}) {
  if (Platform.OS === 'web') {
    // Web notifications are not supported in this version
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Immediately show notification
  });
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'web') {
    // Web push notifications are not supported in this version
    return;
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      
      // Here you would typically send this token to your backend
      console.log('Push token:', token);
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }
}
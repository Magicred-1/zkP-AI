import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { profile, signOut, loading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your account</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={[styles.profileImage, loading && styles.loading]}>
            {profile?.avatar_url ? (
              <Image 
                source={{ uri: profile.avatar_url }} 
                style={styles.avatarImage}
              />
            ) : (
              <User size={32} color="#7C3AED" />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {loading ? 'Loading...' : profile?.name || 'Anonymous User'}
            </Text>
            <Text style={styles.profileEmail}>
              {loading ? 'Loading...' : profile?.email || 'No email set'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingValue}>Coming soon</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Pressable 
            style={[styles.menuItem, styles.logoutButton]}
            onPress={signOut}
          >
            <LogOut size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  loading: {
    opacity: 0.5,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'LexendSemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
  },
  settingLabel: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#111827',
  },
  settingValue: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#6B7280',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#DC2626',
    marginLeft: 12,
  },
});
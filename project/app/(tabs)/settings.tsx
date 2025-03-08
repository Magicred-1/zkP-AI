import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { profile, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your preferences</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <User size={32} color="#7C3AED" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name || 'Anonymous User'}</Text>
            <Text style={styles.profileEmail}>{profile?.email || 'No email set'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {preferences.map((pref, index) => (
            <View key={index} style={styles.settingItem}>
              <Text style={styles.settingLabel}>{pref.label}</Text>
              <Switch
                value={pref.value}
                onValueChange={() => {}}
                trackColor={{ false: '#D1D5DB', true: '#7C3AED' }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {notifications.map((notif, index) => (
            <View key={index} style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Bell size={20} color="#6B7280" />
                <Text style={styles.settingLabel}>{notif.label}</Text>
              </View>
              <Switch
                value={notif.value}
                onValueChange={() => {}}
                trackColor={{ false: '#D1D5DB', true: '#7C3AED' }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <Pressable style={styles.menuItem}>
            <Shield size={20} color="#6B7280" />
            <Text style={styles.menuText}>Privacy & Security</Text>
          </Pressable>
          <Pressable style={styles.menuItem}>
            <HelpCircle size={20} color="#6B7280" />
            <Text style={styles.menuText}>Help & Support</Text>
          </Pressable>
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

const preferences = [
  { label: 'Dark Mode', value: false },
  { label: 'Auto-update Agents', value: true },
  { label: 'Analytics Sharing', value: true },
];

const notifications = [
  { label: 'Agent Status Updates', value: true },
  { label: 'Performance Reports', value: true },
  { label: 'New Features', value: false },
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
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
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
  menuText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
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
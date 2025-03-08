import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, Download } from 'lucide-react-native';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover and use pre-built AI agents</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <Text style={styles.searchPlaceholder}>Search agents...</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Agents</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {featuredAgents.map((agent, index) => (
              <Pressable key={index} style={styles.featuredCard}>
                <Image source={{ uri: agent.image }} style={styles.featuredImage} />
                <View style={styles.featuredContent}>
                  <View style={styles.featuredHeader}>
                    <Text style={styles.featuredTitle}>{agent.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingText}>{agent.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.featuredDescription}>{agent.description}</Text>
                  <View style={styles.statsRow}>
                    <Text style={styles.statsText}>{agent.downloads} downloads</Text>
                    <Download size={16} color="#6B7280" />
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Pressable key={index} style={styles.categoryCard}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} agents</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const featuredAgents = [
  {
    name: 'SmartAssistant Pro',
    description: 'Advanced customer service AI with natural language processing',
    rating: 4.8,
    downloads: '2.5k',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'DataMaster AI',
    description: 'Powerful data analysis and visualization agent',
    rating: 4.6,
    downloads: '1.8k',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'ContentGenius',
    description: 'AI-powered content creation and optimization',
    rating: 4.7,
    downloads: '3.2k',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80',
  },
];

const categories = [
  { name: 'Customer Service', count: 45 },
  { name: 'Data Analysis', count: 32 },
  { name: 'Content Creation', count: 28 },
  { name: 'Task Automation', count: 24 },
  { name: 'Research', count: 19 },
  { name: 'Education', count: 15 },
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchPlaceholder: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: '#6B7280',
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
  featuredScroll: {
    paddingLeft: 24,
  },
  featuredCard: {
    width: 300,
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
  featuredImage: {
    width: '100%',
    height: 160,
  },
  featuredContent: {
    padding: 16,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredTitle: {
    fontFamily: 'LexendSemiBold',
    fontSize: 18,
    color: '#111827',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'LexendSemiBold',
    fontSize: 14,
    color: '#111827',
    marginLeft: 4,
  },
  featuredDescription: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsText: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryTitle: {
    fontFamily: 'LexendSemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  categoryCount: {
    fontFamily: 'Lexend',
    fontSize: 14,
    color: '#6B7280',
  },
});
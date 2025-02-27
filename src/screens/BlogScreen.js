import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 40 - CARD_MARGIN * 2) / 2;

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error('Invalid Date');
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (error) {
    console.error('Date parsing error:', error, dateString);
    return 'Invalid Date';
  }
};

const categories = ['All Blogs', 'Gold', 'Diamond', 'Earrings', 'Rings', 'Trending'];

const BlogScreen = () => {
  const [allBlogs, setAllBlogs] = useState([]); // Store all blogs
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Blogs');
  const [noBlogsAvailable, setNoBlogsAvailable] = useState(false);
  const navigation = useNavigation();

  const filterItems = useCallback((query, category) => {
    // Start with all blogs
    let filtered = [...allBlogs];

    // Apply category filter
    if (category !== 'All Blogs') {
      filtered = filtered.filter((item) =>
        item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply search query filter
    if (query) {
      filtered = filtered.filter((item) =>
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.content?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setNoBlogsAvailable(filtered.length === 0);
    setFilteredItems(filtered);
  }, [allBlogs]);

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    filterItems(text, selectedCategory);
  }, [selectedCategory, filterItems]);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    filterItems(searchQuery, category);
  }, [searchQuery, filterItems]);

  const FeaturedBlog = ({ item }) => (
    <TouchableOpacity
      key={item.blog_id}
      style={styles.featuredCard}
      onPress={() => navigation.navigate('Blog Details', { blog: item })}
    >
      <Image source={{ uri: item.image_urls[0] }} style={styles.featuredImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.featuredOverlay}
      >
        <View style={styles.featuredContent}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryPill}>
              {/* <Text style={styles.categoryText}>{item.category}</Text> */}
            </View>
          </View>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.featuredDescription} numberOfLines={2}>
            {item.content}
          </Text>
          <View style={styles.authorContainer}>
            <View style={styles.authorInfo}>
              <Icon name="person-circle-outline" size={20} color="#fff" />
              <Text style={styles.authorText}>{item.created_by || "oz team"}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Icon name="calendar-outline" size={16} color="#fff" />
              <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const BlogCard = ({ item }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => navigation.navigate('Blog Details', { blog: item })}
    >
      {item.image_urls ? (
        <Image source={{ uri: item.image_urls[0] }} style={styles.cardImage} />
      ) : ''}

      {/* <Image source={{ uri: item.image_url }} style={styles.cardImage} /> */}
      <View style={styles.cardContent}>
        <View style={styles.smallCategoryPill}>
          <Text style={styles.smallCategoryText}>{item.category}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getAllBlogs();
        setAllBlogs(res); // Store all blogs
        setFilteredItems(res); // Initially show all blogs
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setNoBlogsAvailable(true);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#026456" />
      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blogs</Text>
      </View>



      {/* Search Area */}
      <View style={styles.searchArea}>
        <View style={styles.searchBarContainer}>
          <Icon name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchBar}
            placeholder="Search articles..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <Icon name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {noBlogsAvailable ? (
        <View style={styles.emptyState}>
          <Icon name="document-text-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No articles found</Text>
          <Text style={styles.emptyStateSubtext}>Try adjusting your search or category</Text>
        </View>
      ) : (
        <>
          {/* Featured Blog */}
          {filteredItems[0] && <FeaturedBlog item={filteredItems[0]} />}

          {/* Blog Grid */}
          <View style={styles.gridContainer}>
            {filteredItems.slice(1).map((item) => (
              <BlogCard key={item.id} item={item} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#026456',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 20,
  },
  searchArea: {
    paddingHorizontal: 16,
    marginBottom: 10
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchBar: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingTop: 2,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryButton: {
    backgroundColor: '#026456',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#026456',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  featuredCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 300,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  // categoryPill: {
  //   backgroundColor: '#026456',
  //   paddingHorizontal: 12,
  //   paddingVertical: 6,
  //   borderRadius: 16,
  //   marginBottom: 4,
  // },
  // categoryText: {
  //   color: '#fff',
  //   fontSize: 12,
  //   fontWeight: '600',
  //   textTransform: 'uppercase',
  // },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    lineHeight: 20,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  blogCard: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 12,
  },
  smallCategoryPill: {
    backgroundColor: '#f0f7f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  smallCategoryText: {
    color: '#026456',
    fontSize: 10,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default BlogScreen;

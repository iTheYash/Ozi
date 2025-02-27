import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import api from '../services/api';

const { width } = Dimensions.get('window');
const CARD_PADDING = 8;
const IMAGE_SIZE = 100;

const HistoryScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const PREVIOUS_POSTS_KEY = 'previousPosts';

  const configurePushNotifications = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        notification.finish(PushNotification.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: "upload-notifications",
          channelName: "Upload Notifications",
          channelDescription: "Notifications for product upload status",
          playSound: true,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );
    }
  };

  const showNotification = (title, message) => {
    PushNotification.localNotification({
      channelId: "upload-notifications",
      title: title,
      message: message,
      playSound: true,
      soundName: "default",
      importance: "high",
      priority: "high",
      vibrate: true,
      userInfo: { screen: 'HistoryScreen' },
      visibility: "public",
      autoCancel: true,
    });
  };

  const getPreviousPosts = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem(PREVIOUS_POSTS_KEY);
      return savedPosts ? JSON.parse(savedPosts) : [];
    } catch (error) {
      console.error('Error getting previous posts:', error);
      return [];
    }
  };

  const savePreviousPosts = async (posts) => {
    try {
      await AsyncStorage.setItem(PREVIOUS_POSTS_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving previous posts:', error);
    }
  };

  const checkForApprovedPosts = async (newPosts) => {
    const previousPosts = await getPreviousPosts();

    newPosts.forEach((post) => {
      const previousPost = previousPosts.find(p => p.post_id === post.post_id);
      if (previousPost && previousPost.status !== 'Approved' && post.status === 'Approved') {
        showNotification(
          "Post Approved! 🎉",
          `Your post "${post.title}" has been approved and is now live.`
        );
      }
    });

    await savePreviousPosts(newPosts);
  };

  const fetchPosts = async () => {
    try {
      const phone = await AsyncStorage.getItem('contactno');
      if (!phone) {
        setError('User contact not found');
        setLoading(false);
        return;
      }

      const postsData = await api.getListingData(phone);
      const sortedPosts = postsData.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );

      await checkForApprovedPosts(sortedPosts);

      setPosts(sortedPosts);
      applyFilter(activeFilter, sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const applyFilter = (filter, postsList = posts) => {
    setActiveFilter(filter);
    switch (filter) {
      case 'approved':
        setFilteredPosts(postsList.filter(post => post.status === 'Approved'));
        break;
      case 'pending':
        setFilteredPosts(postsList.filter(post => post.status === 'Active'));
        break;
      default:
        setFilteredPosts(postsList);
    }
  };

  useEffect(() => {
    configurePushNotifications();
    fetchPosts();

    const refreshInterval = setInterval(fetchPosts, 5 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts().finally(() => setRefreshing(false));
  }, []);


  const FilterButton = ({ title, filter }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => applyFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        activeFilter === filter && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusStyle = (status) => ({
    backgroundColor: status === 'Approved' ? '#E8F5E9' : '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  });

  const getStatusTextStyle = (status) => ({
    color: status === 'Approved' ? '#2E7D32' : '#EF6C00',
    fontSize: 12,
    fontWeight: '600',
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_urls[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}%</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title || 'No Title'}
            </Text>
            <View style={getStatusStyle(item.status)}>
              <Text style={getStatusTextStyle(item.status)}>
                {item.status === 'Active' ? 'Pending Approval' : 'Approved'}
              </Text>
            </View>
          </View>

          <Text style={styles.date}>
            {formatDate(item.created_at)}
          </Text>

          <View style={styles.priceRow}>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{item.category || 'N/A'}</Text>
            </View>
            <Text style={styles.price}>
              ₹{parseFloat(item.price || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.weightRow}>
            <Text style={styles.weightText}>
              Gross: {item.gross_weight ? `${item.gross_weight}g` : 'N/A'}
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.weightText}>
              Net: {item.net_weight ? `${item.net_weight}g` : 'N/A'}
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.purityText}>
              Purity: {item.purity || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#026456" />
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Home')}
          >
            <AntDesign name="left" size={24} color="#026456" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listing</Text>
        </View>

        <View style={styles.filterContainer}>
          <FilterButton title="All" filter="all" />
          <FilterButton title="Approved" filter="approved" />
          <FilterButton title="Pending" filter="pending" />
        </View>
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noPostsText}>No posts available</Text>
          <Text style={styles.subText}>Check back later for updates!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.post_id || index}`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#026456']}
              tintrefreColor="#026456"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F0EC',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#026456',
  },
  menuButton: {
    padding: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    padding: CARD_PADDING,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 6,
    backgroundColor: '#F4F0EC',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DCA818',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#026456',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryContainer: {
    backgroundColor: '#F4F0EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  category: {
    fontSize: 12,
    color: '#666666',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#026456',
  },
  bottomSection: {
    backgroundColor: '#F4F0EC',
    padding: 6,
    borderRadius: 4,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  weightText: {
    fontSize: 12,
    color: '#666666',
  },
  separator: {
    marginHorizontal: 8,
    color: '#CCCCCC',
    fontSize: 12,
  },
  purityContainer: {
    marginTop: 2,
  },
  purityText: {
    fontSize: 12,
    color: '#666666',
  },
  noPostsText: {
    fontSize: 18,
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#777',
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4F0EC',
  },
  filterButtonActive: {
    backgroundColor: '#026456',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  date: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },

});

export default HistoryScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const WishlistScreen = ({ navigation }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user_id = await AsyncStorage.getItem('contactno');
      if (!user_id) {
        setError('Please login to view your wishlist');
        return;
      }

      const response = await api.getWishlist(user_id);
      setWishlist(response.wishlist);
    } catch (error) {
      setError(error.message || 'Failed to load wishlist');
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
    const unsubscribe = navigation.addListener('focus', loadWishlist);
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#026456" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={24} color="#026456" />
          </TouchableOpacity>
          <Text style={styles.title}>Wishlist</Text>
        </View>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.listContainer}>
            {wishlist.map((item) => (
              <TouchableOpacity
                key={item.post_id}
                style={styles.item}
                onPress={() => navigation.navigate('ProductDetails', { item })}
              >
                <Image
                  source={{ uri: item.image_urls[0] }}
                  style={styles.img}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemText}>{item.title}</Text>
                  <Text style={styles.subText}>Weight | {item.net_weight}g</Text>
                  <Text style={styles.subText}>Carat | {item.purity}K</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// In your JSX, keep the same structure but update the styles:
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
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#026456'
  },
  menuButton: {
      padding: 4,
  },
  listContainer: {
      padding: 12,
  },
  item: {
      flexDirection: 'row',
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      marginBottom: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: '#F4F0EC',
      // Subtle shadow for depth
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
  },
  img: {
      width: 110,
      height: 110,
      borderRadius: 6,
      resizeMode: 'cover',
      backgroundColor: '#F4F0EC', // placeholder background
  },
  itemDetails: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'space-between',
      paddingVertical: 4,
  },
  itemText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#026456',
      marginBottom: 6,
  },
  subText: {
      fontSize: 13,
      color: '#666',
      marginBottom: 4,
      letterSpacing: 0.3,
  },
  price: {
      fontSize: 18,
      color: '#DCA818',
      fontWeight: '700',
      marginTop: 6,
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
  },
  emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
  },
  centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
  },
  errorText: {
      fontSize: 16,
      color: '#026456',
      textAlign: 'center',
  }
});
export default WishlistScreen;

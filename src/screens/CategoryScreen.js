import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Share
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const { width } = Dimensions.get('window');

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts(category);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    loadWishlist();
  }, [category]);

  const toggleWishlist = async (product) => {
    try {
      let newWishlist;
      if (wishlist.some(item => item.id === product.id)) {
        newWishlist = wishlist.filter(item => item.id !== product.id);
      } else {
        newWishlist = [...wishlist, product];
      }
      setWishlist(newWishlist);
      await AsyncStorage.setItem('wishlist', JSON.stringify(newWishlist));
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleShare = async (product) => {
    try {
      const productLink = `https://8bbb-2401-4900-1c96-6b08-fc3a-78a6-5a37-41e1.ngrok-free.app/product/${product.id}`;
      
      // Create a preview message with product details
      const shareMessage = {
        message: `${product.name}\n\nBuy ${product.name} online at best price with great offers only at Our Store!\n\n${productLink}`,
        title: product.name,
        // You can also add a URL if your app supports deep linking
        url: productLink,
      };

      // For iOS, you might want to specify the activity type
      const shareOptions = {
        ...shareMessage,
        dialogTitle: 'Share this product', // Android only
        subject: `Check out ${product.name}`, // Subject for email sharing
        type: 'text/plain',
      };
      
      await Share.share(shareOptions, {
        // iOS specific options
        excludedActivityTypes: [], // You can exclude specific share types if needed
        tintColor: '#007AFF',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderProductItem = ({ item }) => {
    const isWishlisted = wishlist.some(product => product.id === item.id);

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare(item)}
            >
              <Icon name="share-social-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            <TouchableOpacity
              onPress={() => toggleWishlist(item)}
              style={styles.wishlistButton}
            >
              <Icon
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={24}
                color={isWishlisted ? '#FF4444' : '#666'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
            <Icon name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>{category}</Text>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 12,
    paddingRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 4,
  },
  price: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    flex: 1,
  },
  wishlistButton: {
    padding: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  shareButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default CategoryScreen;
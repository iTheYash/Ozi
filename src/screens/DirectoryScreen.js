import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../services/api';
 
const { width } = Dimensions.get('window');
 
const DirectoryScreen = ({ navigation }) => {
  const [directories, setDirectories] = useState([]);
  const [filteredDirectories, setFilteredDirectories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
 
  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const data = await api.getDirectories();
        setDirectories(data);
        setFilteredDirectories(data);
      } catch (error) {
        console.error('Error fetching directory data:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchDirectories();
  }, []);
 
  useEffect(() => {
    const filtered = directories.filter(directory => 
      directory.aboutus.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDirectories(filtered);
  }, [searchQuery, directories]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: fullStars }).map((_, index) => (
          <AntDesign key={`full-${index}`} name="star" size={14} color="#DCA818" />
        ))}
        {halfStar && (
          <AntDesign name="staro" size={14} color="#DCA818" style={{ marginLeft: -2 }} />
        )}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <AntDesign key={`empty-${index}`} name="staro" size={14} color="#F4F0EC" />
        ))}
      </View>
    );
  };
 
  const renderDirectoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.directoryContainer}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('DirectoryDetails', { advertisement: item })}
    >
      {item.logo ? (
        <Image
          source={{ uri: item.logo }}
          style={styles.directoryImage}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.directoryImage, styles.noImage]}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <View style={styles.directoryDetails}>
        <Text style={styles.directoryDescription} numberOfLines={2}>
          {item.aboutus}
        </Text>
        {renderStars(parseFloat(item.ratings))}
      </View>
    </TouchableOpacity>
  );
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="#026456" />
        </TouchableOpacity>
        <Text style={styles.title}>Directory</Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color="#026456" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search directories..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AntDesign name="close" size={20} color="#026456" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#026456" />
        </View>
      ) : (
        <FlatList
          data={filteredDirectories}
          renderItem={renderDirectoryItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery.length > 0 ? 'No matching results' : 'No directories found'}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#026456',
    marginLeft: 12,
  },
  menuButton: {
    padding: 4,
  },
  searchWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F0EC',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#F4F0EC',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  directoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  directoryImage: {
    width: 80,
    height: 80,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 12,
  },
  directoryDetails: {
    flex: 1,
  },
  directoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  directoryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  directoryRating: {
    fontSize: 14,
    color: '#026456',
    marginTop: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});
 
export default DirectoryScreen;
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons'; // Use Ionicons
 
const DigitalExhibitionScreen = () => {
  const [jewelryItems, setJewelryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Blogs');
 
  useEffect(() => {
    const fetchJewelryData = async () => {
      try {
        const response = await axios.get('https://d378-2401-4900-1c94-6621-d4c-d992-836a-15f6.ngrok-free.app/api/jewelry');
        setJewelryItems(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        console.error('Error fetching jewelry data:', error);
      }
    };
 
    fetchJewelryData();
  }, []);
 
  const handleSearch = (text) => {
    setSearchQuery(text);
    filterItems(text, selectedCategory);
  };
 
  const filterItems = (query, category) => {
    let filtered = jewelryItems;
 
    if (category !== 'All Blogs') {
      filtered = filtered.filter((item) => item.category === category.toLowerCase());
    }
 
    if (query) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }
 
    setFilteredItems(filtered);
  };
 
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterItems(searchQuery, category);
  };
 
  const renderJewelryItem = ({ item, index }) => {
    const MAX_DESCRIPTION_LENGTH = 100;
    const isExpanded = expandedIndex === index;
 
    return (
      <View style={styles.card}>
        <View style={styles.imageTitleContainer}>
          <Image source={{ uri: item.image }} style={styles.circleImage} />
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.title1} numberOfLines={2}>{item.title}</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>Daily Wear Jewellery</Text>
            <Text style={styles.tag}>Trending</Text>
          </View>
          <Text style={styles.description}>
            {isExpanded ? item.description : `${item.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
          </Text>
          <TouchableOpacity onPress={() => setExpandedIndex(isExpanded ? null : index)}>
            <Text style={styles.readMore}>
              {isExpanded ? 'Show Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.date}>{item.created_date}</Text>
        </View>
      </View>
    );
  };
 
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by title..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Icon name="search-outline" size={24} color="#999" style={styles.searchIcon} />
      </View>
 
      {/* Menu */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menu}>
        {['All Blogs', 'Gold', 'Diamond', 'Earrings', 'Rings', 'Trending'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                styles.menuText,
                selectedCategory === category && styles.selectedMenuText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
 
      {/* List of Jewelry Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderJewelryItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFFF',
    padding: 15,
  },
  searchBarContainer: {
    flexDirection: 'row',  // Align input and icon in a row
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginLeft: 10,  // Space between input and icon
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  menu: {
    marginBottom: 20,
  },
  menuText: {
    fontSize: 20,
    color: '#821131',
    marginRight: 20,
  },
  selectedMenuText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageTitleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FADCD9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  circleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'italic',
    color: '#4A4A4A',
  },
  descriptionContainer: {
    paddingTop: 5,
    paddingBottom: 10,
  },
  title1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#fff',
    color: '#821131',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#821131',
  },
  description: {
    fontSize: 18,
    color: '#4A4A4A',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  readMore: {
    fontSize: 15,
    color: '#821131',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#9E9E9E',
  },
});
 
export default DigitalExhibitionScreen;
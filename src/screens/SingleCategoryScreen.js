import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AllPostsScreen from './AllPostsScreen';
import api from '../services/api';

const SingleCategoryScreen = ({ route }) => {
    const { category } = route.params;
    const navigation = useNavigation();
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [categoryPosts, setCategoryPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [activeFilters, setActiveFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [activeSort, setActiveSort] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const category_ = category.slice(0, -1);

    const fetchCategoryPosts = async () => {
        setLoading(true);
        try {
            const posts = await api.getPostsByCategory(category_);
            setCategoryPosts(posts);
            setFilteredPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryPosts();
    }, [category_]);

    // New function to handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        let results = [...categoryPosts];

        // Apply search filter
        if (query.trim()) {
            results = results.filter(post => 
                post.product_code?.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Apply existing filters if any
        if (activeFilters) {
            if (activeFilters.priceRanges.length > 0) {
                results = results.filter(post => {
                    const price = parseFloat(post.price.replace(/[₹,]/g, ''));
                    return activeFilters.priceRanges.some(range => {
                        const [min, max] = range.split('-').map(Number);
                        return price >= min && price <= max;
                    });
                });
            }

            if (activeFilters.weightRanges.length > 0) {
                results = results.filter(post => {
                    const weight = parseFloat(post.net_weight);
                    return activeFilters.weightRanges.some(range => {
                        if (range === 'above 25 grams') return weight > 25;
                        const [minStr, maxStr] = range.split(' - ');
                        const min = parseFloat(minStr.split(' ')[0]);
                        const max = parseFloat(maxStr.split(' ')[0]);
                        return weight >= min && weight <= max;
                    });
                });
            }

            if (activeFilters.purities.length > 0) {
                results = results.filter(post => {
                    const postPurity = post.purity;
                    return activeFilters.purities.some(purity => 
                        postPurity === purity.slice(0, -1)
                    );
                });
            }
        }

        // Apply existing sort if any
        if (activeSort) {
            const parsePrice = (price) => parseFloat(price.replace(/[₹,]/g, ''));
            if (activeSort === 'high-to-low') {
                results.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
            } else if (activeSort === 'low-to-high') {
                results.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
            }
        }

        setFilteredPosts(results);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchCategoryPosts();
            // Reset all filters, sort, and search when refreshing
            setActiveFilters(null);
            setActiveSort(null);
            setSearchQuery('');
        } finally {
            setRefreshing(false);
        }
    };

    // Modified handleSort to maintain search results
    const handleSort = (type) => {
        const sortedItems = [...filteredPosts];
        const parsePrice = (price) => parseFloat(price.replace(/[₹,]/g, ''));

        if (type === 'high-to-low') {
            sortedItems.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        } else if (type === 'low-to-high') {
            sortedItems.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        }

        setActiveSort(type);
        setFilteredPosts(sortedItems);
        setSortModalVisible(false);
    };

    // Modified handleApplyFilters to maintain search results
    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        // Re-apply search with new filters
        handleSearch(searchQuery);
    };

    const SortModal = () => (
        <Modal
            visible={sortModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setSortModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Sort By</Text>
                        <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                            <AntDesign name="close" size={24} color="#026456" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sortOptions}>
                        <TouchableOpacity 
                            style={[
                                styles.sortOption,
                                activeSort === 'high-to-low' && styles.activeSortOption
                            ]}
                            onPress={() => handleSort('high-to-low')}
                        >
                            <Text style={[
                                styles.sortText,
                                activeSort === 'high-to-low' && styles.activeSortText
                            ]}>Price: High to Low</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.sortOption,
                                activeSort === 'low-to-high' && styles.activeSortOption
                            ]}
                            onPress={() => handleSort('low-to-high')}
                        >
                            <Text style={[
                                styles.sortText,
                                activeSort === 'low-to-high' && styles.activeSortText
                            ]}>Price: Low to High</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="left" size={24} color="#026456" />
                </TouchableOpacity>
                <Text style={styles.title}>{category}</Text>
            </View>

            {/* New Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by product code"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor="#999"
                />
                {searchQuery ? (
                    <TouchableOpacity 
                        style={styles.clearButton} 
                        onPress={() => handleSearch('')}
                    >
                        <AntDesign name="close" size={20} color="#666" />
                    </TouchableOpacity>
                ) : null}
            </View>

            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={[styles.filterButton, activeFilters && styles.activeFilterButton]}
                    onPress={() => navigation.navigate('filters', { onApplyFilters: handleApplyFilters })}
                >
                    <Icon name="filter-outline" size={20} color={activeFilters ? "#DCA818" : "#666"} />
                    <Text style={[styles.filterText, activeFilters && styles.activeFilterText]}>
                        Filters
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.filterButton, activeSort && styles.activeFilterButton]}
                    onPress={() => setSortModalVisible(true)}
                >
                    <MaterialCommunityIcons name="sort" size={20} color={activeSort ? "#DCA818" : "#666"} />
                    <Text style={[styles.filterText, activeSort && styles.activeFilterText]}>Sort</Text>
                </TouchableOpacity>

                <View style={styles.itemCount}>
                    <Text style={styles.itemCountText}>{filteredPosts.length} items</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#026456" />
                </View>
            ) : (
                <ScrollView 
                    style={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#026456"]}
                            tintColor="#026456"
                        />
                    }
                >
                    <AllPostsScreen categoryPosts={filteredPosts} />
                </ScrollView>
            )}

            <SortModal />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#026456',
        marginLeft: 16,
    },
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        marginRight: 12,
    },
    activeFilterButton: {
        backgroundColor: '#FFF8E7',
        borderWidth: 1,
        borderColor: '#DCA818',
    },
    filterText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    activeFilterText: {
        color: '#DCA818',
    },
    itemCount: {
        marginLeft: 'auto',
    },
    itemCountText: {
        fontSize: 14,
        color: '#666',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#026456',
    },
    sortOptions: {
        gap: 12,
    },
    sortOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    activeSortOption: {
        backgroundColor: '#FFF8E7',
        borderWidth: 1,
        borderColor: '#DCA818',
    },
    sortText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    activeSortText: {
        color: '#DCA818',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#FFFFFF',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#026456',
        padding: 0,
    },
    clearButton: {
        padding: 8,
    },
});

export default SingleCategoryScreen;
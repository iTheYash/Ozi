import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import api from '../services/api';

const { width } = Dimensions.get('window');

const StarRating = ({ rating, size = 30 }) => {
    return (
        <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Text
                    key={star}
                    style={[
                        styles.star,
                        { fontSize: size, color: star <= rating ? '#FFD700' : '#D3D3D3' }
                    ]}
                >
                    ★
                </Text>
            ))}
        </View>
    );
};

const RatingAndFeedbackScreen = ({ route, navigation }) => {
    const [products, setProducts] = useState([]);
    const [productRatings, setProductRatings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProductsAndRatings();
    }, []);

    const loadProductsAndRatings = async () => {
        try {
            setIsLoading(true);
            const productsData = await api.getProducts();

            // Fetch ratings for each product
            const ratingsPromises = productsData.map(product =>
                api.getProductRatings(product.id)
                    .then(ratings => ({
                        productId: product.id,
                        ratings: ratings
                    }))
                    .catch(error => ({
                        productId: product.id,
                        ratings: [],
                        error: error
                    }))
            );

            const ratingsResults = await Promise.all(ratingsPromises);

            // Create a map of product ID to ratings
            const ratingsMap = ratingsResults.reduce((acc, result) => {
                acc[result.productId] = result.ratings;
                return acc;
            }, {});

            // Calculate average ratings
            const productsWithRatings = productsData.map(product => ({
                ...product,
                ratings: ratingsMap[product.id] || [],
                averageRating: calculateAverageRating(ratingsMap[product.id] || [])
            }));

            setProducts(productsWithRatings);
            setProductRatings(ratingsMap);
        } catch (err) {
            console.error('Error loading products and ratings:', err);
            setError('Failed to load products and ratings');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        return sum / ratings.length;
    };


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ratings & Feedback</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {products.map((product) => (
                    <View key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                            <Image
                                source={{ uri: product.image }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productPrice}>₹{product.price.toLocaleString()}</Text>
                            </View>
                        </View>

                        <View style={styles.ratingSummary}>
                            <View style={styles.ratingInfo}>
                                <Text style={styles.ratingScore}>
                                    {product.averageRating?.toFixed(1) || 'No ratings'}
                                </Text>
                                <StarRating
                                    rating={Math.round(product.averageRating || 0)}
                                    size={20}
                                />
                                <Text style={styles.reviewCount}>
                                    ({product.ratings?.length || 0} reviews)
                                </Text>
                            </View>
                        </View>

                        {product.ratings && product.ratings.length > 0 ? (
                            <View style={styles.reviewsSection}>
                                {product.ratings.map((review, index) => (
                                    <View key={index} style={styles.reviewItem}>
                                        <View style={styles.reviewHeader}>
                                            <StarRating rating={review.rating} size={16} />
                                            <Text style={styles.reviewDate}>
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        {review.comment && (
                                            <Text style={styles.reviewText}>{review.comment}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noReviewsText}>No reviews yet</Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    scrollContainer: {
        padding: 16,
        gap: 20,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#007AFF',
    },
    ratingSummary: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    ratingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingScore: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    starContainer: {
        flexDirection: 'row',
    },
    star: {
        marginRight: 2,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    reviewsSection: {
        gap: 12,
    },
    reviewItem: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewDate: {
        color: '#666',
        fontSize: 12,
    },
    reviewText: {
        color: '#000',
        fontSize: 14,
        lineHeight: 20,
    },
    noReviewsText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    },
});

export default RatingAndFeedbackScreen;
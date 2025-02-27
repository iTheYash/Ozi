import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Linking,
    Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import { useAppContext } from '../AuthProvider/AuthProvider';
import Clipboard from '@react-native-clipboard/clipboard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLORS = {
    primary: '#026456',
    secondary: '#DCA818',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#4A5568',
    lightGray: '#F8F9FA',
    primaryLight: '#037a67',
    primaryTransparent: 'rgba(2, 100, 86, 0.1)',
};

const ProductDetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loginUser, setloginUser] = useState();

    const handleCopyProductCode = () => {
        Clipboard.setString(item.product_code);
        Toast.show({
            type: 'success',
            text1: 'Copied!',
            text2: 'Product code copied to clipboard',
            visibilityTime: 2000,
        });
    };


    const retrieveData = async () => {
        try {
            const loginUserr = await AsyncStorage.getItem('contactno');
            setloginUser(loginUserr);
        } catch (error) {
            console.log('error retrieving contact from async storage');
        }
    };

    useEffect(() => {
        retrieveData();
    }, []);

    const getPriceNumber = (priceStr) => parseInt(priceStr.replace('₹', '').replace(',', ''));
    const originalPriceNum = getPriceNumber(item.price);
    const discountPercentage = item.discount;
    const currentPriceNum = originalPriceNum - (originalPriceNum * (discountPercentage / 100));
    const roundedCurrentPrice = currentPriceNum.toFixed(0);

    const truncateCompanyName = (name) => {
        if (!name) return 'Loading...';
        const words = name.split(' ');
        if (words.length > 3) {
            return `${words.slice(0, 2).join(' ')}...`;
        }
        return name;
    };

    useEffect(() => {
        if (item?.post_id) {
            checkWishlistStatus(item.post_id);
        }
        if (item?.user_id) {
            getSellerDetails();
        }
    }, [item?.post_id, item?.user_id]);

    const getSellerDetails = async () => {
        try {
            const result = await api.getRegisteredUser(item.user_id);
            if (result && result.data) {
                setSellerDetails(result.data);
            }
        } catch (error) {
            console.error('Error fetching seller details:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch seller details',
                visibilityTime: 2000,
            });
        }
    };

    const handleCall = async () => {
        try {
            if (!sellerDetails?.s_contactno) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Seller contact not available',
                    visibilityTime: 2000,
                });
                return;
            }

            const phoneNumber = sellerDetails.s_contactno.replace(/[^\d+]/g, '');

            if (Platform.OS === 'android') {
                const url = `tel:${phoneNumber}`;
                await Linking.openURL(url);
            } else {
                const url = `telprompt:${phoneNumber}`;
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Phone dialer is not available on this device',
                        visibilityTime: 2000,
                    });
                }
            }
        } catch (error) {
            console.error('Error making phone call:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not open phone dialer',
                visibilityTime: 2000,
            });
        }
    };

    const checkWishlistStatus = async (post_id) => {
        try {
            const user_id = await AsyncStorage.getItem('contactno');
            const wishlistData = await api.getWishlist(user_id);
            const isInWishlist = wishlistData.wishlist.some(wishItem => wishItem.post_id === post_id);
            setIsFavorite(isInWishlist);
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const handleFavoriteToggle = async () => {
        try {
            setIsLoading(true);
            const user_id = await AsyncStorage.getItem('contactno');

            if (!user_id) {
                Toast.show({
                    type: 'error',
                    text1: 'Please login first',
                    text2: 'You need to be logged in to use the wishlist feature',
                    visibilityTime: 2000,
                });
                return;
            }

            if (isFavorite) {
                await api.removeFromWishlist(user_id, item.post_id);
                Toast.show({
                    type: 'error',
                    text1: 'Removed from Wishlist',
                    text2: 'You can always add it back later!',
                    visibilityTime: 2000,
                });
            } else {
                await api.addToWishlist(user_id, item.post_id);
                Toast.show({
                    type: 'success',
                    text1: 'Added to Wishlist',
                    text2: 'Check your wishlist to see saved items.',
                    visibilityTime: 2000,
                });
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Something went wrong',
                visibilityTime: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconButton}
                >
                    <Icon name="chevron-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleFavoriteToggle}
                    style={styles.iconButton}
                >
                    <Icon
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite ? COLORS.secondary : COLORS.primary}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.carouselContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(event) => {
                            const slide = Math.round(
                                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                            );
                            setSelectedImage(slide);
                        }}
                    >
                        {item.image_urls.map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: image }}
                                style={styles.productImage}
                            />
                        ))}
                    </ScrollView>
                    <View style={styles.paginationContainer}>
                        {item.image_urls.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    selectedImage === index && styles.paginationDotActive,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.infoCard}>


                    <View style={styles.sellerContainer}>
                        <View style={styles.sellerInfo}>
                            <Icon name="business-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.sellerName}>
                                {truncateCompanyName(sellerDetails?.s_company_name)}
                            </Text>
                        </View>
                        <View style={styles.verifiedBadge}>
                            <Icon name="checkmark-circle" size={16} color={COLORS.primary} />
                            <Text style={styles.verifiedText}>Verified Seller</Text>
                        </View>
                    </View>
                    <View style={styles.pc}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{item.category}</Text>

                        </View>
                        {/* Product Code Section */}
                        <View style={styles.productCodeContainer}>
                            <Icon name="barcode-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.productCodeLabel}>Product Code:</Text>
                            <Text style={styles.productCodeValue}>{item.product_code}</Text>
                            <TouchableOpacity
                                onPress={handleCopyProductCode}
                                style={styles.copyButton}
                            >
                                <Icon name="copy-outline" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.priceSection}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.currentPrice}>₹{roundedCurrentPrice}</Text>
                            <Text style={styles.originalPrice}>₹{item.price}</Text>
                        </View>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
                        </View>
                    </View>

                    <View style={styles.specificationContainer}>
                        <Text style={styles.sectionTitle}>Specifications</Text>
                        <View style={styles.specGrid}>
                            <View style={styles.specItem}>
                                <Icon name="scale-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.specLabel}>Weight</Text>
                                <Text style={styles.specValue}>{item.net_weight}g</Text>
                            </View>
                            <View style={styles.specItem}>
                                <Icon name="diamond-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.specLabel}>Purity</Text>
                                <Text style={styles.specValue}>{item.purity}K</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => {
                        if (sellerDetails?.s_contactno != loginUser) {
                            navigation.navigate('Chat', {
                                buyerIdd: loginUser,
                                productId: item.product_code,
                                sellerId: sellerDetails?.s_contactno,
                                sellerName: sellerDetails?.s_company_name,
                                productTitle: item.title,
                                conversationId: null,
                                image_url: item.image_url.split(',')[0],
                            });
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: 'Action Not Allowed',
                                text2: 'You cannot initiate a chat about your own jewelry product.',
                                visibilityTime: 2000,
                              });
                        }
                    }}
                >
                    <Icon name="chatbubble-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.callButtonText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => navigation.navigate('buynow', { item })}
                >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        padding: 16,
    },
    iconButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    carouselContainer: {
        position: 'relative',
    },
    productImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        resizeMode: 'cover',
    },
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: COLORS.secondary,
        width: 20,
    },
    infoCard: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        padding: 24,
        paddingBottom: 100,
    },
    categoryBadge: {
        backgroundColor: COLORS.primaryTransparent,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentPrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 16,
        color: COLORS.gray,
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: 'rgba(220, 168, 24, 0.1)', // Transparent secondary color
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    discountText: {
        color: COLORS.secondary,
        fontWeight: '600',
        fontSize: 14,
    },
    specificationContainer: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 16,
    },
    specGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    specItem: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 8,
        alignItems: 'center',
    },
    specLabel: {
        fontSize: 14,
        color: COLORS.gray,
        marginTop: 8,
    },
    specValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
        marginTop: 4,
    },
    bottomBar: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryTransparent,
        padding: 16,
        borderRadius: 12,
        marginRight: 12,
    },
    callButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
    buyButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    sellerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(2, 100, 86, 0.1)',
    },
    sellerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: 8,
        flex: 1,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primaryTransparent,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        flexShrink: 0,
    },
    verifiedText: {
        fontSize: 12,
        color: COLORS.primary,
        marginLeft: 4,
        fontWeight: '500',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensure dots are above images
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },

    paginationDotActive: {
        backgroundColor: COLORS.secondary,
        width: 24,
    },
    productCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
        padding: 5,
        borderRadius: 8,
        marginBottom: 16,
    },
    productCodeLabel: {
        fontSize: 14,
        color: COLORS.gray,
        marginLeft: 8,
        marginRight: 8,
    },
    productCodeValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    copyButton: {
        // padding: 8,
        marginLeft: 8,
    },
    pc: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default ProductDetailsScreen;
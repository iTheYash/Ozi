import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const BASE_URL = 'https://c595-103-74-197-73.ngrok-free.app';
const AllPostsScreen = ({ categoryPosts }) => {
    const navigation = useNavigation();
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.gridContainer}>
                {categoryPosts.length ? categoryPosts.map((item) => {
                    const getPriceNumber = (priceStr) => priceStr ? parseInt(priceStr.replace('₹', '').replace(',', '')) : 0;
                    const originalPriceNum = getPriceNumber(item.price);
                    const discountPercentage = item.discount || 0;
                    const currentPriceNum = originalPriceNum - (originalPriceNum * (discountPercentage / 100));
                    const roundedCurrentPrice = currentPriceNum.toFixed(0);
                    return (
                        <TouchableOpacity
                            key={item.post_id}
                            style={[
                                styles.item,
                                categoryPosts.length === 1 && {
                                    marginRight: 100,
                                    width: '55%',
                                    alignItems: 'center',
                                    paddingBottom: 10,
                                    borderWidth: 1,
                                    borderColor: '#f4f0ec',
                                    backgroundColor: '#fff'
                                }
                            ]}
                            onPress={() => navigation.navigate('ProductDetails', { item })}
                        >
                            <Image source={{ uri: item.image_urls[0] }} style={styles.img} />
                            <Text style={styles.itemText}>{item.title}</Text>
                            <View style={styles.detailsContainer}>
                                <Text style={styles.subText}>Weight | {item.net_weight}g</Text>
                                <Text style={styles.subText}>Carat | {item.purity}K</Text>
                            </View>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>₹{roundedCurrentPrice}</Text>
                                <Text style={styles.originalPrice}>₹{item.price}</Text>
                            </View>
                            {item.discount > 0 && (
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{item.discount}% OFF</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }) : (
                    <View style={styles.noContainer}>
                        <Text style={styles.noText}>No Posts</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    // Keeping existing styles
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        width: '100%',
    },
    scrollContainer: {
    },
    item: {
        width: '50%',
        alignItems: 'center',
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: '#f4f0ec',
        backgroundColor: '#fff',
        position: 'relative',
    },
    img: {
        width: '98%',
        height: 150,
        borderRadius: 5,
        resizeMode: 'cover',
    },
    itemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#026456',
        textAlign: 'center',
        marginVertical: 8,
        letterSpacing: 0.5,
    },
    detailsContainer: {
        alignItems: 'center',
        marginVertical: 4,
    },
    subText: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        marginVertical: 2,
        letterSpacing: 0.3,
    },
    // New and updated price-related styles
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#dca818',
        letterSpacing: 0.5,
    },
    originalPrice: {
        fontSize: 14,
        color: '#666666',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#026456',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    noContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#026456",
        letterSpacing: 0.5,
    },
});
export default AllPostsScreen;
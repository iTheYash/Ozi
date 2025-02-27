import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Dimensions,
    ScrollView,
    PanResponder,
    FlatList,
    Image,
    RefreshControl,
    Modal,
    BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Marquee } from '@animatereactnative/marquee';
import api from '../services/api';
import LinearGradient from 'react-native-linear-gradient';
import SingleCategoryScreen from './SingleCategoryScreen';
import Toast from 'react-native-toast-message';
import { useAppContext } from '../AuthProvider/AuthProvider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

const ExitModal = ({ visible, onCancel, onExit }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onCancel}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Exit App</Text>
                <Text style={styles.modalText}>Do you want to exit the app?</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity 
                        style={[styles.modalButton, styles.cancelButton]} 
                        onPress={onCancel}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.modalButton, styles.exitButton]} 
                        onPress={onExit}
                    >
                        <Text style={[styles.buttonText, styles.exitButtonText]}>Exit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const HomeScreen = () => {
    const [exitModalVisible, setExitModalVisible] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [ourServicesExpanded, setOurServicesExpanded] = useState(false);
    const [categoryExpanded, setCategoryExpanded] = useState(false);
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);
    const [bestsellers, setBestsellers] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();

    const { isRegistered, setIsRegistered, setRegisteredData } = useAppContext();

    const handleCancel = useCallback(() => {
        setExitModalVisible(false);
    }, []);

    const handleExit = useCallback(() => {
        setExitModalVisible(false);
        BackHandler.exitApp();
    }, []);

    // Separate back press handler that only triggers for hardware back button
    const handleBackPress = useCallback(() => {
        if (navigation.isFocused()) {
            setExitModalVisible(true);
            return true;
        } else {
            navigation.goBack();
            return true;
        }
    }, [navigation]);

    useEffect(() => {
        // Only handle hardware back button
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackPress
        );

        return () => {
            backHandler.remove();
        };
    }, [handleBackPress]);


    const fetchBestsellers = async () => {
        try {
            const bestsellerposts = await api.getBestsellersData();
            setBestsellers(bestsellerposts);
            // console.log('bestsellers',bestsellerposts);
            
        } catch (error) {
            console.error('Error fetching bestsellers:', error);
        }
    };

    useEffect(() => {
        fetchBestsellers();

        const refreshInterval = setInterval(fetchBestsellers, 5 * 60 * 1000);

        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchBestsellers().finally(() => setRefreshing(false));
    }, []);

    const HandleSell = () => {
        if (isRegistered) {
            navigation.navigate('Upload');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Registration Required',
                text2: 'Please register to proceed with selling.',
                position: 'top',
                visibilityTime: 2000, // Matches the Toast duration
            });

            // Add a timeout to delay navigation
            setTimeout(() => {
                navigation.navigate('RegisterPage');
            }, 1000); // 2000ms = 2 seconds (matches Toast visibility time)
        }
    };

    const handleOz = (route) => {
        if (isRegistered) {
            navigation.navigate(route);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Registration Required',
                text2: 'Please register to proceed with Ozaveria Features',
                position: 'top',
                visibilityTime: 2000, // Matches the Toast duration
            });

            // Add a timeout to delay navigation
            setTimeout(() => {
                navigation.navigate('RegisterPage');
            }, 1000); // 2000ms = 2 seconds (matches Toast visibility time)
        }
    }

    const handleCategory = (category) => {
        if (isRegistered) {
            navigation.navigate('SingleCategory', { category });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Registration Required',
                text2: 'Please register to proceed with Category',
                position: 'top',
                visibilityTime: 2000, // Matches the Toast duration
            });

            // Add a timeout to delay navigation
            setTimeout(() => {
                navigation.navigate('RegisterPage');
            }, 1000); // 2000ms = 2 seconds (matches Toast visibility time)
        }
    }

    const HandleProfile = () => {
        if (isRegistered) {
            navigation.navigate('myprofile');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Registration Required',
                text2: 'Please register to proceed with Profile Section',
                position: 'top',
                visibilityTime: 2000, // Matches the Toast duration
            });

            // Add a timeout to delay navigation
            setTimeout(() => {
                navigation.navigate('RegisterPage');
            }, 1000); // 2000ms = 2 seconds (matches Toast visibility time)
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch contact number from AsyncStorage
                const contact = await AsyncStorage.getItem('contactno');
                console.log('async', contact);

                if (contact) {
                    console.log("inside if", contact)
                    const response = await api.isRegistered(contact);

                    console.log('Response:???????????????????????????????????', response);
                    setIsRegistered(response.isRegistered);
                    setRegisteredData(response.data);

                    await AsyncStorage.setItem("token", response.token)

                    // Handle your response (e.g., update state if needed)
                } else {
                    console.error('Contact number not found in AsyncStorage.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // If the screen is focused (i.e., we're back from another screen)
        // You can use this effect to set the active tab based on the current screen
        if (isFocused) {
            const currentRoute =
                navigation.getState().routes[navigation.getState().index].name;
            setActiveTab(currentRoute); // Set active tab to current screen name
        }
    }, [isFocused, navigation]);

    // Animation values
    const profileMenuAnimation = useRef(new Animated.Value(0)).current;
    const drawerAnimationRef = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    const drawerOverlayAnimation = useRef(new Animated.Value(0)).current;
    const profileOverlayAnimation = useRef(new Animated.Value(0)).current;
    const panResponderEnabled = useRef(true);

    // Store the position of the profile button
    const profileButtonLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });


    const [availableCategories, setAvailableCategories] = useState([]);

    const toggleProfileMenu = () => {
        if (drawerOpen) {
            toggleDrawer();
            return;
        }

        const toValue = profileMenuVisible ? 0 : 1;

        // Animate both menu and overlay simultaneously
        Animated.parallel([
            Animated.spring(profileMenuAnimation, {
                toValue,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }),
            Animated.timing(profileOverlayAnimation, {
                toValue,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setProfileMenuVisible(!profileMenuVisible);
        });
    };

    const animateDrawer = toValue => {
        if (profileMenuVisible) {
            toggleProfileMenu();
            return;
        }

        const overlayValue = toValue === 0 ? 1 : 0;

        // Animate both drawer and overlay simultaneously
        Animated.parallel([
            Animated.timing(drawerAnimationRef, {
                toValue,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(drawerOverlayAnimation, {
                toValue: overlayValue,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setDrawerOpen(toValue === 0);
        });
    };

    const handleLogout = async () => {
        try {
            // Clear user session data
            await AsyncStorage.clear();
            
            // Navigate to Login screen
            // Using navigate instead of replace to ensure proper stack handling
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    const toggleDrawer = () => {
        const toValue = drawerOpen ? -SCREEN_WIDTH : 0;
        animateDrawer(toValue);
    };

    // Profile menu items
    const profileMenuItems = [
        {
            icon: 'person-outline',
            title: 'My Profile',
            onPress: () => { HandleProfile() },
        },
        {
            icon: 'mail-outline',
            title:'Inbox',
            onPress: () => navigation.navigate('InboxScreen'),
        },
        {
            icon: 'add-circle-outline',
            title: 'Post my Jewellery',
            onPress: () => {
                HandleSell();
            },
        },
        {
            icon: 'list-outline',
            title: 'My Listing',
            onPress: () => navigation.navigate('HistoryScreen'),
        },
        {
            icon: 'heart-outline',
            title: 'My Wishlist',
            onPress: () => navigation.navigate('Wishlist'),
        },
        {
            icon: 'card-outline',
            title: 'My Transaction',
            onPress: () => navigation.navigate('TransactionList'),
        },
        {
            icon: 'wallet-outline',
            title: 'Wallet',
            onPress: () => navigation.navigate('wallet'),
        },
        {
            icon: 'log-out-outline',
            title: 'Logout',
            onPress: () => handleLogout(),
        },
        {
            icon: 'trash-outline',
            title: 'Delete Account',
            onPress: () => handleDeleteAccount(),
        },
    ];

    const allCategories = [
        { id: 1, title: 'Rings', image: require('../assets/ring.jpg') },
        { id: 2, title: 'Anklets', image: require('../assets/anklet.jpg') },
        {
            id: 3,
            title: 'Necklace Sets',
            image: require('../assets/necklace_set.jpg'),
        },
        { id: 4, title: 'Earrings', image: require('../assets/ear_1.jpg') },
        { id: 5, title: 'Chains', image: require('../assets/pendant_set.jpg') },
        { id: 6, title: 'Bangles', image: require('../assets/bangless.jpg') },
        { id: 7, title: 'Mangalsutras', image: require('../assets/mangalsutra.jpg') },
        { id: 9, title: 'Bracelets', image: require('../assets/braceletss.jpg') },
        { id: 8, title: 'Others', image: require('../assets/nosepin.jpg') },
    ];
    const categories = [
        {
            name: 'Rings',
            image: require('../assets/ring.jpg'),
            screen: 'SingleCategory',
        },
        {
            name: 'Chains',
            image: require('../assets/pendant_set.jpg'),
            screen: 'SingleCategory',
        },
        {
            name: 'Mangalsutras',
            image: require('../assets/mangalsutra.jpg'),
            screen: 'SingleCategory',
        },
        {
            name: 'Necklace Sets',
            image: require('../assets/necklace_set.jpg'),
            screen: 'SingleCategory',
        },
        {
            name: 'Bangles',
            image: require('../assets/bangless.jpg'),
            screen: 'SingleCategory',
        },
        {
            name: 'Earrings',
            image: require('../assets/earrings.jpg'),
            screen: 'SingleCategory',
        },
        {
            name: 'Bracelets',
            image: require('../assets/braceletss.jpg'),
            screen: 'SingleCategory',
        },
        {
            name: 'Anklets',
            image: require('../assets/anklet.jpg'),
            screen: 'SingleCategory',
        },
        {
            name: 'Others',
            image: require('../assets/nosepin.jpg'),
            screen: 'SingleCategory',
        },
    ];

    const allServices = [
        { id: 1, title: 'Subscription', icon: 'card-outline' },
        { id: 2, title: 'Pay per Post', icon: 'cash-outline' },
    ];

    const categoryTitles = allCategories.map(category => {
        return { title: category.title, img: category.image };
    });
    const ourServices = allServices.map(service => {
        return { title: service.title, icon: service.icon };
    });


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await api.getCategories();
                setAvailableCategories(
                    categories.map(cat =>
                        typeof cat === 'string' ? cat.toLowerCase() : '',
                    ),
                );
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Set empty array as fallback
                setAvailableCategories([]);
            }
        };

        fetchCategories();
    }, []);

    // Profile button measurement
    const measureProfileButton = event => {
        const { x, y, width, height } = event.nativeEvent.layout;
        profileButtonLayout.current = { x, y, width, height };
    };

    // Pan responder for gesture handling
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                if (!panResponderEnabled.current) return false;
                const { dx, dy } = gestureState;
                return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
            },
            onPanResponderGrant: () => {
                drawerAnimationRef.setOffset(drawerAnimationRef._value);
            },
            onPanResponderMove: (_, gestureState) => {
                const { dx } = gestureState;
                let newValue = dx;

                if (drawerOpen) {
                    newValue = dx - SCREEN_WIDTH;
                }

                // Limit the drawer movement
                if (newValue > 0) newValue = 0;
                if (newValue < -SCREEN_WIDTH) newValue = -SCREEN_WIDTH;

                drawerAnimationRef.setValue(newValue);
            },
            onPanResponderRelease: (_, gestureState) => {
                drawerAnimationRef.flattenOffset();
                const { dx, vx } = gestureState;

                if (drawerOpen) {
                    // If drawer is open, check if should close
                    if (dx < -DRAWER_WIDTH / 3 || vx < -0.5) {
                        animateDrawer(-SCREEN_WIDTH);
                    } else {
                        animateDrawer(0);
                    }
                } else {
                    // If drawer is closed, check if should open
                    if (dx > DRAWER_WIDTH / 3 || vx > 0.5) {
                        animateDrawer(0);
                    } else {
                        animateDrawer(-SCREEN_WIDTH);
                    }
                }
            },
        }),
    ).current;

    // Disable pan responder when scrolling drawer content
    const handleScrollBegin = () => {
        panResponderEnabled.current = false;
    };

    const handleScrollEnd = () => {
        panResponderEnabled.current = true;
    };

    const renderDrawerItem = (
        title,
        icon,
        onPress,
        hasDropdown = false,
        isExpanded = false,
        dropdownItems = [],
        isPremium = false,
        isService = false,
    ) => (
        <View>
            <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
                <Icon name={icon} size={24} color="#DCA818" />
                <View style={styles.titleContainer}>
                    <Text style={styles.drawerItemText}>{title}</Text>
                    {isPremium && (
                        <>
                            <Text style={styles.superscriptTextO}>O</Text>
                            <Text style={styles.superscriptTextZ}>Z</Text>
                            <Text style={styles.plusText}>+</Text>
                        </>
                    )}
                </View>
                {hasDropdown && (
                    <Icon
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#DCA818"
                        style={styles.dropdownIcon}
                    />
                )}
            </TouchableOpacity>
            {hasDropdown && isExpanded && (
                <View style={styles.dropdownContent}>
                    {dropdownItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => {
                                if (isService) {
                                    navigation.navigate(
                                        item.title === 'Subscription'
                                            ? 'Subscription'
                                            : 'Pay per Post',
                                    );
                                } else {
                                    handleCategory(item.title);
                                }
                            }}>
                            <View style={styles.dropdownItemImgText}>
                                {isService ? (
                                    <View style={styles.imgContainer}>
                                        <Icon
                                            name={item.icon}
                                            size={24}
                                            color="#dca818"
                                            style={styles.dropdownItemIcon}
                                        />
                                    </View>
                                ) : (
                                    <View style={styles.imgContainer}>
                                        <Image source={item.img} style={styles.dropdownItemImg} />
                                    </View>
                                )}
                                <Text style={styles.dropdownItemText}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    const renderProfileMenuItem = (item, index) => (
        <TouchableOpacity
            key={index}
            style={[
                styles.profileMenuItem,
                // Add margin between items
                index > 0 && styles.menuItemSeparator,
            ]}
            onPress={() => {
                console.log(`Pressed: ${item.title}`); // Debug log
                item.onPress();
                toggleProfileMenu();
            }}
            activeOpacity={0.7} // Add feedback for press
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} // Adjust touch area
        >
            <View style={styles.menuItemContent}>
                <Icon name={item.icon} size={20} color="#333" />
                <Text style={styles.profileMenuItemText}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    // Add these render functions
    const renderAdBanner = () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const scrollViewRef = useRef(null);
        const screenWidth = Dimensions.get('window').width;

        const banners = [
            require('../assets/6.png'),
            require('../assets/8.png'),
            require('../assets/5.png'),
            require('../assets/4.png'),
            require('../assets/3.png'),
        ];

        useEffect(() => {
            const timer = setInterval(() => {
                const nextIndex = (activeIndex + 1) % banners.length;
                setActiveIndex(nextIndex);

                scrollViewRef.current?.scrollTo({
                    x: nextIndex * screenWidth,
                    animated: true,
                });

                // If we're at the last banner, seamlessly reset to first
                if (nextIndex === 0) {
                    scrollViewRef.current?.scrollTo({
                        x: 0,
                        animated: true,
                    });
                }
            }, 3000);

            return () => clearInterval(timer);
        }, [activeIndex]);

        const handleScroll = event => {
            const contentOffset = event.nativeEvent.contentOffset.x;
            const newIndex = Math.round(contentOffset / screenWidth);

            // Ensure we stay within bounds
            if (newIndex >= 0 && newIndex < banners.length) {
                setActiveIndex(newIndex);
            }
        };

        const handleMomentumScrollEnd = () => {
            // If manually scrolled to the end, smoothly continue to the first image
            if (activeIndex === banners.length - 1) {
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                        x: 0,
                        animated: true,
                    });
                    setActiveIndex(0);
                }, 1000);
            }
        };

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    scrollEventThrottle={16}>
                    {banners.map((banner, index) => (
                        <View
                            key={index}
                            style={[styles.adBannerContainer, { width: screenWidth }]}>
                            <Image
                                source={banner}
                                style={styles.adBanner}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.indicatorContainer}>
                    {banners.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                index === activeIndex
                                    ? styles.activeIndicator
                                    : styles.inactiveIndicator,
                            ]}
                        />
                    ))}
                </View>
            </View>
        );
    };

    //dynamic navigation banners
    // const renderAdBanner = () => {
    //     const [activeIndex, setActiveIndex] = useState(0);
    //     const scrollViewRef = useRef(null);
    //     const screenWidth = Dimensions.get('window').width;

    //     // Banner data with navigation destinations
    //     const banners = [
    //         {
    //             image: require('../assets/6.png'),
    //             destination: 'Upload',  // Replace with your actual screen name
    //         },
    //         {
    //             image: require('../assets/8.png'),
    //             destination: 'Home',
    //         },
    //         {
    //             image: require('../assets/5.png'),
    //             destination: '',
    //         },
    //         {
    //             image: require('../assets/4.png'),
    //             destination: 'Screen4',
    //         },
    //     ];

    //     useEffect(() => {
    //         const timer = setInterval(() => {
    //             const nextIndex = (activeIndex + 1) % banners.length;
    //             setActiveIndex(nextIndex);

    //             scrollViewRef.current?.scrollTo({
    //                 x: nextIndex * screenWidth,
    //                 animated: true,
    //             });

    //             if (nextIndex === 0) {
    //                 scrollViewRef.current?.scrollTo({
    //                     x: 0,
    //                     animated: true,
    //                 });
    //             }
    //         }, 3000);

    //         return () => clearInterval(timer);
    //     }, [activeIndex]);

    //     const handleScroll = event => {
    //         const contentOffset = event.nativeEvent.contentOffset.x;
    //         const newIndex = Math.round(contentOffset / screenWidth);

    //         if (newIndex >= 0 && newIndex < banners.length) {
    //             setActiveIndex(newIndex);
    //         }
    //     };

    //     const handleMomentumScrollEnd = () => {
    //         if (activeIndex === banners.length - 1) {
    //             setTimeout(() => {
    //                 scrollViewRef.current?.scrollTo({
    //                     x: 0,
    //                     animated: true,
    //                 });
    //                 setActiveIndex(0);
    //             }, 1000);
    //         }
    //     };

    //     const handleBannerPress = (destination, params = {}) => {
    //         navigation.navigate(destination, params);
    //     };

    //     return (
    //         <View style={{flex:1}}>
    //             <ScrollView
    //                 ref={scrollViewRef}
    //                 horizontal
    //                 pagingEnabled
    //                 showsHorizontalScrollIndicator={false}
    //                 onScroll={handleScroll}
    //                 onMomentumScrollEnd={handleMomentumScrollEnd}
    //                 scrollEventThrottle={16}
    //             >
    //                 {banners.map((banner, index) => (
    //                     <TouchableOpacity
    //                         key={index}
    //                         onPress={() => handleBannerPress(banner.destination, banner.params)}
    //                         activeOpacity={0.9}
    //                     >
    //                         <Image
    //                             source={banner.image}
    //                             style={{
    //                                 width: screenWidth,
    //                                 height: 200,  // Adjust height as needed
    //                                 resizeMode: 'cover'
    //                             }}
    //                         />
    //                     </TouchableOpacity>
    //                 ))}
    //             </ScrollView>
    //             <View style={styles.pagination}>
    //                 {banners.map((_, index) => (
    //                     <View
    //                         key={index}
    //                         style={[
    //                             styles.dot,
    //                             { backgroundColor: index === activeIndex ? '#000' : '#888' }
    //                         ]}
    //                     />
    //                 ))}
    //             </View>
    //         </View>
    //     );
    // };

    const renderBestSellerItem = ({ item }) => {

        const getPriceNumber = (priceStr) => priceStr ? parseInt(priceStr.replace('₹', '').replace(',', '')) : 0;
        const originalPriceNum = getPriceNumber(item.price);
        const discountPercentage = item.discount || 0; // Default to 0 if no discount
        const currentPriceNum = originalPriceNum - (originalPriceNum * (discountPercentage / 100));
        const roundedCurrentPrice = currentPriceNum.toFixed(0);
        const roundedogPrice = originalPriceNum.toFixed(0);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    if (isRegistered) {
                        navigation.navigate('ProductDetails', { item });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Registration Required',
                            text2: 'Please register to proceed with Viewing.',
                            position: 'top',
                            visibilityTime: 2000,
                        });

                        setTimeout(() => {
                            navigation.navigate('RegisterPage');
                        }, 2000);
                    }
                }}>
                {/* Image Section */}
                <View style={styles.imageSection}>
                    <Image source={{ uri: item.image_urls[0] }} style={styles.image} />
                    <LinearGradient
                        colors={['rgba(2, 100, 86, 0.85)', 'transparent']}
                        style={styles.imageGradient}>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                                <MaterialIcon name="tag" size={12} color="#FFFFFF" />
                                SAVE {discountPercentage}%
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    <View style={styles.categoryWrapper}>
                        <View style={styles.categoryPill}>
                            <Text style={styles.category}>{item.category}</Text>
                        </View>
                    </View>

                    <View style={styles.specRow}>
                        <View style={styles.specWrapper}>
                            <Text style={styles.specValue}>
                                {item.net_weight}g
                            </Text>
                            <Text style={styles.specLabel}>Weight</Text>
                        </View>
                        <View style={styles.specSeparator} />
                        <View style={styles.specWrapper}>
                            <Text style={styles.specValue}>
                                {item.purity}K
                            </Text>
                            <Text style={styles.specLabel}>Carat</Text>
                        </View>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>₹{roundedCurrentPrice}</Text>
                        <Text style={styles.originalPrice}>₹{roundedogPrice}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer} {...panResponder.panHandlers}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => {
                                if (!profileMenuVisible) {
                                    toggleDrawer();
                                }
                            }}
                            disabled={profileMenuVisible}>
                            <Icon
                                name="menu-outline"
                                size={34}
                                color={profileMenuVisible ? '#026456' : '#026456'}
                            />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Image
                                source={require('../assets/app_logo.png')}
                                style={styles.logo}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => {
                                if (!drawerOpen) {
                                    toggleProfileMenu();
                                }
                            }}
                            disabled={drawerOpen}
                            onLayout={measureProfileButton}>
                            <Icon
                                name="person-circle-outline"
                                size={34}
                                color={drawerOpen ? '#026456' : '#026456'}
                            />
                        </TouchableOpacity>
                    </View>
                    <ExitModal
                        visible={exitModalVisible}
                        onCancel={handleCancel}
                        onExit={handleExit}
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#026456']}
                            tintColor="#026456"
                        />
                    }>
                    <Marquee spacing={4} speed={0.8} children={1} style={styles.marquee}>
                        <Text style={styles.marqtext}>
                            22 Carat Gold ₹7,340 per gram & 24 Carat Gold ₹8,340 per gram
                        </Text>
                    </Marquee>

                    {renderAdBanner()}

                    <View style={styles.gradientcontainer}>
                        {/* Left Gradient Line */}
                        <LinearGradient
                            colors={['#DFAE26', '#925924', '#FBE284']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientLine}
                        />

                        {/* Icon Section */}
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../assets/Ozi.png')}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* Right Gradient Line */}
                        <LinearGradient
                            colors={['#DFAE26', '#925924', '#FBE284']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.gradientLine}
                        />
                    </View>


                    <View style={styles.sectionContainer}>
                        <Text style={styles.title}>Best Deals</Text>
                        <Text style={styles.subtitle}>"Where smart choices shine,</Text>
                        <Text style={styles.subtitle}>and wonderful deals await"</Text>
                        <FlatList
                            data={bestsellers && bestsellers}
                            renderItem={renderBestSellerItem}
                            keyExtractor={item => item.post_id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.bestSellersList}
                        />
                    </View>


                    {/* ------oz----- */}
                    <View style={styles.gradientcontainer}>
                        {/* Left Gradient Line */}
                        <LinearGradient
                            colors={['#DFAE26', '#925924', '#FBE284']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientLine}
                        />

                        {/* Icon Section */}
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../assets/Ozi.png')}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* Right Gradient Line */}
                        <LinearGradient
                            colors={['#DFAE26', '#925924', '#FBE284']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.gradientLine}
                        />
                    </View>

                    <View style={styles.main_Container}>
                        <Text style={styles.title}>Shop By Category</Text>
                        <Text style={styles.subtitle}>"Adorn yourself with elegance,</Text>
                        <Text style={styles.subtitle}>grace, and timeless beauty"</Text>

                        <View style={styles.gridContainer}>
                            {categories.map((category, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.item}
                                    onPress={() =>
                                        handleCategory(category.name)
                                    }>
                                    <Image source={category.image} style={styles.img} />
                                    <Text style={styles.itemText}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* ------oz----- */}


                    {/* <View style={styles.main_Container}>
                        <Text style={styles.title}>Our Promises</Text>
                        <Text style={styles.subtitle}>"Promises that reflect our</Text>
                        <Text style={styles.subtitle}>commitment to excellence"</Text>

                        <View style={styles.promise_scrollView}>
                            <View style={styles.promise_container}>
                                <Icon
                                    name="shield-checkmark-outline"
                                    size={40}
                                    color="#DCA818"
                                />
                                <Text style={styles.promise_title}>BIS Hallmark</Text>
                            </View>

                            <View style={styles.promise_container}>
                                <Icon name="refresh" size={40} color="#DCA818" />
                                <Text style={styles.promise_title}>Lifetime Exchange</Text>
                            </View>

                            <View style={styles.promise_container}>
                                <EvilIcons
                                    name="refresh"
                                    size={60}
                                    color="#DCA818"
                                    style={styles.icon3}
                                />
                                <Text style={styles.promise_title}>30-Day Return</Text>
                            </View>

                            <View style={styles.promise_container}>
                                <Feather name="check-circle" size={32} color="#DCA818" />
                                <Text style={styles.promise_title}>Purity Guarantee</Text>
                            </View>

                            <View style={styles.promise_container}>
                                <AntDesign name="creditcard" size={32} color="#DCA818" />
                                <Text style={styles.promise_title}>Secured Payment</Text>
                            </View>
                        </View>
                    </View> */}

                    {/* ------oz----- */}


                </ScrollView>

                {/* footer-nav */}
                <View style={styles.footer}>
                    {/* Home Tab */}
                    <TouchableOpacity
                        style={styles.footerItem}
                        onPress={() => {
                            setActiveTab('Home');
                            navigation.navigate('Home');
                        }}>
                        <Icon
                            name={activeTab === 'Home' ? 'home' : 'home-outline'}
                            size={24}
                            color={activeTab === 'Home' ? '#026456' : 'grey'}
                        />
                        <Text
                            style={[
                                styles.footerText,
                                activeTab === 'Home' && styles.activeFooterText,
                            ]}>
                            Home
                        </Text>
                    </TouchableOpacity>

                    {/* Chat Tab */}
                    {/* <TouchableOpacity
                        style={styles.footerItem}
                        onPress={() => setActiveTab('Chat')}
                    >
                        <Icon
                            name={activeTab === 'Chat' ? 'chatbubble' : 'chatbubble-outline'}
                            size={24}
                            color={activeTab === 'Chat' ? '#026456' : 'grey'}
                        />
                        <Text
                            style={[
                                styles.footerText,
                                activeTab === 'Chat' && styles.activeFooterText,
                            ]}
                        >
                            Chat
                        </Text>
                    </TouchableOpacity> */}

                    {/* Sell Button */}
                    <View style={styles.sellButtonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.sellButton,
                                activeTab === 'Sell' && styles.activeSellButton,
                            ]}
                            onPress={() => {
                                setActiveTab('Sell');
                                HandleSell();
                            }}>
                            <Icon name="add" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text
                            style={[
                                styles.sellText,
                                activeTab === 'Sell' && styles.activeFooterText,
                            ]}>
                            Sell
                        </Text>
                    </View>

                    {/* Wishlist Tab */}
                    {/* <TouchableOpacity
                        style={styles.footerItem}
                        onPress={() => setActiveTab('Wishlist')}
                    >
                        <Icon
                            name={activeTab === 'Wishlist' ? 'heart' : 'heart-outline'}
                            size={26}
                            color={activeTab === 'Wishlist' ? '#026456' : 'grey'}
                        />
                        <Text
                            style={[
                                styles.footerText,
                                activeTab === 'Wishlist' && styles.activeFooterText,
                            ]}
                        >
                            Wishlist
                        </Text>
                    </TouchableOpacity> */}

                    {/* Settings Tab */}
                    <TouchableOpacity
                        style={styles.footerItem}
                        onPress={() => {
                            setActiveTab('Settings');
                            navigation.navigate('setting');
                        }}>
                        <Icon
                            name={
                                activeTab === 'Settings'
                                    ? 'ellipsis-horizontal'
                                    : 'ellipsis-horizontal-outline'
                            }
                            size={24}
                            color={activeTab === 'Settings' ? '#026456' : 'grey'}
                        />
                        <Text
                            style={[
                                styles.footerText,
                                activeTab === 'Settings' && styles.activeFooterText,
                            ]}>
                            More
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Profile Menu Overlay */}
            <Animated.View
                style={[
                    styles.profileOverlay,
                    {
                        opacity: profileOverlayAnimation,
                        pointerEvents: profileMenuVisible ? 'auto' : 'none',
                    },
                ]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={toggleProfileMenu}
                />
            </Animated.View>

            {/* Profile Menu */}
            <Animated.View
                style={[
                    styles.profileMenu,
                    {
                        transform: [
                            {
                                translateY: profileMenuAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-200, 0],
                                }),
                            },
                            {
                                translateX: profileMenuAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0],
                                }),
                            },
                        ],
                        opacity: profileMenuAnimation,
                        top:
                            profileButtonLayout.current.y +
                            profileButtonLayout.current.height +
                            8,
                        right: 16,
                    },
                ]}
                pointerEvents={profileMenuVisible ? 'auto' : 'none'} // Prevent touch events when hidden
            >
                
                <ScrollView
                    style={styles.menuScrollView}
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                    indicatorStyle="default"
                    bounces={false}>
                    {profileMenuItems.map((item, index) =>
                        renderProfileMenuItem(item, index),
                    )}
                </ScrollView>
            </Animated.View>

            {/* Drawer Overlay */}
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        opacity: drawerOverlayAnimation,
                        pointerEvents: drawerOpen ? 'auto' : 'none',
                    },
                ]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={toggleDrawer}
                />
            </Animated.View>

            {/* Navigation Drawer */}
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        transform: [{ translateX: drawerAnimationRef }],
                    },
                ]}>
                <SafeAreaView style={styles.drawerContainer}>
                    <View style={styles.drawerHeader}>
                        <Text style={styles.drawerTitle}>Menu</Text>
                        <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
                            <Icon name="close-outline" size={24} color="#DCA818" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.drawerItems}
                        showsVerticalScrollIndicator={false}
                        onScrollBeginDrag={handleScrollBegin}
                        onScrollEndDrag={handleScrollEnd}
                        onMomentumScrollBegin={handleScrollBegin}
                        onMomentumScrollEnd={handleScrollEnd}>
                        {renderDrawerItem(
                            'Shop by Category',
                            'grid-outline',
                            () => setCategoryExpanded(!categoryExpanded),
                            true,
                            categoryExpanded,
                            categoryTitles,
                        )}
                        {renderDrawerItem(
                            'Directory',
                            'business-outline',
                            () => { handleOz('Directory') },
                            false,
                            false,
                            [],
                            true,
                        )}
                        {/* {renderDrawerItem(
                            'Catalogue Generation',
                            'book-outline',
                            () => navigation.navigate('CatalogueGeneration'),
                            false,
                            false,
                            [],
                            true,
                        )} */}
                        {/* {renderDrawerItem(
                            'Digital Marketing',
                            'megaphone-outline',
                            () => navigation.navigate('Marketing'),
                            false,
                            false,
                            [],
                            true,
                        )} */}
                        {/* {renderDrawerItem(
                            'Digital Exhibition',
                            'desktop-outline',
                            () => navigation.navigate('Exhibition'),
                            false,
                            false,
                            [],
                            true,
                        )} */}
                        {/* {renderDrawerItem(
                            'Fintech Solution',
                            'card-outline',
                            () => navigation.navigate('Fintech'),
                            false,
                            false,
                            [],
                            true,
                        )} */}
                        {renderDrawerItem(
                            'Our Services',
                            'briefcase-outline',
                            () => setOurServicesExpanded(!ourServicesExpanded),
                            true,
                            ourServicesExpanded,
                            ourServices,
                            true,
                            true,
                        )}
                        {renderDrawerItem('Advertise with us', 'pricetag-outline', () =>
                            navigation.navigate('Advertise'),
                        )}
                        {renderDrawerItem(
                            'How to use Ozaveria',
                            'help-circle-outline',
                            () => navigation.navigate('howtouse'),
                        )}
                        {renderDrawerItem('Blog', 'newspaper-outline', () =>
                            navigation.navigate('BlogScreen'),
                        )}
                        {renderDrawerItem('About us', 'information-circle-outline', () =>
                            navigation.navigate('About'),
                        )}
                        {renderDrawerItem(
                            'Legal and Compliance',
                            'document-text-outline',
                            () => navigation.navigate('Legal'),
                        )}
                        {renderDrawerItem('Reach us', 'mail-outline', () =>
                            navigation.navigate('support'),
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    titleContainer: {
        alignItems: 'center',
    },
    badgeLogo: {
        width: 20,
        height: 20,
        marginLeft: 4,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        zIndex: 2,
    },
    drawerContainer: {
        flex: 1,
        backgroundColor: '#026456',
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#026456',
    },
    drawerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    drawerItems: {
        flex: 1,
        color: '#ffffff',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flex: 1,
    },
    drawerItemText: {
        marginLeft: 16,
        fontSize: 16,
        flex: 1,
        color: '#fff',
    },
    dropdownIcon: {
        marginLeft: 'auto',
    },
    dropdownContent: {
        backgroundColor: '#026456',
    },
    dropdownItemImgText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    dropdownItem: {
        padding: 5,
        paddingLeft: 56,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#fff',
    },
    imgContainer: {
        width: 45,
        height: 45,
    },
    dropdownItemImg: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    dropdownItemIcon: {
        width: 24,
        height: 24,
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 20,
    },
    profileOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 3,
    },
    profileMenu: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        width: 220, // Slightly wider for better touch targets
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 4,
        maxHeight: 400,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#026456',
    },
    menuScrollView: {
        flexGrow: 0,
    },
    profileMenuItem: {
        borderRadius: 6, // Rounded corners for better touch feedback
        overflow: 'hidden', // Ensure ripple stays within bounds
        backgroundColor: 'transparent',
        marginVertical: 2, // Add space between items
    },

    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingVertical: 14, // Increase vertical padding for better touch targets
    },

    menuItemSeparator: {
        marginTop: 4, // Add more space between items
    },

    profileMenuItemText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#333',
        flex: 1, // Take up remaining space
    },
    horizontalList: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
    },
    adBannerContainer: {
        aspectRatio: '16/9', // or any other ratio you prefer
        width: '100%',
        paddingTop: 16,
    },
    adBanner: {
        width: '100%',
        height: '100%',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    },
    indicator: {
        width: 5,
        height: 5,
        borderRadius: 2,
        marginHorizontal: 2,
    },
    activeIndicator: {
        backgroundColor: '#fff',
        width: 5,
        height: 5,
    },
    inactiveIndicator: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        paddingHorizontal: 16,
        color: '#026456',
    },
    // bestSellersList: {
    //     paddingHorizontal: 16,
    //     paddingVertical: 16,
    // },
    sectionContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
    },
    bestSellersList: {
        paddingHorizontal: 16,
    },
    card: {
        marginTop: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#FFFFFF',
        marginVertical: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(2, 100, 86, 0.08)',
        // Add these properties for better content handling
        minHeight: 130, // Optional: maintains minimum height
        flex: 1,       // Allows the card to grow
    },
    imageSection: {
        width: 120,
        height: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 8,
    },
    discountBadge: {
        backgroundColor: '#DCA818',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    contentSection: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(2, 100, 86, 0.02)',
    },
    categoryWrapper: {
        // marginBottom: 8,
    },
    categoryPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#026456',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    category: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    specRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 8,
    },
    specWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    specValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#026456',
        // marginBottom: 2,
    },
    specLabel: {
        fontSize: 11,
        color: '#666666',
        letterSpacing: 0.2,
    },
    specSeparator: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(2, 100, 86, 0.1)',
        marginHorizontal: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
    },
    currentPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#026456',
        letterSpacing: 0.3,
    },
    originalPrice: {
        fontSize: 13,
        color: '#666666',
        textDecorationLine: 'line-through',
        textDecorationColor: '#DCA818',
    },
    // price: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: '#000',
    //     marginBottom: 4,
    // },
    // discount: {
    //     fontSize: 14,
    //     color: '#e41e31',
    //     fontWeight: '500',
    // },

    superscriptTextO: {
        position: 'absolute', // Positions the badge
        top: -5, // Adjust for top alignment
        right: -17, // Align to the top-right corner
        width: 17, // Set the badge size
        height: 17, // Adjust size as needed
        resizeMode: 'contain',
        color: '#DCA818', // Neon base color
        fontWeight: 'bold',
        //textShadowColor: 'rgba(220, 168, 24, 1)', // Bright core glow
        textShadowOffset: { width: 0, height: 0 }, // Centered glow
        textShadowRadius: 15, // Wide neon-like glow
    },
    superscriptTextZ: {
        position: 'absolute', // Positions the badge
        top: -4, // Adjust for top alignment
        right: -27, // Align to the top-right corner
        width: 17, // Set the badge size
        height: 17, // Adjust size as needed
        resizeMode: 'contain',
        color: '#DCA818', // Neon base color
        fontSize: 12,
        fontWeight: 'bold',
        //  textShadowColor: 'rgba(220, 168, 24, 1)', // Bright core glow
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15, // Wide neon-like glow
    },
    plusText: {
        position: 'absolute', // Stack it on top of the image
        top: -12, // Adjust to appear as superscript
        right: -25,
        fontSize: 12, // Smaller font for the superscript
        color: '#DCA818', // Neon base color
        //textShadowColor: 'rgba(220, 168, 24, 1)', // Bright core glow
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15, // Wide neon-like glow
        fontWeight: 'bold',
    },
    offersList: {
        paddingHorizontal: 16,
    },
    bestSellersList: {
        paddingHorizontal: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    logo: {
        width: 150, // Set a more appropriate width for the logo
        height: 60, // Set a more appropriate height for the logo
        resizeMode: 'contain', // Ensures the logo is scaled properly
        // marginTop:10
    },
    marquee: {
        backgroundColor: '#fcc200',
        paddingTop: 5,
        paddingBottom: 5,
    },
    marqtext: {
        color: '#026456',
        fontSize: 14,
        fontWeight: '500',
    },
    bestSellersGrid: {
        padding: 12,
    },
    bestSellerItem: {
        flex: 1,
        margin: 8,
        width: '47%',
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
    },
    bestSellerImage: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        resizeMode: 'cover',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: '#FF0000',
        marginRight: 8,
        fontSize: 14,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginVertical: 2,
    },
    currentPrice: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    discount: {
        fontSize: 14,
        color: '#e41e31',
        fontWeight: '500',
    },
    specificationsContainer: {
        marginVertical: 4,
    },
    specText: {
        fontSize: 12,
        color: '#666',
        marginVertical: 2,
    },
    main_Container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: -10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#026456',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        fontStyle: 'italic',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow wrapping of items to the next row
        justifyContent: 'space-between', // Add spacing between items
        marginTop: 20,
    },
    item: {
        width: '30%', // Set width to 48% to fit two items in a row
        alignItems: 'center',
        marginBottom: 20,
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 50, // Circular image
        resizeMode: 'cover',
        marginBottom: 10,
        // borderWidth:1,
        // borderColor:'#026456',
        shadowColor: '#026456',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    itemText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#026456',
    },
    gradientcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
    gradientLine: {
        flex: 1,
        height: 1,
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        backgroundColor: 'transparent',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
    },
    '@media (min-width: 768px)': {
        icon: {
            width: 40,
            height: 40,
        },
    },
    main_Container: {
        padding: 16,
    },
    promise_scrollView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    promise_container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 65, // Width for each promise box
        marginHorizontal: 1,
    },
    promise_title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#026456',
        marginTop: 8,
        textAlign: 'center',
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: Platform.OS === 'ios' ? 60 : 65,
        borderTopWidth: 1,
        borderTopColor: '#DCA818',
        paddingBottom: Platform.OS === 'ios' ? 0 : 10,
    },
    footerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    footerText: {
        fontSize: 12,
        color: 'grey',
        marginTop: 4,
    },
    activeFooterText: {
        color: '#026456',
    },
    sellButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: -10, // Position it above the footer
        borderTopWidth: 2,
        borderColor: '#DCA818',
        borderRadius: 30,
    },
    sellButton: {
        width: 60,
        height: 60,
        borderRadius: 30, // Circular button
        backgroundColor: '#DCA818',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Add shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sellText: {
        fontSize: 12,
        color: '#DCA818',
        marginTop: 4,
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: Platform.select({
            ios: 60,
            android: 65
        }),
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: Platform.select({
            ios: 0,
            android: 10
        }),
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 4,
    },
    footerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingVertical: 8,
    },
    footerText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
        marginTop: 4,
    },
    activeFooterText: {
        color: '#026456',
        fontWeight: '600',
    },
    sellButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginBottom: 7,
    },
    sellButton: {
        backgroundColor: '#DCA818',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#026456',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    activeSellButton: {
        backgroundColor: '#015445',
    },
    sellText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#026456'
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: 100,
        alignItems: 'center'
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        marginRight: 10
    },
    exitButton: {
        backgroundColor: '#026456',
        marginLeft: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500'
    },
    exitButtonText: {
        color: 'white'
    }
});

export default HomeScreen;

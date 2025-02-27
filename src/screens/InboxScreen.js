import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../services/api';

const InboxScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [userId, setUserId] = useState(null);

    const truncateCompanyName = (name) => {
        if (!name) return 'Loading...';
        const words = name.split(' ');
        if (words.length > 3) {
            return `${words.slice(0, 2).join(' ')}...`;
        }
        return name;
    };

    useEffect(() => {
        const loadChats = async () => {
            const currentUserId = await AsyncStorage.getItem('contactno');
            setUserId(currentUserId);
            try {
                const response = await api.getUserChats(currentUserId);
                if (response.success) {
                    setChats(response.chats);
                }
            } catch (error) {
                console.error('Error loading chats:', error);
            }
        };

        loadChats();
    }, []);

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const renderChatItem = ({ item }) => {
        const isUserSeller = item.seller_id === userId;
        const name = isUserSeller ? item.buyer_name : item.seller_name;
        const avatarUrl = item.avatar_url; // Assuming your API returns avatar_url

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => navigation.navigate('Chat', {
                    buyerIdd: item.buyer_id,
                    sellerId: item.seller_id,
                    productId: item.product_code,
                    sellerName: item.seller_name,
                    productTitle: item.product_title,
                    buyerName: item.buyer_name,
                    name: name,
                    product_image:item.product_image,
                })}
            >
                {item.product_image ? (
                    <Image
                        source={{ uri: `https://api.ozaveria.com:3000/uploads/${item.product_image.split(',')[0]}` }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.initialsAvatar}>
                        <Text style={styles.initialsText}>
                            {getInitials(name)}
                        </Text>
                    </View>
                )}
                <View style={styles.chatInfo}>
                    <View style={styles.topRow}>
                        <Text style={styles.personName}>
                            {truncateCompanyName(name)}
                        </Text>
                        
                    </View>
                    <Text style={styles.productTitle}>{item.product_title}</Text>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.message}
                    </Text>
                    <Text style={styles.messageTime}>
                            {new Date(item.created_datetime).toLocaleString()}
                        </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="left" size={24} color="#026456" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Inbox</Text>
            </View>

            {chats.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No messages yet</Text>
                    <Text style={styles.emptySubtext}>Your conversations will appear here</Text>
                </View>
            ) : (
                <FlatList
                    data={chats}
                    renderItem={renderChatItem}
                    keyExtractor={(item) => item.room_id}
                    contentContainerStyle={styles.chatList}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
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
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#026456',
        marginLeft: 4,
    },
    chatList: {
        flexGrow: 1,
    },
    chatItem: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 25,
        marginRight: 12,
    },
    initialsAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#026456',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    initialsText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    chatInfo: {
        flex: 1,
        gap: 0,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    personName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#026456',
    },
    productTitle: {
        fontSize: 14,
        color: '#495057',
        fontWeight: '500',
        marginTop: 2,
    },
    lastMessage: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 2,
    },
    messageTime: {
        fontSize: 12,
        color: '#adb5bd',
    },
    separator: {
        height: 1,
        backgroundColor: '#f1f3f5',
        marginLeft: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    emptyText: {
        color: '#495057',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        color: '#adb5bd',
        fontSize: 14,
    },
});

export default InboxScreen;
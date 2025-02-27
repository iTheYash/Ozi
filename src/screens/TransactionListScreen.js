import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { sampleTransactions } from '../data/SampleTransactions';

const TransactionListScreen = ({ navigation }) => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setTransactions(sampleTransactions);
        setFilteredTransactions(sampleTransactions);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredTransactions(transactions);
        } else {
            const filtered = transactions.filter((transaction) =>
                transaction.description.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredTransactions(filtered);
        }
    };

    const renderTransactionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.transactionCard}
            onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
        >
            <View style={styles.cardContent}>
                <Image source={item.image} style={styles.productImage} resizeMode='cover' />
                <View style={styles.detailsContainer}>
                    <View style={styles.topRow}>
                        <Text style={styles.productName} numberOfLines={1}>
                            {item.description}
                        </Text>
                        <Text style={[
                            styles.amount,
                            { color: item.type === 'buy' ? '#026456' : '#DCA818' }
                        ]}>
                            ₹{item.amount}
                        </Text>
                    </View>
                    
                    <View style={styles.bottomRow}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.transactionId}>#{item.transactionId}</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                        <View style={[
                            styles.typeTag,
                            { backgroundColor: item.type === 'buy' ? '#026456' : '#DCA818' }
                        ]}>
                            <Text style={styles.typeText}>
                                {item.type.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="left" size={24} color="#026456" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transactions</Text>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#026456" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search transactions..."
                    placeholderTextColor="#888888"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            <FlatList
                data={filteredTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
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
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F4F0EC',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#026456',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchIcon: {
        position: 'absolute',
        left: 28,
        top: 24,
        zIndex: 1,
    },
    searchInput: {
        backgroundColor: '#F4F0EC',
        borderRadius: 8,
        paddingHorizontal: 40,
        paddingVertical: 12,
        fontSize: 15,
        color: '#026456',
    },
    listContainer: {
        padding: 16,
    },
    transactionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F4F0EC',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 12,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F4F0EC',
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    productName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#026456',
        marginRight: 8,
    },
    amount: {
        fontSize: 15,
        fontWeight: '700',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionId: {
        fontSize: 13,
        color: '#888888',
    },
    dot: {
        fontSize: 13,
        color: '#888888',
        marginHorizontal: 6,
    },
    date: {
        fontSize: 13,
        color: '#888888',
    },
    typeTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
    }
});

export default TransactionListScreen;
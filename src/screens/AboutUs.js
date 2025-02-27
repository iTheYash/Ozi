import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const AboutUsScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#026456" />
            
            {/* Header with gradient background */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.mainTitle}>About Ozaveria</Text>
                    <Text style={styles.tagline}>
                        Transforming Gold Jewelry Trading
                    </Text>
                </View>

                {/* Mission Card */}
                <View style={styles.missionCard}>
                    <MaterialIcons name="diamond" size={36} color="#DCA818" />
                    <Text style={styles.missionText}>
                        At <Text style={styles.highlightText}>Ozaveria</Text>, we are transforming 
                        the way the world buys and sells real gold jewelry.
                    </Text>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    <Text style={styles.description}>
                        Our jewelry platform connects jewelry sellers with buyers, offering a seamless 
                        and trustworthy marketplace to facilitate transactions with ease.
                    </Text>
                    
                    {/* Feature Cards */}
                    <View style={styles.featureCards}>
                        <View style={styles.featureCard}>
                            <MaterialIcons name="storefront" size={28} color="#026456" />
                            <Text style={styles.featureTitle}>Marketplace Solution</Text>
                            <Text style={styles.featureDescription}>
                                Clear unsold inventory efficiently while ensuring fair prices
                            </Text>
                        </View>
                        
                        <View style={styles.featureCard}>
                            <MaterialIcons name="verified-user" size={28} color="#026456" />
                            <Text style={styles.featureTitle}>Trusted Platform</Text>
                            <Text style={styles.featureDescription}>
                                Secure and transparent environment for all transactions
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        Whether you are a business looking to clear your dead stock or a buyer looking 
                        for exquisite pieces, Ozaveria offers a trusted platform to buy and sell gold 
                        jewelry in a secure, efficient, and transparent environment.
                    </Text>
                    
                    <Text style={[styles.description, styles.lastDescription]}>
                        Join us as we create a new standard in the gold jewelry marketplace.
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('Subscription')}
                    >
                        <Text style={styles.primaryButtonText}>Explore Our Services</Text>
                        <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('support')}
                    >
                        <Text style={styles.secondaryButtonText}>Contact Us</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 16,
        backgroundColor: '#026456',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroSection: {
        backgroundColor: '#026456',
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    missionCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: -40,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    missionText: {
        fontSize: 18,
        color: '#2D3748',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 28,
    },
    highlightText: {
        color: '#026456',
        fontWeight: 'bold',
    },
    mainContent: {
        padding: 20,
    },
    description: {
        fontSize: 16,
        color: '#4A5568',
        lineHeight: 24,
        marginBottom: 24,
    },
    lastDescription: {
        fontStyle: 'italic',
        color: '#026456',
        fontWeight: '500',
    },
    featureCards: {
        flexDirection: 'row',
        gap: 16,
        marginVertical: 24,
    },
    featureCard: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#026456',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 14,
        color: '#4A5568',
        textAlign: 'center',
        lineHeight: 20,
    },
    buttonContainer: {
        padding: 20,
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#026456',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#026456',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#026456',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default AboutUsScreen;
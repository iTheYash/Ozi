import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function PrivacyScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="left" size={24} color="#026456" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
            </View>
            <ScrollView style={styles.contentContainer}>
                <Text style={styles.lastUpdated}>Last Updated: January 16, 2025</Text>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Information Collection</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Personal Information</Text>
                        <Text style={styles.cardText}>
                            We collect information such as your name, email address, and usage data
                            to provide you with a better experience.
                        </Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Usage Data</Text>
                        <Text style={styles.cardText}>
                            We collect data about how you interact with our app, including features
                            used and time spent.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            • To personalize your experience{'\n'}
                            • To improve our services{'\n'}
                            • To communicate with you{'\n'}
                            • To provide customer support
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Data Security</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            We implement various security measures to protect your personal information.
                            However, no data transmission over the internet can be guaranteed to be
                            100% secure.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Your Rights</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>You have the right to:</Text>
                        <Text style={styles.cardText}>
                            • Access your personal data{'\n'}
                            • Request data correction{'\n'}
                            • Request data deletion{'\n'}
                            • Withdraw consent
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Contact Us</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            If you have questions about this privacy policy, please contact us at:
                        </Text>
                        <Text style={styles.linkText}>privacy@example.com</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F4F0EC',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#026456',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#DCA818',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#026456',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F4F0EC',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#026456',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 24,
    },
    linkText: {
        fontSize: 16,
        color: '#DCA818',
        textDecorationLine: 'underline',
        marginTop: 8,
    },
});
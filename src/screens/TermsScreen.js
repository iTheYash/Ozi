import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function TermsScreen() {
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
                <Text style={styles.headerTitle}>Terms of Use</Text>
            </View>
            <ScrollView style={styles.contentContainer}>
                <Text style={styles.lastUpdated}>Last Updated: January 16, 2025</Text>

                <View style={styles.card}>
                    <Text style={styles.cardText}>
                        Welcome to Ozaveria. These Terms of Use constitute a legally binding agreement between you and Ozaveria regarding your use of our mobile application and services.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            By downloading, installing, or using the Ozaveria app, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree to these terms, please do not use our services.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. User Account</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            • You must be at least 18 years old to use this service{'\n'}
                            • You are responsible for maintaining the confidentiality of your account{'\n'}
                            • You agree to provide accurate and complete information{'\n'}
                            • You are solely responsible for all activities under your account
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Acceptable Use</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>You agree not to:</Text>
                        <Text style={styles.cardText}>
                            • Use the app for any unlawful purpose{'\n'}
                            • Attempt to gain unauthorized access{'\n'}
                            • Transmit harmful code or materials{'\n'}
                            • Interfere with other users' enjoyment of the app{'\n'}
                            • Copy or modify the app's content
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            All content, features, and functionality of the Ozaveria app are owned by Ozaveria and are protected by international copyright, trademark, and other intellectual property laws.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Privacy Policy</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            Your use of Ozaveria is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Disclaimers</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            The app is provided "as is" without warranties of any kind. Ozaveria disclaims all warranties, whether express or implied, including warranties of merchantability and fitness for a particular purpose.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            Ozaveria shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the app.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            We reserve the right to modify these terms at any time. We will notify you of any material changes through the app or via email. Your continued use of the app after such modifications constitutes acceptance of the updated terms.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Contact Information</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            If you have any questions about these Terms of Use, please contact us at:
                        </Text>
                        <Text style={styles.linkText}>legal@ozaveria.com</Text>
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
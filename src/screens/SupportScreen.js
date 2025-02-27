import { StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function SupportScreen() {
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
                <Text style={styles.headerTitle}>Support</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>How can we help you?</Text>
                <View style={styles.supportCard}>
                    <Text style={styles.supportText}>Email us:</Text>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('mailto:support@ozaveria.com')}
                    >
                        <Text style={styles.linkText}>support@ozaveria.com</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.supportCard}>
                    <Text style={styles.supportText}>Call us:</Text>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('tel:+1234567890')}
                    >
                        <Text style={styles.linkText}>+1 (234) 567-890</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        padding: 16,
    },
    contentTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#026456',
        marginBottom: 16,
    },
    supportCard: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F4F0EC',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    supportText: {
        fontSize: 16,
        color: '#026456',
        marginBottom: 8,
    },
    linkText: {
        fontSize: 16,
        color: '#DCA818',
        textDecorationLine: 'underline',
    },
});

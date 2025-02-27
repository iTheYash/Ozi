import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import Toast from 'react-native-toast-message';
import { useAppContext } from '../AuthProvider/AuthProvider';

const MyProfile = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { registeredData } = useAppContext();
    console.log('registeredData is..................',registeredData);
    


    const InfoCard = ({ title, children }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            {children}
        </View>
    );

    const InfoItem = ({ label, value, icon }) => (
        <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
                <AntDesign name={icon} size={20} color="#DCA818" />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={getDetails}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#026456" />
                <Text style={styles.loadingText}>Fetching registration details...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="left" size={24} color="#026456" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            {registeredData ? (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <AntDesign name="user" size={40} color="#FFFFFF" />
                        </View>
                        <Text style={styles.companyName}>{registeredData.s_company_name}</Text>
                        <Text style={styles.businessType}>{registeredData.s_natureofbusiness}</Text>
                    </View>

                    <InfoCard title="Owner Information">
                        <InfoItem
                            label="Owner Name"
                            value={registeredData.s_owner_name}
                            icon="user"
                        />
                    </InfoCard>

                    <InfoCard title="Business Details">
                        <InfoItem
                            label="Business ID"
                            value={registeredData.s_id.toString()}
                            icon="idcard"
                        />
                        <InfoItem
                            label="GST Number"
                            value={registeredData.s_gstno}
                            icon="Safety"
                        />
                    </InfoCard>

                    <InfoCard title="Contact Information">
                        <InfoItem
                            label="Primary Email"
                            value={registeredData.s_company_email_addr}
                            icon="mail"
                        />
                        <InfoItem
                            label="Secondary Email"
                            value={registeredData.s_personal_email_addr}
                            icon="mail"
                        />
                        <InfoItem
                            label="Phone"
                            value={registeredData.s_contactno}
                            icon="phone"
                        />
                    </InfoCard>

                    <InfoCard title="Address">
                        <InfoItem
                            label="Registered Address"
                            value={registeredData.s_registered_addr}
                            icon="enviromento"
                        />
                        <InfoItem
                            label="Current Address"
                            value={registeredData.s_current_addr}
                            icon="enviromento"
                        />
                        <InfoItem
                            label="City"
                            value={registeredData.s_city}
                            icon="flag"
                        />
                        <InfoItem
                            label="State"
                            value={registeredData.s_state}
                            icon="flag"
                        />
                        <InfoItem
                            label="PIN Code"
                            value={registeredData.s_pincode}
                            icon="pushpin"
                        />
                    </InfoCard>
                </ScrollView>
            ) : (
                <View style={styles.centerContainer}>
                    <Text style={styles.loadingText}>No registration details found.</Text>
                </View>
            )}
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F0EC',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: '#666666',
        fontSize: 16,
    },
    errorText: {
        color: '#FF4444',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#DCA818',
        borderRadius: 8,
        padding: 12,
        paddingHorizontal: 24,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#026456',
    },
    profileHeader: {
        backgroundColor: '#026456',
        padding: 24,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        textAlign: 'center',
    },
    businessType: {
        fontSize: 16,
        color: '#DCA818',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        marginTop: 8,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#026456',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F4F0EC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: '#333333',
    },
    scrollView: {
        flex: 1,
    },
});

export default MyProfile;
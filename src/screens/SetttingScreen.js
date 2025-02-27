import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Linking } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleRateApp = async () => {
        try {
            // For Android
            await Linking.openURL('market://details?id=com.ozaveria');
        } catch (error) {
            // Fallback URL for Play Store
            await Linking.openURL('https://play.google.com/store/apps/details?id=com.ozaveria');
        }
    };

    const settingsOptions = [
        {
            id: '1',
            title: 'Rate Ozaveria App',
            icon: 'star',
            onPress: handleRateApp,
        },
        {
            id: '2',
            title: 'Ozaveria Support',
            icon: 'customerservice',
            onPress: () => navigation.navigate('support'),
        },
        {
            id: '3',
            title: 'FAQ',
            icon: 'questioncircle',
            onPress: () => navigation.navigate('faq'),
        },
        {
            id: '4',
            title: 'Privacy Policy',
            icon: 'Safety',
            onPress: () => navigation.navigate('privacy'),
        },
        {
            id: '5',
            title: 'Terms of Use',
            icon: 'filetext1',
            onPress: () => navigation.navigate('terms'),
        },
    ];

    const SettingItem = ({ title, icon, onPress }) => (
        <TouchableOpacity 
            style={styles.settingItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingContent}>
                <View style={styles.iconContainer}>
                    <AntDesign name={icon} size={24} color="#DCA818" />
                </View>
                <Text style={styles.settingText}>{title}</Text>
            </View>
            <AntDesign name="right" size={20} color="#026456" />
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
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <View style={styles.settingsContainer}>
                {settingsOptions.map((option) => (
                    <SettingItem
                        key={option.id}
                        title={option.title}
                        icon={option.icon}
                        onPress={option.onPress}
                    />
                ))}
            </View>
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
        borderBottomWidth: 1,
        borderBottomColor: '#F4F0EC',
        backgroundColor: '#FFFFFF',
        elevation: 2,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#026456',
    },
    settingsContainer: {
        paddingTop: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F4F0EC',
    },
    settingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F4F0EC',
        marginRight: 16,
    },
    settingText: {
        fontSize: 16,
        color: '#026456',
        flex: 1,
    },
});

export default SettingsScreen;
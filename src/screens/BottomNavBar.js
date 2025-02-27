import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomNavBar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.tabItem} 
                onPress={() => navigation.navigate('Home')}
            >
                <Icon name="home-outline" size={24} color="#026456" />
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.tabItem, styles.plusButton]}
                onPress={() => navigation.navigate('Upload')}
            >
                <View style={styles.plusButtonInner}>
                    <Icon name="add" size={32} color="#FFFFFF" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.tabItem}
                onPress={() => navigation.navigate('Settings')}
            >
                <Icon name="settings-outline" size={24} color="#026456" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 5,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusButton: {
        top: -15,
    },
    plusButtonInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#DCA818',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default BottomNavBar;
import { StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function DigitalExhibition() {
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
                <Text style={styles.headerTitle}>Digital Exhibition</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.text}>Coming soon....</Text>
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
    contentContainer:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        textAlign:'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ccc',
    }
});

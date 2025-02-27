import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome'; // Correct import for React Native CLI
// import { FontAwesome } from '@expo/vector-icons'; // Use this if you're using Expo
 
const OfflineNotice = () => {
  const [isConnected, setIsConnected] = useState(true);
 
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
 
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
 
    return () => {
      unsubscribe();
    };
  }, []);
 
  if (isConnected) {
    return null;
  }
 
  return (
    <View style={styles.container}>
      <Icon name="wifi" size={60} color="#fff" style={styles.icon} />
      <Text style={styles.text}>You are offline</Text>
      <Text style={styles.subText}>Please check your internet connection</Text>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#026456',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  icon: {
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});
 
export default OfflineNotice;
 
 
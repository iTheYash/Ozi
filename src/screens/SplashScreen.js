import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // Wait for a minimum time to show splash screen
        await new Promise(resolve => setTimeout(resolve, 2000));
 
        // Check if user is logged in
        const contactno = await AsyncStorage.getItem('contactno');
        const token = await AsyncStorage.getItem('token');
 
        // Navigate based on authentication status
        if (contactno || token) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigation.replace('Login'); // Default to login on error
      }
    };
 
    checkAuthAndNavigate();
  }, [navigation]);
 
  return (
    <LinearGradient
      colors={['#DCA818','#026456' ]} // Gradient colors
      style={styles.container}
    >
      <Image source={require('../assets/app_logo.png')} style={styles.logo} />
    </LinearGradient>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
  },
});
 
export default SplashScreen;
 
 
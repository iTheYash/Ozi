import React, { useState, useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { useAppContext } from '../AuthProvider/AuthProvider';


const Advertise = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    adv: false,
    blogs: false,
  });
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const blinkAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  const { isRegistered, setIsRegistered, setRegisteredData } = useAppContext();

  useEffect(() => {
    const blink = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    blink();
  }, [blinkAnim]);

  const handleCheckboxChange = key => {
    setSelectedOptions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // const checkRegistrationStatus = async () => {
  //   try { 
  //     if (!isRegistered) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Registration Required',
  //         text2: 'Please register your company to proceed.',
  //         position: 'top',
  //         visibilityTime: 2000,
  //       });
  //       navigation.navigate('RegisterPage');
  //     }
  //   } catch (error) {
  //     console.error('Registration check error:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error checking registration status',
  //       position: 'top',
  //       visibilityTime: 2000,
  //     });
  //   }
  // };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    try {
      if (!isRegistered) {
        Toast.show({
          type: 'error',
          text1: 'Registration Required',
          text2: 'Please register your company to proceed.',
          position: 'top',
          visibilityTime: 2000,
        });
        setTimeout(() => {
          navigation.navigate('RegisterPage');
        }, 1000);
        return;
      }
      setIsLoading(true);


      const selected = Object.entries(selectedOptions)
        .filter(([key, value]) => value)
        .map(([key]) => key);
      if (selected.length === 0) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Please select at least one option.',
          position: 'top',
          renderLeadingIcon: () => <Icon name="warning" size={20} color="#ff0000" />,
          style: {
            backgroundColor: '#ffe6e6',
            borderLeftColor: '#ff4d4d',
            borderLeftWidth: 4,
          },
          text1Style: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ff4d4d',
          },
          text2Style: {
            fontSize: 14,
            color: '#4d4d4d',
          },
          visibilityTime: 2000,
        });
        setIsLoading(false);
        return;
      }
      if (!description.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Please add a description.',
          position: 'top',
          visibilityTime: 1000,
        });
        setIsLoading(false);
        return;
      }

      const response = await api.submitServiceRequest(selected.join(', '), description);
      console.log('advertise response', response);

      if (response.status == 200) {
        Toast.show({
          type: 'success',
          text1: 'Your request was submitted successfully.',
          text2: `Selected: ${selected.join(', ')}`,
          position: 'top',
          visibilityTime: 1000,
        });
        setIsLoading(false);
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1000);
        return;
      }

      setSelectedOptions({ adv: false, blogs: false });
      setDescription('');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Failed to submit preferences. Please try again.',
        position: 'top',
        visibilityTime: 1000,
      });
    }

    Keyboard.dismiss();
  };

  const CustomCheckbox = ({ isChecked, label, onPress }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Text style={styles.checkboxTick}>✔</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo at the top with blinking animation */}


      {/* Content */}
      <View style={styles.content}>
        {/* <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../assets/logo.jpg')}
          style={[styles.logo, { opacity: blinkAnim }]}
        />
      </View> */}
        <Text style={styles.title}>Choose Your Preferences</Text>

        {/* Checkbox Options */}
        <View style={styles.optionsContainer}>
          <CustomCheckbox
            isChecked={selectedOptions.adv}
            label="Advertisement"
            onPress={() => handleCheckboxChange('adv')}
          />
          <CustomCheckbox
            isChecked={selectedOptions.blogs}
            label="Blogs"
            onPress={() => handleCheckboxChange('blogs')}
          />
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Enter your description"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" /> // Loading indicator
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Wave Background at the Bottom */}
      <View style={styles.waveContainer}>
        <View style={styles.wave}></View>
      </View>

      {/* back button */}
      <TouchableOpacity
        style={styles.icon}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={20} color="#dca818" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: -200,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  wave: {
    height: 120,
    backgroundColor: '#DCA818',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transform: [{ rotate: '0deg' }],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#026456',
    marginBottom: 40,
    textShadowColor: '#ffc0cb',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#DCA818',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxChecked: {
    backgroundColor: '#026456',
    borderColor: '#DCA818',
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    width: '90%',
  },
  descriptionTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    marginLeft: 5,
  },
  descriptionInput: {
    width: '100%',
    height: 100,
    borderWidth: 0.7,
    borderColor: '#DCA818',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
    shadowColor: '#DCA818',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 9,
    elevation: 10,
  },
  submitButton: {
    backgroundColor: '#026456',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: '#026456',
    borderRadius: 50,
    zIndex: 100,
  }
});

export default Advertise;
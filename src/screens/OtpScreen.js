import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { startOtpListener } from 'react-native-otp-verify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
 
const SESSION_KEY = 'user_session';
const OTP_TIMEOUT = 300; // 5 minutes in seconds
const STATIC_OTP = '123456';
 
const OTPScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Initialize 6 boxes for OTP
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_TIMEOUT);
  const [resendDisabled, setResendDisabled] = useState(true);
 
  // Create refs for each OTP input field
  const otpRefs = useRef([]);
  otpRefs.current = new Array(6).fill(null).map((_, i) => otpRefs.current[i] ?? React.createRef());

  useEffect(() => {
    const isOtpComplete = otp.every(digit => digit !== '');
    if (isOtpComplete && !loading) {
      handleVerifyOTP();
    }
  }, [otp]);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
 
    return () => clearInterval(interval);
  }, []);
 
  useEffect(() => {
    // Start listening for OTP
    startOtpListener((message) => {
      console.log('message', message);
      const extractedOtp = extractOtpFromMessage(message);
      if (extractedOtp) {
        fillOtpBoxes(extractedOtp);
      }
    });
 
    // Cleanup listener
    return () => {
      startOtpListener(null);
    };
  }, []);
 
  const extractOtpFromMessage = (message) => {
    const otpMatch = message.match(/\d{6}/); // Extract 6-digit OTP
    return otpMatch ? otpMatch[0] : '';
  };
 
  const fillOtpBoxes = (extractedOtp) => {
    const otpArray = extractedOtp.split('');
    setOtp(otpArray);
  };
 
  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
 
    // Move focus to the next input field
    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].current.focus();
    }
  };
 
  // Add new handleKeyPress function for backspace functionality
  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace') {
      const updatedOtp = [...otp];
     
      // If current input is empty and not the first input, move to previous
      if (!updatedOtp[index] && index > 0) {
        updatedOtp[index - 1] = '';
        setOtp(updatedOtp);
        otpRefs.current[index - 1].current.focus();
      } else {
        // Clear current input
        updatedOtp[index] = '';
        setOtp(updatedOtp);
      }
    }
  };
 
  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
 
    if (otpString.length !== STATIC_OTP.length) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
 
    try {
      setLoading(true);
      const emailOrPhone = route.params.emailOrPhone;
      const sessionData = await api.verifyOTP(emailOrPhone, otpString);
 
      console.log(sessionData);
     
      // Store session data
      await AsyncStorage.setItem(
        "contactno", sessionData.contactno
      );
 
      navigation.replace('Home');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', typeof error === 'string' ? error : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };
 
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await api.resendOTP(route.params.email);
      setTimer(OTP_TIMEOUT);
      setResendDisabled(true);
      Alert.alert('Success', 'New OTP has been sent');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };
 
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://img.freepik.com/premium-photo/gold-wedding-ring-with-diamond-green-background_921860-49666.jpg' }}
          style={styles.imageBackground}
        />
 
        <View style={styles.curveContainer}>
          <Text style={styles.title}>OTP Verification</Text>
 
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpBox}
                value={digit}
                maxLength={1}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(event) => handleKeyPress(event, index)} // Add onKeyPress handler
                keyboardType="numeric"
                ref={otpRefs.current[index]}
              />
            ))}
          </View>
 
          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>
              {loading ? 'Verifying...' : 'Verify'}
            </Text>
          </TouchableOpacity>
 
          <View style={styles.timerContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend OTP in: {formatTime(timer)}
              </Text>
            ) : (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOTP}
                disabled={resendDisabled}
              >
                <Text style={styles.resendButtonText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBackground: {
    width: '100%',
    height: '45%',
    resizeMode: 'cover',
  },
  curveContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: -80,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpBox: {
    width: 50,
    height: 50,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#026456',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1E8757',
    borderRadius: 5,
  },
  resendButtonText: {
    color: '#1E8757',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
    color: '#666',
  },
  linkText: {
    color: '#0',
    fontWeight: 'bold',
  },
});
 
export default OTPScreen;
 
 
 
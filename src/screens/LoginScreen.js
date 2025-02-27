import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
 
const LoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
 
  useEffect(() => {
    checkExistingSession();
  }, []);
 
  const checkExistingSession = async () => {
    try {
      const userCredential = await api.getCurrentUser();
      const isVerified = await AsyncStorage.getItem('isVerified');
 
      if (userCredential?.credential && isVerified === 'true') {
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setInitializing(false);
    }
  };
 
  const validateInput = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+91[0-9]{10,12}$/;
 
    if (value.includes('@')) {
      if (!emailRegex.test(value)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return false;
      }
    } else {
      if (!phoneRegex.test(value)) {
        Toast.show({
                type: 'error',
                text1: 'Invalid Phone Number',
                text2: 'Please enter a valid phone number (10-12 digits, optionally with + prefix)',
                visibilityTime: 2000,
              });
        return false;
      }
    }
    return true;
  };
 
  const handleLogin = async () => {
    if (!emailOrPhone.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your phone number',
        visibilityTime: 2000,
      });
      return;
    }
  
    if (!validateInput(emailOrPhone.trim())) {
      return;
    }
  
    try {
      setLoading(true);
      console.log('Attempting login with:', emailOrPhone.trim()); // Debug log
  
      const response = await api.login(emailOrPhone.trim());
      console.log('Login response:', response); // Debug log
  
      // Store the phone number
      await AsyncStorage.setItem('loginMethod', 'phone');
      
      // Navigate to OTP screen
      navigation.navigate('OTP', {
        emailOrPhone: emailOrPhone.trim(),
        method: 'sms'
      });
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'An error occurred during login. Please try again.',
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  
 
  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#026456" />
      </View>
    );
  }
 
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://img.freepik.com/premium-photo/gold-wedding-ring-with-diamond-green-background_921860-49666.jpg' }}
          style={styles.imageBackground}
        />
 
        <View style={styles.curveContainer}>
          <Image
            source={require('../assets/app_logo.png')}
            style={styles.logo}
          />
 
          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputContainer}>
            <View style={styles.prefixContainer}>
              <Text style={styles.prefixText}>+91</Text>
            </View>
            <TextInput
              style={styles.modifiedInput}
              value={emailOrPhone.replace('+91', '')}
              onChangeText={(text) => setEmailOrPhone('+91' + text)}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              textAlign="left"
              maxLength={10}
              scrollEnabled={false}
              multiline={false}
              textAlignVertical="center"
            />
          </View>
 
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                termsAccepted && styles.checkboxSelected
              ]}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I agree to the{' '}
              <Text
                style={styles.linkText}
                onPress={() => setShowTermsModal(true)}
              >
                Terms & Services
              </Text>
            </Text>
          </View>
 
          <TouchableOpacity
            style={[
              styles.button,
              !termsAccepted && { backgroundColor: '#D3D3D3' }
            ]}
            onPress={handleLogin}
            disabled={!termsAccepted || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
 
          <Modal
            visible={showTermsModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTermsModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView
                  style={styles.container1}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.header}>Terms and Conditions</Text>
 
                  <View style={styles.divider} />
 
                  <Text style={styles.sectionTitle}>1. Introduction</Text>
                  <Text style={styles.paragraph}>
                    Welcome to Ozaveria. This platform enables sellers to list and offer products (jewelry) to buyers without direct intervention from Ozaveria.
                  </Text>
 
                  <Text style={styles.sectionTitle}>2. Information Collection</Text>
                  <Text style={styles.paragraph}>
                    We collect various types of information, including:
                    - Registration Information (name, address, contact details)
                    - Account Information (payment and billing details)
                    - Activities Information (transaction and communication records)
                    - Browsing Information (IP addresses, usage patterns)
                  </Text>
 
                  <Text style={styles.sectionTitle}>3. Use of Information</Text>
                  <Text style={styles.paragraph}>
                  User(s) privacy is important to Ozaveria and Ozaveria have taken steps to ensure that Ozaveria do not collect more information from User than is necessary for Ozaveria to provide User(s) with Ozaveria’s services and to protect User(s) account.
                  Information including, but not limited to, User(s) name, address, phone number, fax number, email address, gender, date and/or year of birth and user preferences ("Registration Information") may be collected at the time of User registration on the Platform.
                  </Text>
 
                  <Text style={styles.sectionTitle}>4. Information Disclosure</Text>
                  <Text style={styles.paragraph}>
                  User(s) further agrees that Ozaveria may disclose and transfer User(s) Data to third party service providers (including but not limited to data entry, database management, promotions, products and services alerts, delivery services, payment extension services, authentication and verification services and logistics services) ("Service Providers"). These Service Providers are under a duty of confidentiality to Ozaveria and are only permitted to use User(s) Data in connection with the purposes specified in clause 2 herein above.
                  User(s) agree that Ozaveria may disclose and transfer User(s) Data to Ozaveria’s affiliated companies and/or their designated Service Providers.
                  </Text>
 
                  <Text style={styles.sectionTitle}>5. User Rights</Text>
                  <Text style={styles.paragraph}>
                  Ozaveria retains your personal information in accordance with applicable laws, for a period no longer than is required for the purpose for which it was collected or as required under any applicable law
                  </Text>
 
                  <Text style={styles.sectionTitle}>6. Cookies</Text>
                  <Text style={styles.paragraph}>
                  Ozaveria uses "cookies" to store specific information about User(s) and track User(s) visits to the Sites. A "cookie" is a small amount of data that is sent to User’s browser and stored on User’s device. If User does not deactivate or erase the cookie, each time User uses the same device to access the Platform, our services will be notified of User visit to the Platform and in turn Ozaveria may have knowledge of User(s) visit and the pattern of User’s usage.
                  </Text>
 
                  <Text style={styles.sectionTitle}>7. Security</Text>
                  <Text style={styles.paragraph}>
                  Ozaveria employs commercially reasonable security methods to prevent unauthorized access to the Platform, to maintain data accuracy and to ensure the correct use of the information Ozaveria holds. No data transmission over the internet or any wireless network can be guaranteed to be perfectly secure. As a result, while Ozaveria tries to protect the information Ozaveria holds, Ozaveria cannot guarantee the security of any information the User transmits to Ozaveria and User(s) do so at their own risk.
                  </Text>
 
                  <Text style={styles.sectionTitle}>8. Minors</Text>
                  <Text style={styles.paragraph}>
                  The Platform and its contents are not targeted to minors (those under the age of 18). However, Ozaveria has no way of distinguishing the age of individuals who access our Platform. If a minor has provided Ozaveria with personal information without parental or guardian consent, the parent or guardian should contact Ozaveria’s Legal Department at the address set out in clause 11 below to remove the information.
                  </Text>
 
                  <Text style={styles.sectionTitle}>9. Policy Changes</Text>
                  <Text style={styles.paragraph}>
                  Any changes to this Privacy Policy will be communicated by us posting an amended and restated Privacy Policy on the Platform. Once posted on the Platform the new Privacy Policy will be effective immediately. Your continued use of the Platform shall be deemed to be your acceptance to the provisions of the Privacy Policy. User(s) agrees that any information Ozaveria hold about User (as described in this Privacy Policy and whether or not collected prior to or after the new Privacy Policy became effective) will be governed by the latest version of the Privacy Policy.
 
 
                  </Text>
 
                  <View style={{ height: 50 }} />
                </ScrollView>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowTermsModal(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
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
    marginBottom: -50,
    padding: 20,
    elevation: 5,
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: -140,
  },
  label: {
    marginTop: -50,
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    marginBottom: 8,
  },
  inputBox: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 9,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#026456',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
    color: '#666',
  },
  linkText: {
    color: '#026456',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 9,
    marginBottom: 20,
    height: 40,
  },
  prefixContainer: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
    borderRightWidth: 1,
    borderRightColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  prefixText: {
    fontSize: 16,
    color: '#c0c0c0',
    fontWeight: '500',
    textAlignVertical: 'center',
    marginBottom:3,
  },
  modifiedInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    paddingHorizontal: 10,
    textAlignVertical: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#666',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#026456',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
  },
  checkboxText: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxHeight: '80%',
  },
  // New styles for Terms Modal
  container1: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#026456',
    textAlign: 'center',
    marginBottom: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#026456',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#026456',
    marginTop: 5,
    marginBottom: 1,
  },
  paragraph: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 1,
    lineHeight: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#026456',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: -30,
    backgroundColor: '#026456',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
});
 
export default LoginScreen;
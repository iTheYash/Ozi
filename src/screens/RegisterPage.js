import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  Button,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchCamera } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';
import MLKitOcr from 'react-native-mlkit-ocr';
import axios from 'axios';
import CheckBox from '@react-native-community/checkbox';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';

// import TextDetector from 'react-native-text-detector';

const GROQ_API_KEY = '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';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    businessType: '',
    gstNo: '',
    pinCode: '',
    registerAddress: '',
    registerAddress2: '',
    emailAddress: '',
    emailAddress2: '',
    state: '',
    city: '',
    contactNo: '',
    ownerName: '',
    companyName: '',
  });

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [cameraUri, setCameraUri] = useState(null);
  const [isRolePickerVisible, setIsRolePickerVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // For custom modal
  const [tempMemberNumber, setTempMemberNumber] = useState(''); // Temporary input for the modal
  const [dynamicInputs, setDynamicInputs] = useState([]); // State for dynamic input fields
  const [recognizedText, setRecognizedText] = useState('');
  const [ocrProcessing, setOcrProcessing] = useState(false); // Track OCR processing state
  const [gstData, setGstData] = useState({ gstNo: '' }); // Store GST data
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [isDifferent, setIsDifferent] = useState(false);
  const [showAddress2, setShowAddress2] = useState(false);
  const [isBusinessTypeModalVisible, setBusinessTypeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const navigation = useNavigation();

  const BusinessTypeModal = ({ visible, onClose, onSelect, selectedValue }) => {
    const businessTypes = [
      // { label: "Select Nature of Business", value: "" },
      { label: 'Retail', value: 'Retail' },
      { label: 'Distributer', value: 'Distributer' },
      { label: 'Manufacture', value: 'Manufacture' },
      { label: 'Other', value: 'Other' },
    ];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Nature of Business</Text>

            <ScrollView style={styles.optionsContainer}>
              {businessTypes.map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.optionItem,
                    selectedValue === type.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onSelect(type.value);
                    onClose();
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === type.value && styles.selectedOptionText,
                    ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };



  const validateForm = () => {
    const newErrors = {};

    console.log('Form Data:', formData);
    console.log('Recognized Text (GST Number):', recognizedText);

    if (!formData.businessType?.trim()) {
      console.log('Business Type is missing');
      newErrors.businessType = 'This field is required.';
    }
    if (!recognizedText?.trim()) {
      console.log('GST Number is missing');
      newErrors.gstNo = 'This field is required.';
    }

    if (!formData.registerAddress?.trim()) {
      console.log('Register Address is missing');
      newErrors.registerAddress = 'This field is required.';
    }
    // if (!formData.employeeName?.trim()) {
    //   console.log('Employee Name is missing');
    //   newErrors.employeeName = 'This field is required.';
    // }
    if (!formData.emailAddress?.trim()) {
      console.log('Email Address is missing');
      newErrors.emailAddress = 'This field is required.';
    }
    if (!formData.state?.trim()) {
      console.log('State is missing');
      newErrors.state = 'This field is required.';
    }
    if (!formData.city?.trim()) {
      console.log('City is missing');
      newErrors.city = 'This field is required.';
    }
    if (!formData.contactNo?.trim()) {
      console.log('Contact Number is missing');
      newErrors.contactNo = 'This field is required.';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = () => {
  //   if (validateForm()) {
  //     // Submit the form
  //     console.log('Form submitted:', formData);
  //   } else {
  //     Alert.alert('Validation Error', 'Please fill all required fields.');
  //   }
  // };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    if (validateForm()) {
      try {
        console.log('Form Data:', formData);
        console.log('Hidden Field Value (Recognized Text):', recognizedText);

        const response = await api.registerBusiness(formData);

        if (response.ok || response.status === 201) {
          Toast.show({
            type: 'success',
            text1: 'Registration Successfull',
            position: 'top',
            visibilityTime: 2000, // Increased visibility time
          });
          setSubmitLoading(false)
          // Add a small delay to ensure Toast is visible before navigation
          setTimeout(() => {
            navigation.navigate('Home');
          }, 2000);
        } else {
          // Handle error response
          Toast.show({
            type: 'error',
            text1: 'Submission Failed',
            text2: response.data?.message || 'An error occurred.',
            position: 'top',
            visibilityTime: 2000,
          });
          setSubmitLoading(false)
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        Toast.show({
          type: 'error',
          text1: 'Submission Error',
          text2: 'An unexpected error occurred.',
          position: 'top',
          visibilityTime: 2000,
        });
        setSubmitLoading(false)
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields.',
        position: 'top',
        visibilityTime: 2000, // Increased visibility time
      });
      setSubmitLoading(false)
    }
  };

  const handleInputChange = (field, value) => {
    setGstData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleInputChange1 = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      gstNo: recognizedText,
      [field]: value,
    }));
  };

  const handleCapture = async () => {
    setOcrProcessing(true); // Set processing to true when starting
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
    });

    if (result.assets && result.assets[0]?.uri) {
      try {
        const text = await MLKitOcr.detectFromUri(result.assets[0].uri);
        const recognizedText = text?.[0]?.text || 'No text found';
        setRecognizedText(recognizedText); // Set recognized text
        handleInputChange('gstNo', recognizedText); // Update GST input field with recognized text

        // Call API to fetch data using the recognized GST number
        fetchGSTData(recognizedText); // Use the recognized text as the GST number for API call
      } catch (error) {
        console.error('Error during OCR:', error);
        setRecognizedText('Failed to recognize text');
      }
    }
    setOcrProcessing(false); // Set processing to false after OCR
  };

  const handleFetchedData = data => {
    setFormData({
      ...formData,
      registerAddress: data.adr, // Address field
      state: data.stcd, // State code field
      city: data.dst, // District field
      companyName: data.lgnm,
      pinCode: data.pncd,
    });
    setGstData(data); // Store the fetched GST data
    setLoading(false);
  };

  const fetchGSTData = async gstNumber => {

    try {
      // Preprocess GST number: Remove spaces and normalize text
      const cleanedGSTNumber = gstNumber.replace(/\s+/g, '').trim();

      const response = await fetch(
        `http://sheet.gstincheck.co.in/check/5626f57400801d94580b75889c224ea2/${cleanedGSTNumber}`,
      );

      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const json = await response.json();
      console.log('API Response:', json);

      if (!json.data || !json.data.pradr || !json.data.pradr.addr) {
        throw new Error('Invalid data received');
      }

      const extractedData = {
        adr: json.data.pradr.adr || 'Address not available',
        stcd: json.data.pradr.addr.stcd || 'State code not available',
        dst: json.data.pradr.addr.dst || 'District not available',
        st: json.data.pradr.addr.st || 'State not available',
        lgnm: json.data.lgnm || 'company name  not avilable',
        pncd: json.data.pradr.addr.pncd || 'pin code not avilable',
      };

      handleFetchedData(extractedData); // Call the function to update form data
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  // add

  // Add this new function to check GST registration status
  const checkGSTRegistration = async gstNumber => {
    try {
      const response = await api.isGSTRegistered(gstNumber)
      // const result = await response.json();
      return response.isRegistered;
    } catch (error) {
      console.error('Error checking GST registration:', error);
      throw error;
    }
  };

  const handleCapture1 = async () => {
    setOcrProcessing(true);
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (result.assets && result.assets[0]?.uri) {
        try {
          // Using MLKitOcr for text detection
          const textBlocks = await MLKitOcr.detectFromUri(result.assets[0].uri);

          // Extract text from all blocks and join them
          const fullText = textBlocks.map(block => block.text).join(' ');

          // GST number regex pattern
          const gstPattern =
            /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9A-Z]{1}\b/;
          const gstMatch = fullText.match(gstPattern);

          if (gstMatch) {
            const gstNumber = gstMatch[0];

            // Check if GST is already registered
            const isGSTRegistered = await checkGSTRegistration(gstNumber);

            if (isGSTRegistered) {
              Toast.show({
                type: 'error',
                text1: 'GST Already Registered',
                text2: 'This GST number is already registered in our system.',
                position: 'top',
                visibilityTime: 2000,
              });
              setRecognizedText('');
              return;
            } else {
              setRecognizedText(gstNumber);
              handleInputChange1('gstNo', gstNumber);
              // Fetch GST data if a valid number is found
              await fetchGSTData(gstNumber);
            }

          } else {
            Toast.show({
              type: 'error',
              text1: 'GST Not Found',
              text2: 'Could not detect a valid GST number in the image. Please try again or enter manually.',
              position: 'top',
              visibilityTime: 2000,
            });
            return;
          }
        } catch (ocrError) {
          console.error('OCR Processing Error:', ocrError);
          Toast.show({
            type: 'error',
            text1: 'OCR Error',
            text2: 'Failed to process the image. Please try again or enter the GST number manually.',
            position: 'top',
            visibilityTime: 2000,
          });
          return;

        }
      }
    } catch (cameraError) {
      console.error('Camera Error:', cameraError);
      Toast.show({
        type: 'error',
        text1: 'Camera Error',
        text2: 'Failed to capture image. Please check camera permissions and try again.',
        position: 'top',
        visibilityTime: 2000,
      });
      return;
    } finally {
      setOcrProcessing(false);
    }
  };

  const detectGSTNumber = async imageUri => {
    try {
      setIsProcessing(true);
      console.log('Starting GST detection for image:', imageUri);

      const response = await fetch(imageUri);
      console.log('Fetch response status:', response.status);
      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'bytes');
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('FileReader completed');
          const base64data = reader.result.split(',')[1]; // Extracting base64 data
          console.log('Base64 conversion successful');
          resolve(base64data);
        };
        reader.onerror = () => {
          console.error('FileReader failed');
          reject(new Error('FileReader failed'));
        };
        reader.readAsDataURL(blob);
      });

      console.log('Preparing API request to Groq...');

      const payload = {
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: 'user',
            content:
              "Please analyze this image and extract the GST number if present. GST numbers in India follow the format: 2 digits state code + 10 digits PAN + 1 digit entity number + 1 digit checksum. For example: 29ABCDE1234F1Z5. Only return the GST number if you're highly confident it's correct.",
          },
          {
            role: 'user',
            content: `data:image/jpeg;base64,${base64Image}`, // Directly using the base64 data
          },
        ],
        max_tokens: 1024,
        temperature: 0.5,
      };

      console.log('Sending request to Groq API...');
      const groqResponse = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error('Groq API error:', errorText);
        throw new Error(`Groq API failed: ${groqResponse.status} ${errorText}`);
      }

      const data = await groqResponse.json();
      console.log('Groq API full response:', data);

      const detectedGST = data.choices[0].message.content;
      if (detectedGST) {
        console.log('✅ GST number detected:', detectedGST);
        console.log('GST Detection Analysis Results:');
        console.log('--------------------------------');
        console.log('Raw text extracted:', detectedGST);
      } else {
        console.log('❌ No GST number found in response');
      }
    } catch (error) {
      console.error('🚫 GST Detection Error:', error);
      console.error('Stack trace:', error.stack);
    } finally {
      setIsProcessing(false);
      console.log('GST detection process completed');
    }
  };
  // Handle manual GST entry
  const handleGSTInput = async text => {
    setRecognizedText(text); // Update State

    // When 15 characters are entered, validate and fetch data
    if (text.length === 15) {
      const gstPattern =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9A-Z]{1}$/;

      if (gstPattern.test(text)) {
        await fetchGSTData(text); // Fetch GST Data if valid
      } else {
        Alert.alert('Invalid GST Number', 'Please enter a valid GST number.');
      }
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'We need access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          openCamera();
        } else {
          Alert.alert(
            'Permission Denied',
            'You need to give camera permission to take a photo',
          );
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to request camera permission');
      }
    } else {
      openCamera();
    }
  };

  const CustomCheckbox = ({ isChecked, label, onPress }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Text style={styles.checkboxTick}>✔</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const openCamera = async () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
      quality: 0.8,
      includeBase64: false,
    };

    try {
      const result = await launchCamera(options);

      if (result.didCancel) {
        console.log('User cancelled camera');
        Alert.alert(
          'Cancelled',
          'Camera was closed without capturing an image.',
        );
      } else if (result.errorCode) {
        console.error('Camera error:', result.errorCode, result.errorMessage);
        Alert.alert('Camera Error', `Error: ${result.errorMessage}`);
      } else if (result.assets && result.assets[0]) {
        console.log('Image captured:', result.assets[0]);
        const uri = result.assets[0].uri;
        setCameraUri(uri);
        detectGSTNumber(uri);
      } else {
        console.error('No image data received');
        Alert.alert('Error', 'No image was captured. Please try again.');
      }
    } catch (error) {
      console.error('Camera operation error:', error);
      Alert.alert(
        'Error',
        'Something went wrong while using the camera. Please try again.',
      );
    }
  };

  const handleVerify = () => {
    // Validate required fields
    const requiredFields = [
      'businessType',
      'gstNo',
      'userRole',
      'registerAddress',
      'employeeName',
      'emailAddress',
      'state',
      'city',
      'contactNo',
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields before verifying.',
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Validate contact number (assuming Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contactNo)) {
      Alert.alert(
        'Invalid Contact Number',
        'Please enter a valid 10-digit mobile number.',
      );
      return;
    }

    // Validate GST number format
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!gstRegex.test(formData.gstNo)) {
      Alert.alert('Invalid GST Number', 'Please enter a valid GST number.');
      return;
    }

    // If all validations pass, proceed with verification
    Alert.alert('Success', 'Details verified successfully!');
    // Add your API call or navigation logic here
  };

  if (loading) {
    <ActivityIndicator color="#206456" style={styles.processing} />
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo2.png')} style={styles.logo} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to Ozaveria</Text>
          <Text style={styles.instructionsText}>
            Please fill in the below details and verify your Account
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {' '}
                Owner Name <Text style={styles.required}>*</Text>
              </Text>
            </View>

            <TextInput
              placeholder=" Owner Name"
              style={styles.textInput}
              value={formData.ownerName}
              onChangeText={value => handleInputChange1('ownerName', value)}
              maxLength={50}
              editable={!submitloading}
            />
            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  Nature of Business<Text style={styles.required}>*</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setBusinessTypeModalVisible(true)}
                style={styles.textInput}>
                <View style={styles.dropdowncontainer}>
                  <Text
                    style={[
                      styles.pickerText,
                      !formData.businessType && styles.placeholderText,
                    ]}>
                    {formData.businessType || 'Select Nature of Business'}
                  </Text>
                  <Text style={styles.dropdownSymbol}>▼</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Add the modal component */}
            <BusinessTypeModal
              visible={isBusinessTypeModalVisible}
              onClose={() => setBusinessTypeModalVisible(false)}
              onSelect={value => {
                handleInputChange1('businessType', value);
                setBusinessTypeModalVisible(false);
              }}
              selectedValue={formData.businessType}
            />
          </View>


          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Contact No <Text style={styles.required}>*</Text>
              </Text>
            </View>

            <TextInput
              placeholder="Contact No"
              style={styles.textInput}
              value={formData.contactNo}
              onChangeText={value => handleInputChange1('contactNo', value)}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!submitloading}
            />
            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  GST No<Text style={styles.required}>*</Text>
                </Text>
              </View>
              <TextInput
                placeholder="Enter GST No"
                style={[
                  styles.textInput,
                  (ocrProcessing || loading) && styles.processingInput,
                ]}
                value={recognizedText}
                onChangeText={async value => {
                  console.log('GST Input Value:', value);
                  setRecognizedText(value);
                  handleInputChange1('gstNo', value);

                  if (value.length === 15) {
                    const gstPattern =
                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9A-Z]{1}$/;
                    if (gstPattern.test(value)) {
                      // If not registered, proceed with fetching GST data
                      console.log('gst text', value);
                      setLoading(true)
                      Keyboard.dismiss();
                      const isGSTRegistered = await checkGSTRegistration(value);
                      if (isGSTRegistered) {
                        setLoading(false);
                        Toast.show({
                          type: 'error',
                          text1: 'GST Already Registered',
                          text2: 'This GST number is already registered in our system.',
                          position: 'top',
                          visibilityTime: 2000,
                        });
                        setRecognizedText('');
                        return;
                      } else {
                        await fetchGSTData(value);
                      }
                    }
                  } else {
                    Toast.show({
                      type: 'error',
                      text1: 'Invalid GST Number',
                      text2: 'Please enter a valid GST number.',
                      position: 'top',
                      visibilityTime: 2000,
                    });
                  }
                }
                }
                editable={!ocrProcessing || !submitloading}
                
              />
              {/* // {errors.gstNo && <Text style={styles.errorText}>{errors.gstNo}</Text>} */}
            </View>

            <TextInput
              style={{ display: 'none' }} // Hide this input
              value={recognizedText} // Bind the hidden field to recognizedText
              editable={false} // Make it read-only
            />

            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={async () => {
                await handleCapture1(); // Perform OCR
                handleInputChange1('gstNo', recognizedText); // Sync the recognized GST number with formData
                console.log('Updated GST No in Form Data:', formData.gstNo);
              }}
              disabled={ocrProcessing || loading}>
              {ocrProcessing || loading ? (
                <ActivityIndicator color="#206456" style={styles.processing} />
              ) : (
                <Feather name='camera' width={24} color={'#206456'} style={styles.cameraIcon} />
              )}
            </TouchableOpacity>
            {/* Display the recognized text */}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {' '}
                Company Name <Text style={styles.required}>*</Text>
              </Text>
            </View>

            <TextInput
              placeholder=" Company Name"
              style={styles.textInput}
              value={formData.companyName}
              onChangeText={value => handleInputChange1('companyName', value)}
              keyboardType="phone-pad"
              maxLength={50}
              editable={!submitloading}
            />
            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Register Address<Text style={styles.required}>*</Text>
              </Text>
            </View>

            <TextInput
              placeholder="Register Address"
              style={styles.textInput}
              value={formData.registerAddress}
              onChangeText={value =>
                handleInputChange1('registerAddress', value)
              }
              editable={false}
              multiline={true}
              numberOfLines={3} // Optionally set a specific number of lines
            />
            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>
          {/* Checkbox for showing Register Address 2 */}
          {/* Custom Checkbox */}
          <CustomCheckbox
            isChecked={showAddress2}
            label="Register Address 2 is different"
            onPress={() => setShowAddress2(!showAddress2)}
          />

          {/* Conditionally render the Register Address 2 field */}
          {showAddress2 && (
            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Current Address (Optional)</Text>
              </View>
              <TextInput
                placeholder="Register Address 2"
                style={styles.textInput}
                value={formData.registerAddress2}
                onChangeText={value =>
                  handleInputChange1('registerAddress2', value)
                }
                multiline={true}
              editable={!submitloading}
              />
            </View>
          )}

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {' '}
                Company Email Address <Text style={styles.required}>*</Text>
              </Text>
            </View>
            <TextInput
              placeholder=" Company Email Address"
              style={styles.textInput}
              value={formData.emailAddress}
              onChangeText={value => handleInputChange1('emailAddress', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!submitloading}
            />
            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {' '}
                Personal Email Address (optional){' '}
              </Text>
            </View>
            <TextInput
              placeholder=" Personal Email Address"
              style={styles.textInput}
              value={formData.emailAddress2}
              onChangeText={value => handleInputChange1('emailAddress2', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!submitloading}
            />
            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                State <Text style={styles.required}>*</Text>
              </Text>
            </View>
            <TextInput
              placeholder="State"
              style={styles.textInput}
              value={formData.state}
              onChangeText={value => handleInputChange1('state', value)}
              editable={!submitloading}
            />

            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                City <Text style={styles.required}>*</Text>
              </Text>
            </View>

            <TextInput
              placeholder="City"
              style={styles.textInput}
              value={formData.city}
              onChangeText={value => handleInputChange1('city', value)}
              editable={!submitloading}
            />
            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Pincode <Text style={styles.required}>*</Text>
              </Text>
            </View>

            <TextInput
              placeholder="Pincode"
              style={styles.textInput}
              value={formData.pinCode}
              onChangeText={value => handleInputChange1('pinCode', value)}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!submitloading}
            />
            {/* {errors.registerAddress && <Text style={styles.errorText}>{errors.registerAddress}</Text>} */}
          </View>

          {cameraUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: cameraUri }} style={styles.capturedImage} />
            </View>
          )}

          {/* <TouchableOpacity style={styles.verifyButton} onPress={handleCapture1}> */}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleSubmit}
            disabled={submitloading}
          >
            {submitloading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  contentWrapper: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: -50,
    marginTop: -70,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  successMessage: {
    marginTop: 10,
    fontSize: 14,
    color: 'green', // Green color for success
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#206456',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: -8,
  },
  instructionsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  pickerContainer: {
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginTop: -3,
  },
  processingInput: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  dynamicInput: {
    marginBottom: 10, // Adjust spacing here
  },

  cameraIcon: {
    fontSize: 24,
    marginTop: 10,
  },
  picker: {
    position: 'absolute',
    width: '100%',
    height: 48,
    opacity: 0,
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  dropdownSymbol: {
    fontSize: 16,
    color: '#206456',
    marginTop: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  capturedImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  verifyButton: {
    backgroundColor: '#206456',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  verifyButtonText: {
    color: '#026456',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalOverlay: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fieldContainer: {
    marginBottom: -10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  required: {
    color: 'red',
    marginLeft: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  verifyButton: {
    backgroundColor: '#206456',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#206456',
    borderColor: '#206456',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#206456',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#e6f3f1',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#206456',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#206456',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  dropdowncontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownSymbol: {
    fontSize: 16,
    color: '#206456',
    marginLeft: -15
  },
  cameraIcon: {
    fontSize: 24,
    marginTop: 14,
  },
  processing: {
    marginTop: 15,
  },
});

export default RegisterPage;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Modal,
  FlatList,
  useColorScheme
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../services/api';
import Toast from 'react-native-toast-message';
import { useAppContext } from '../AuthProvider/AuthProvider';

const { width } = Dimensions.get('window');
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/heic'];
const MAX_IMAGES = 3;
const PURITY_ROWS = {
  row1: [23, 22, 21, 20],
  row2: [18, 16, 14, 12],
  row3: [10]
};
// const DIAMOND_QUALITY = {
//   row1: ["Mined", "Lab Grown", "CZ", "Swarovski", "AD"],
// }

const DEFAULT_CATEGORIES = [
  'Ring',
  'Chain',
  'Mangalsutra',
  'Necklace Set',
  'Bangle',
  'Earring',
  'Bracelet',
  'Anklet',
  'Other',
];

const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

  PushNotification.createChannel(
    {
      channelId: "upload-notifications",
      channelName: "Upload Notifications",
      channelDescription: "Notifications for product upload status",
      playSound: true,
      soundName: "default",
      importance: 4,
      vibrate: true,
    }
  );
};

const showNotification = (title, message, type = 'success') => {
  PushNotification.localNotification({
    channelId: "upload-notifications",
    title: title,
    message: message,
    playSound: true,
    soundName: "default",
    priority: "high",
    vibrate: true,
  });
};

const UploadScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [category, setCategory] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [purity, setPurity] = useState(23);
  // const[diamondquality, setDiamondQuality] = useState('');
  const [hallmarkNumber, setHallmarkNumber] = useState('');
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCredential, setUserCredential] = useState(null);
  const [isImagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  const { registeredData } = useAppContext();

  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   checkAuthStatus();
  //   configurePushNotifications();
  // }, []);

  // const checkAuthStatus = async () => {
  //   try {
  //     const phone = await AsyncStorage.getItem('contactno');
  //     const isVerified = await AsyncStorage.getItem('isVerified');

  //     if (!phone || isVerified !== 'true') {
  //       navigation.replace('Login');
  //       return;
  //     }

  //     setUserCredential(phone);
  //   } catch (error) {
  //     console.error('Auth check failed:', error);
  //     navigation.replace('Login');
  //   }
  // };

  const generateProductCode = (companyName) => {
    // Get initials from company name
    const initials = companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 3)
      .padEnd(3, 'X'); // Pad with 'X' if less than 3 characters

    // Generate 6 random alphanumeric characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 3; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Combine with # prefix
    return `#${initials}${randomPart}`;
  };


  const validateImage = (images) => {
    if (!images) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Image',
        text2: 'Please select a valid image',
        visibilityTime: 2000,
      });
      return false;
    }

    if (images.fileSize > MAX_IMAGE_SIZE) {
      Toast.show({
        type: 'error',
        text1: 'Image Too Large',
        text2: `Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
        visibilityTime: 2000,
      });
      return false;
    }

    const fileType = images.type?.toLowerCase();
    if (!fileType || !SUPPORTED_FORMATS.includes(fileType)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Format',
        text2: `Please use: ${SUPPORTED_FORMATS.join(', ')}`,
        visibilityTime: 2000,
      });
      return false;
    }

    if (images.height && images.width) {
      if (images.height > 4096 || images.width > 4096) {
        Toast.show({
          type: 'error',
          text1: 'Image Too Large',
          text2: 'Maximum size is 4096x4096 pixels',
          visibilityTime: 2000,
        });
        return false;
      }
      if (images.height < 200 || images.width < 200) {
        Toast.show({
          type: 'error',
          text1: 'Image Too Small',
          text2: 'Minimum size is 200x200 pixels',
          visibilityTime: 2000,
        });
        return false;
      }
    }

    return true;
  };

  const handleImagePickerResponse = async (response) => {
    try {
      if (response.didCancel) return;
      if (response.error) throw new Error(response.error);

      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        if (!validateImage(selectedImage)) return;

        if (images.length >= MAX_IMAGES) {
          Toast.show({
            type: 'error',
            text1: 'Maximum Images',
            text2: `Maximum ${MAX_IMAGES} images allowed`,
            visibilityTime: 2000,
          });
          return;
        }

        setImages(prevImages => [...prevImages, selectedImage]);
        Toast.show({
          type: 'success',
          text1: 'Image Added',
          text2: 'Image successfully added',
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        visibilityTime: 2000,
      });
    }
  };


  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const showImagePicker = () => {
    if (images.length >= MAX_IMAGES) {
      Toast.show({
        type: 'error',
        text1: 'Maximum Images',
        text2: `Maximum ${MAX_IMAGES} images allowed`,
        visibilityTime: 2000,
      });
      return;
    }
    setImagePickerModalVisible(true);
  };

  const handleCameraSelection = () => {
    setImagePickerModalVisible(false);
    launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxHeight: 1024,
      maxWidth: 1024,
      saveToPhotos: true,
    }, handleImagePickerResponse);
  };

  const handleGallerySelection = () => {
    setImagePickerModalVisible(false);
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxHeight: 1024,
      maxWidth: 1024,
      selectionLimit: 1,
    }, handleImagePickerResponse);
  };

  // Add ImagePickerModal component
  const ImagePickerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isImagePickerModalVisible}
      onRequestClose={() => setImagePickerModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setImagePickerModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleCameraSelection}
            >
              <Icon name="camera-outline" size={24} color="#026456" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleGallerySelection}
            >
              <Icon name="images-outline" size={24} color="#026456" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setImagePickerModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  //category selection

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setCategoryModalVisible(false);
  };

  const CategoryInput = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Category</Text>
      <TouchableOpacity
        style={styles.categoryInputButton}
        onPress={() => setCategoryModalVisible(true)}
        disabled={loading}
      >
        <Text style={[
          styles.categoryInputText,
          !category && styles.categoryInputPlaceholder
        ]}>
          {category || 'Select Category'}
        </Text>
        <Icon name="chevron-down-outline" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const CategoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isCategoryModalVisible}
      onRequestClose={() => setCategoryModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>

            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryGridItem,
                    category === cat && styles.selectedCategoryGridItem
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                >
                  <Text
                    style={[
                      styles.categoryGridText,
                      category === cat && styles.selectedCategoryGridText
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCategoryModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  //weight

  const setGrossWeight1 = (text) => {
    // Remove unwanted characters "-" and ","
    const cleanedText = text.replace(/[-,]/g, '');
    setGrossWeight(cleanedText);
  };

  const setNetWeight1 = (text) => {
    // Remove unwanted characters "-" and ","
    const cleanedText = text.replace(/[-,]/g, '');
    setNetWeight(cleanedText);
  };

  const setPrice1 = (text) => {
    // Remove unwanted characters "-" and ","
    const cleanedText = text.replace(/[-,]/g, '');
    setPrice(cleanedText);
  };

  // const setDiscount1 = (value) => {
  //   // Remove any non-numeric characters
  //   const numericValue = value.replace(/[^0-9]/g, '');

  //   // Convert to number and check if it's <= 100
  //   const number = parseInt(numericValue, 10);
  //   if (!isNaN(number) && number <= 100) {
  //     setDiscount(numericValue);
  //   } else if (numericValue === '') {
  //     // Allow empty input for clearing
  //     setDiscount('');
  //   }
  // };

  const setDiscount1 = (value) => {
    // Remove any non-numeric characters except decimal point
    let cleanValue = value.replace(/[^0-9.]/g, '');

    // Handle multiple decimal points - keep only the first one
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts[1];
    }

    // If string starts with a decimal, add leading zero
    if (cleanValue.startsWith('.')) {
      cleanValue = '0' + cleanValue;
    }

    // Convert to number for validation
    const number = parseFloat(cleanValue);

    if (cleanValue === '' || cleanValue === '0.') {
      // Allow empty input and starting decimal numbers
      setDiscount(cleanValue);
    } else if (!isNaN(number) && number <= 100) {
      if (cleanValue.includes('.')) {
        const [whole, decimal = ''] = cleanValue.split('.');
        // Only format decimals if they exist in input
        if (decimal !== '') {
          // Pad with zeros if less than 2 digits, or truncate if more
          const formattedDecimal = decimal.padEnd(2, '0').slice(0, 2);
          cleanValue = `${whole}.${formattedDecimal}`;
        }
      }
      setDiscount(cleanValue);
    }
  };

  // const setDiscount1 = (value) => {
  //   // Remove any non-numeric characters except decimal point
  //   // Allow only one decimal point
  //   let cleanValue = value.replace(/[^0-9.^0-9]/g, '');

  //   // Handle multiple decimal points - keep only the first one
  //   const decimalPoints = cleanValue.match(/\./g);
  //   if (decimalPoints && decimalPoints.length > 1) {
  //     const parts = cleanValue.split('.');
  //     cleanValue = parts[0] + '.' + parts.slice(1).join('');
  //   }

  //   // Convert to number and check if it's <= 100
  //   const number = parseFloat(cleanValue);

  //   if (cleanValue === '' || cleanValue === '.') {
  //     // Allow empty input and single decimal point for starting decimal numbers
  //     setDiscount(cleanValue);
  //   } else if (!isNaN(number) && number <= 100) {
  //     // Limit to 2 decimal places
  //     if (cleanValue.includes('.')) {
  //       const [whole, decimal] = cleanValue.split('.');
  //       if (decimal && decimal.length > 2) {
  //         cleanValue = `${whole}.${decimal.slice(0, 2)}`;
  //       }
  //     }
  //     setDiscount(cleanValue);
  //   }
  // };


  const validateForm = () => {
    // if (!image) throw new Error('Please select a product image');
    if (images.length === 0) throw new Error('Please select at least one product image');
    if (!name.trim()) throw new Error('Please enter a product name');
    if (!category.trim()) throw new Error('Please enter a category');
    if (!grossWeight.trim() || isNaN(parseFloat(grossWeight)) || parseFloat(grossWeight) <= 0) {
      throw new Error('Please enter a valid gross weight');
    }
    if (!netWeight.trim() || isNaN(parseFloat(netWeight)) || parseFloat(netWeight) <= 0) {
      throw new Error('Please enter a valid net weight');
    }
    if (parseFloat(netWeight) > parseFloat(grossWeight)) {
      throw new Error('Net weight cannot be greater than gross weight');
    }
    if (!purity) throw new Error('Please select purity');
    // if (!diamondquality) throw new Error('Please select Diamond Quality');
    if (!hallmarkNumber.trim()) throw new Error('Please enter hallmark number');
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      throw new Error('Please enter a valid price');
    }
    if (discount.trim() && (isNaN(parseFloat(discount)) || parseFloat(discount) < 0 || parseFloat(discount) > 100)) {
      throw new Error('Please enter a valid discount percentage between 0 and 100');
    }
    return true;
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      validateForm();

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('category', category);
      formData.append('grossWeight', grossWeight);
      formData.append('netWeight', netWeight);
      formData.append('purity', purity);
      // formData.append('diamondquality', diamondquality);
      formData.append('hallmarkNumber', hallmarkNumber.trim());
      formData.append('discount', discount || '0');
      formData.append('price', price);
      formData.append('username', userCredential);

      const productCode = generateProductCode(registeredData.s_company_name);
      // console.log(productCode);
      
      formData.append('product_code', productCode);

      // Append multiple images
      images.forEach((image, index) => {
        formData.append('images', {
          uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
          type: image.type,
          name: image.fileName || `product_image_${index + 1}.jpg`,
        });
      });

      const response = await api.uploadProduct(formData);

      if (response.status === 201 || response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Upload Successful',
          text2: `${category} has been successfully uploaded!`,
          visibilityTime: 2000,
        });
        setTimeout(() => {
          navigation.navigate('HistoryScreen');
        }, 1200);
      } else {
        throw new Error('Upload failed with status: ' + response.status);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      if (error.message === 'User not logged in') {
        Toast.show({
          type: 'error',
          text1: 'Session Expired',
          text2: 'Please login again',
          visibilityTime: 2000,
        });
        navigation.replace('Login');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: error.message || 'Failed to upload product. Please try again.',
          visibilityTime: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageItemContainer}>
      <Image source={{ uri: item.uri }} style={styles.imagePreview} resizeMode="cover" />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => removeImage(index)}
        disabled={loading}
      >
        <Icon name="close-circle" size={24} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <ImagePickerModal />
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={24} color="#026456" />
          </TouchableOpacity>

          <View style={styles.uploadTitleContainer}>
            <Text style={styles.uploadTitle}>Post my Jewellery</Text>
          </View>

          <View style={styles.placeholder} />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.imagesContainer}>
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={
                images.length < MAX_IMAGES ? (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={showImagePicker}
                    disabled={loading}
                  >
                    <Icon name="add-circle-outline" size={32} color="#666" />
                    <Text style={styles.addImageText}>Add Image</Text>
                    <Text style={styles.imagesCount}>
                      {images.length}/{MAX_IMAGES}
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>


            <CategoryInput />
            <CategoryModal />



            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (g)</Text>
              <View style={styles.doubleInputContainer}>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Gross"
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                  value={grossWeight}
                  onChangeText={setGrossWeight1}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Net"
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                  value={netWeight}
                  onChangeText={setNetWeight1}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Purity</Text>
              <View style={styles.purityOuterContainer}>
                <View style={styles.purityRowsContainer}>
                  <View style={styles.purityRow}>
                    {PURITY_ROWS.row1.map((option, index) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.purityOption,
                          purity === option && styles.selectedOption,
                          index !== 0 && styles.purityOptionBorder,
                        ]}
                        onPress={() => setPurity(option)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            purity === option && styles.selectedOptionText,
                          ]}
                        >
                          {`${option}K`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.purityRow, styles.purityRowBorder]}>
                    {PURITY_ROWS.row2.map((option, index) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.purityOption,
                          purity === option && styles.selectedOption,
                          index !== 0 && styles.purityOptionBorder,
                        ]}
                        onPress={() => setPurity(option)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            purity === option && styles.selectedOptionText,
                          ]}
                        >
                          {`${option}K`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.purityRow3, styles.purityRowBorder3]}>
                    {PURITY_ROWS.row3.map((option, index) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.purityOption,
                          purity === option && styles.selectedOption,
                          index !== 0 && styles.purityOptionBorder,
                        ]}
                        onPress={() => setPurity(option)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            purity === option && styles.selectedOptionText,
                          ]}
                        >
                          {`${option}K`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>


            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hallmark No.</Text>
              <TextInput
                style={styles.input}
                value={hallmarkNumber}
                onChangeText={setHallmarkNumber}
                maxLength={6}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price Details</Text>
              <View style={styles.doubleInputContainer}>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="₹ Price"
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                  value={price}
                  onChangeText={setPrice1}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="% Discount"
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                  value={discount}
                  onChangeText={setDiscount1}
                  keyboardType="numeric"
                  maxLength={3}
                  editable={!loading}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Upload Product</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 4,
    width: 32,
  },
  uploadTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#026456',
  },
  placeholder: {
    width: 32,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 12,
  },
  imagesContainer: {
    height: width * 0.4,
    marginBottom: 16,
  },
  imageItemContainer: {
    width: width * 0.35,
    height: '100%',
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    alignItems: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addImageButton: {
    width: width * 0.35,
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  addImageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  imagesCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#999',
  },
  formContainer: {
    marginTop: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 100, // Fixed width for labels
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
  doubleInputContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  smallInput: {
    flex: 1,
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInputGroup: {
    width: '48%',
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center', // Center the picker content vertically
  },
  picker: {
    height: 50,
    marginTop: Platform.OS === 'ios' ? 0 : -8, // Adjust for Android vertical alignment
  },
  horizontalBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  optionBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    backgroundColor: '#026456',
    borderColor: '#026456',
  },
  optionText: {
    fontSize: 12,
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
  },
  button: {
    height: 44,
    backgroundColor: '#026456',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  purityOuterContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  purityRowsContainer: {
    flexDirection: 'column',
  },
  purityRow: {
    flexDirection: 'row',
    height: 44,
  },
  purityRow3: {
    flexDirection: 'row',
    height: 44,
    width: 57
  },

  purityRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  purityRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  purityOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  purityOptionBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  optionText: {
    fontSize: 12,
    color: '#000',
  },
  selectedOption: {
    backgroundColor: '#026456',
    borderColor: '#026456',
  },
  selectedOptionText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 8,
    padding: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryInputButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  categoryInputText: {
    fontSize: 14,
    color: '#000',
  },
  categoryInputPlaceholder: {
    color: '#999',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCategoryOption: {
    backgroundColor: '#026456',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#000',
  },
  selectedCategoryOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 8,
    padding: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
    justifyContent: 'center'
  },
  categoryGridItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 100,
    alignItems: 'center',
    marginBottom: 4
  },
  selectedCategoryGridItem: {
    backgroundColor: '#026456',
    borderColor: '#026456',
  },
  categoryGridText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  selectedCategoryGridText: {
    color: '#fff',
    fontWeight: '500',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    marginTop: 8,
    padding: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default UploadScreen;
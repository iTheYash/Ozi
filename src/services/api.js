import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://api.ozaveria.com:3000/api';
const CLIENT_SECRET = 'your_client_secret'; // This should match your backend .env CLIENT_SECRET

const api = {
  getBuyerDetails: async (item) => {
    const { seller_id, product_code } = item;

    try {
      const response = await axios.post(`${BASE_URL}/post/posts/buyerDetails`, { seller_id, product_code });
      console.log('buyer.........', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching buyer details:', error.message);
      // Additional error handling logic can be added here if needed
    }
  },


  saveMessage: async (messageData) => {
    const response = await axios.post(`${BASE_URL}/post/posts/message`, messageData);
    return response.data;
  },

  getChatHistory: async (sellerId, buyerId, productCode, roomId) => {
    const response = await axios.get(`${BASE_URL}/post/posts/messages`, {
      params: {
        seller_id: sellerId,
        buyer_id: buyerId,
        product_code: productCode,
        room_id: roomId
      }
    });
    return response.data;
  },

  getUserChats: async (userId) => {
    const response = await axios.get(`${BASE_URL}/post/posts/chats/${userId}`);
    return response.data;
  },
  
  login: async (phone) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        phone: phone
      });

      await AsyncStorage.setItem('userPhone', phone);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error.message;
    }
  },

  verifyOTP: async (phone, otp) => {
    try {
      const payload = {
        phone: phone,
        client_secret: CLIENT_SECRET,
        smsMessage: otp // Add the OTP as sms_message
      };

      const response = await axios.post(`${BASE_URL}/users/verifyOTP`, payload);

      return response.data;
    } catch (error) {
      console.error('OTP Verification Error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  registerBusiness: async (formData) => {
    const payload = {
      owner_name: formData.ownerName,
      nature_of_business: formData.businessType,
      gst_no: formData.gstNo,
      company_name: formData.companyName,
      contact_number: formData.contactNo,
      register_address: formData.registerAddress,
      corporate_address: formData.registerAddress2,
      company_email: formData.emailAddress,
      personal_email: formData.emailAddress2,
      state: formData.state,
      city: formData.city,
      pincode: formData.pinCode,
    };

    try {
      const response = await axios.post(`${BASE_URL}/users/registerUser`, payload);
      return response; // Return the successful registration response
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        throw new Error('Error in registration process');
      }
    }
  },

  isRegistered: async (contactno) => {
    console.log('inside isreg', contactno);

    try {
      const response = await axios.post(`${BASE_URL}/users/isRegistered`, { contactno });
      console.log("res", response)

      if (response.data.success) {
        const { token, registered, role, data } = response.data;
        return {
          isRegistered: registered,
          token,
          data,
          role,
        };
      } else {
        console.error('Registration failed:', response.data.message);
        return { isRegistered: false, token: null, data: null };
      }
    } catch (error) {
      console.error('Error during registration check:', error.message);
      return { isRegistered: false, token: null, data: null };
    }
  },

  getRegisteredUser: async (contactno) => {
    try {

      // Make an API call to check if the user is registered
      const response = await axios.post(`${BASE_URL}/users/isRegistered`, { contactno });

      console.log('Registration response:', response.data); // Debugging

      return response.data
    } catch (error) {
      console.error('Get registered user error:', error);
      // Handle error gracefully
      throw error.response?.data || {
        error: 'Failed to fetch registration data',
        message: error.message,
      };
    }
  },

  //posts by category
  getPostsByCategory: async (category) => {
    console.log("category", category);
    try {
      const response = await axios.post(`${BASE_URL}/post/category`, { category });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  },


  getListingData: async (contactno) => {
    try {
      const response = await axios.post(`${BASE_URL}/post/listing`, { contactno });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  },

  getBestsellersData: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/post/bestsellers`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch bestsellers:', error);
    }
  },

  getDirectories: async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(`${BASE_URL}/subscription/directory`, {}, {
        headers: {
          Authorization: token
        }
      });
      console.log("response directory", response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching directories:', error);
      throw error.response?.data || error.message;
    }
  },

  isGSTRegistered: async (gstNo) => {
    console.log('inside gst check', gstNo);

    try {
      const response = await axios.post(`${BASE_URL}/users/check-gst`, { gstNo });
      console.log("res", response);

      if (response.data.success) {
        const { token, registered, role, data } = response.data;
        return {
          isRegistered: registered,
          token,
          data,
          role,
        };
      } else {
        console.error('GST check failed:', response.data.message);
        return {
          isRegistered: false,
          token: null,
          data: null,
          role: null
        };
      }
    } catch (error) {
      console.error('Error during GST check:', error.message);
      return {
        isRegistered: false,
        token: null,
        data: null,
        role: null
      };
    }
  },

  addToWishlist: async (user_id, post_id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/post/wishlist/add`,
        { user_id, post_id },
        {
          headers: {
            Authorization: token
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error.response?.data || error.message;
    }
  },

  removeFromWishlist: async (user_id, post_id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/post/wishlist/remove`,
        { user_id, post_id },
        {
          headers: {
            Authorization: token
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error.response?.data || error.message;
    }
  },

  getWishlist: async (user_id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/post/wishlist/${user_id}`,
        {
          headers: {
            Authorization: token
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error.response?.data || error.message;
    }
  },

  getAllBlogs: async () => {
    console.log("here i am")
    try {
      const response = await axios.post(`${BASE_URL}/users/allblogs`);
      console.log("response is..............", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching jewelry:', error);
      throw error;
    }
  },


  // requestOTP: async (phone) => {
  //   try {
  //     const response = await axios.post(`${BASE_URL}/request`, {
  //       phone: phone,
  //       client_secret: CLIENT_SECRET
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Request OTP error:', error);
  //     throw error.response?.data || error.message;
  //   }
  // },

  getCurrentUser: async () => {
    try {
      const phone = await AsyncStorage.getItem('userPhone');
      const userData = await AsyncStorage.getItem('userData');

      if (!phone) {
        return {
          phone: null,
          userData: null,
          isRegistered: false
        };
      }

      // Fix: Added /api to match server endpoint
      const response = await axios.get(`${BASE_URL}/isregistered`, {
        params: { phone }
      });

      console.log('Registration response:', response.data); // For debugging

      return {
        phone,
        userData: userData ? JSON.parse(userData) : null,
        isRegistered: response.data.registered === 'Yes',
        method: 'phone'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      throw error.response?.data || {
        error: 'Failed to get user data',
        message: error.message
      };
    }
  },



  logout: async () => {
    try {
      await AsyncStorage.multiRemove([
        'userPhone',
        'userData',
        'isVerified'
      ]);
    } catch (error) {
      throw error;
    }
  },

  submitServiceRequest: async (selectedOptions, description) => {
    try {
      const phone = await AsyncStorage.getItem('contactno');
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(`${BASE_URL}/service/submitservice`, {
        phone,
        selectedOptions,
        description
      },
        {
          headers: {
            Authorization: token
          }
        }
      );

      return response;
    } catch (error) {
      console.error('Error submitting service request:', error);
      throw error.response?.data || error.message;
    }
  },

  getServiceRequests: async () => {
    try {
      const phone = await AsyncStorage.getItem('userPhone');

      if (!phone) {
        throw new Error('User not logged in');
      }

      const response = await axios.get(`${BASE_URL}/service-requests/${phone}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service requests:', error);
      throw error.response?.data || error.message;
    }
  },

  updateServiceRequestStatus: async (adId, status) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/service-requests/${adId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating service request status:', error);
      throw error.response?.data || error.message;
    }
  },

  // Your existing product-related methods can stay as they are
  getProducts: async (category = null) => {
    try {
      let url = `${BASE_URL}/products`;
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // getCategories: async () => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}/products/categories`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },



  uploadProduct: async (formData) => {
    try {
      const phone = await AsyncStorage.getItem('contactno');
      const token = await AsyncStorage.getItem('token');
      // const isVerified = await AsyncStorage.getItem('isVerified');
      // Create new FormData with the correct field names
      const modifiedFormData = new FormData();
      modifiedFormData.append('username', phone);
      modifiedFormData.append('title', formData._parts.find(part => part[0] === 'name')?.[1] || '');
      modifiedFormData.append('description', formData._parts.find(part => part[0] === 'name')?.[1] || '');
      modifiedFormData.append('price', formData._parts.find(part => part[0] === 'price')?.[1] || '');
      modifiedFormData.append('hallmark_number', formData._parts.find(part => part[0] === 'hallmarkNumber')?.[1] || '');
      modifiedFormData.append('category', formData._parts.find(part => part[0] === 'category')?.[1] || '');
      modifiedFormData.append('gross_weight', formData._parts.find(part => part[0] === 'grossWeight')?.[1] || '');
      modifiedFormData.append('net_weight', formData._parts.find(part => part[0] === 'netWeight')?.[1] || '');
      modifiedFormData.append('purity', formData._parts.find(part => part[0] === 'purity')?.[1] || '');
      modifiedFormData.append('discount', formData._parts.find(part => part[0] === 'discount')?.[1] || '');
      modifiedFormData.append('product_code', formData._parts.find(part => part[0] === 'product_code')?.[1] || '');

      // Handle images
      const imageParts = formData._parts.filter(part => part[0] === 'images');
      imageParts.forEach(([_, image]) => {
        modifiedFormData.append('images', image);
      });

      const response = await axios.post(`${BASE_URL}/post/posts`, modifiedFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${token}`, //change
        },
      });

      return response;
    } catch (error) {
      console.error('Upload error details:', error);

      throw {
        message: error.response?.data?.error || error.message,
        details: error.response?.data?.details || {},
        status: error.response?.status
      };
    }
  },

  getProductRatings: async (productId) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${productId}/ratings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error.response?.data || error.message;
    }
  },

  submitRating: async (productId, userRating, feedback) => {
    try {
      const phone = await AsyncStorage.getItem('userPhone');

      if (!phone) {
        throw new Error('User not logged in');
      }

      const numericRating = Number(userRating);

      if (isNaN(numericRating)) {
        throw new Error('Invalid rating value');
      }

      const roundedRating = Math.round(numericRating);

      if (roundedRating < 1 || roundedRating > 5) {
        throw new Error('Rating must be between 1 and 5 stars');
      }

      const payload = {
        rating: roundedRating,
        comment: feedback || '',
        userPhone: phone
      };

      const response = await axios.post(
        `${BASE_URL}/products/${productId}/ratings`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default api;
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Clipboard, SafeAreaView, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function BuyNow({ route, navigation }) {
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState(null);

  const getDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.getRegisteredUser(item.user_id);
      console.log("result.........", result);

      if (result) {
        setRegistration(result.data);
        setLoading(false);
      } else {
        setError('No registration found for this number');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching details:', err);
      setError(err?.message || 'Failed to fetch user details');
      setLoading(false);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch registration details',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setString(text);
      Toast.show({
        type: 'success',
        text1: 'Copied!',
        text2: 'Contact number copied to clipboard',
        position: 'top',
        visibilityTime: 2000,
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to copy to clipboard',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#dca818" />
          <Text style={styles.loadingText}>Fetching owner details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={48} color="#dca818" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#026456" barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seller Details</Text>
        <View style={styles.backButton} /> {/* Empty view for alignment */}
      </View>

      <ScrollView style={styles.container}>
        {/* Company Banner */}
        <View style={styles.companyBanner}>
          <FontAwesome name="building" size={32} color="#026456" style={styles.companyIcon} />
          <Text style={styles.companyName}>{registration?.s_company_name}</Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <View style={styles.labelContainer}>
              <FontAwesome name="user" size={20} color="#026456" />
              <Text style={styles.label}>Owner</Text>
            </View>
            <Text style={styles.value}>{registration?.s_owner_name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="phone" size={20} color="#026456" />
              <Text style={styles.label}>Contact Number</Text>
            </View>
            <TouchableOpacity
              style={styles.copyContainer}
              onPress={() => copyToClipboard(registration?.s_contactno)}
            >
              <Text style={styles.value}>{registration?.s_contactno}</Text>
              <View style={styles.copyButton}>
                <Feather name="copy" size={18} color="#026456" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="receipt-long" size={20} color="#026456" />
              <Text style={styles.label}>GST Number</Text>
            </View>
            <Text style={styles.value}>{registration?.s_gstno}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <View style={styles.labelContainer}>
              <FontAwesome name="map-marker" size={20} color="#026456" />
              <Text style={styles.label}>Company Address</Text>
            </View>
            <Text style={styles.value}>{registration?.s_registered_addr}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#026456',
  },
  header: {
    height: 56,
    backgroundColor: '#026456',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  companyBanner: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  companyIcon: {
    marginBottom: 12,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#026456',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#026456',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  value: {
    color: '#333333',
    fontSize: 16,
    marginLeft: 32,
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  copyButton: {
    padding: 8,
    backgroundColor: '#02645615',
    borderRadius: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    color: '#666666',
    fontSize: 16,
  },
  errorText: {
    color: '#dca818',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  }
});
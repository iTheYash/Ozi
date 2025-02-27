import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Alert, Platform, View, ActivityIndicator, Image} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OtpScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CategoryPage from './src/screens/CategoryScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import DigitalExhibitionScreen from './src/screens/DigitalExhibitionScreen';
import RatingAndFeedbackScreen from './src/screens/RatingandFeedback';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import PayPerPostScreen from './src/screens/PayperPostScreen';
import BlogDetails from './src/screens/BlogsDetails';
import BlogScreen from './src/screens/BlogScreen';
import SplashScreen from './src/screens/SplashScreen';
import AdvertiseWithUs from './src/screens/Advertisewithus';
import SingleCategoryScreen from './src/screens/SingleCategoryScreen';
import Filters from './src/screens/Filters';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import MyTransaction from './src/screens/MyTransaction';
import MyProfile from './src/screens/MyProfile';
import SetttingScreen from './src/screens/SetttingScreen';
import SupportScreen from './src/screens/SupportScreen';
import FAQScreen from './src/screens/FAQScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import TermsScreen from './src/screens/TermsScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import HowToUse from './src/screens/HowToUse';
import AboutUs from './src/screens/AboutUs';
import RegisterPage from './src/screens/RegisterPage';
import BuyNow from './src/screens/BuyNow';
import ChatNow from './src/screens/ChatnOW';
import Legalandcom from './src/screens/LegalandCompliance';
import DirectoryScreen from './src/screens/DirectoryScreen';
import CatalogueGeneration from './src/screens/CatalogueGeneration';
import DigitalMarketing from './src/screens/DigitalMarketing';
import DigitalExhibition from './src/screens/DigitalExhibition';
import FintechSolutions from './src/screens/FintechSolutions';
import Wallet from './src/screens/Wallet';
import DirectoryDetailsScreen from './src/screens/DirectoryDetails';
import OfflineNotice from './src/screens/OfflineNotice';
import InboxScreen from './src/screens/InboxScreen';

const DashboardScreen = () => (
  <View style={{flex: 1, backgroundColor: '#fff'}} />
);
const SettingsScreen = () => (
  <View style={{flex: 1, backgroundColor: '#fff'}} />
);
const NotificationsScreen = () => (
  <View style={{flex: 1, backgroundColor: '#fff'}} />
);
const MyAccountScreen = () => (
  <View style={{flex: 1, backgroundColor: '#fff'}} />
);
const HelpScreen = () => <View style={{flex: 1, backgroundColor: '#fff'}} />;

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const SESSION_KEY = 'user_session';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{backgroundColor: '#ccd5ae', borderLeftColor: '#588157'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 15,
      }}
      autoHide={true}
      visibilityTime={1000}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{backgroundColor: '#f8d7da', borderLeftColor: '#f5c6cb'}}
      contentContainerStyle={{padding: 10}}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#721c24',
      }}
      text2Style={{
        fontSize: 14,
        color: '#721c24',
      }}
    />
  ),
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        headerTitle: () => (
          <Image
            source={require('./src/assets/logo3.png')}
            style={{
              width: 120, // Adjust width as needed
              height: 40, // Adjust height as needed
              resizeMode: 'contain',
            }}
          />
        ),
        headerTitleAlign: 'center',
        drawerActiveBackgroundColor: '#e8e8e8',
        drawerActiveTintColor: '#333',
        drawerInactiveTintColor: '#666',
      }}
      initialRouteName="HomeScreen">
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          drawerLabel: () => null,
          drawerItemStyle: {display: 'none'},
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerLabel: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name="MyAccount"
        component={MyAccountScreen}
        options={{
          drawerLabel: 'My Account',
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerLabel: 'Notifications',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
        }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          drawerLabel: 'Help & Support',
        }}
      />
    </Drawer.Navigator>
  );
}

const App = () => {
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setup  = () => {
    PushNotification.configure({
      onRegister: token => console.log('TOKEN:', token),
      onNotification: notification => {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotification.FetchResult.NoData);
      },
      popInitialNotification: true,
      requestPermissions: false,
    });

    PushNotification.createChannel({
      channelId: 'upload-channel',
      channelName: 'Upload Notifications',
      channelDescription: 'Notifications for product uploads',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    });
  };

  const checkSession = async () => {
    try {
      const contactno = await AsyncStorage.getItem('contactno');
      const token = await AsyncStorage.getItem('token');
      if (contactno || token) {
        console.log('set',contactno);
        
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error accessing AsyncStorage:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const getRequiredPermissions = () => {
    if (Platform.OS === 'android') {
      const permissions = [];

      // Add storage permissions based on Android version
      if (Platform.Version >= 33) {
        permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      } else {
        permissions.push(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
      }

      // Add camera permission
      permissions.push(PERMISSIONS.ANDROID.CAMERA);

      // Add notification permission for Android 13+
      if (Platform.Version >= 33) {
        permissions.push(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      }

      return permissions.filter(Boolean); // Remove any undefined permissions
    }
    return [];
  };

  const checkPermissions = async () => {
    try {
      const permissions = getRequiredPermissions();

      if (permissions.length === 0) {
        setPermissionsChecked(true);
        setupNotifications();
        return;
      }

      let allGranted = true;
      let blockedPermissions = [];

      for (const permission of permissions) {
        try {
          const result = await check(permission);

          if (result === RESULTS.DENIED) {
            const requestResult = await request(permission);
            if (requestResult !== RESULTS.GRANTED) {
              allGranted = false;
              blockedPermissions.push(permission);
            }
          } else if (result === RESULTS.BLOCKED) {
            allGranted = false;
            blockedPermissions.push(permission);
          }
        } catch (error) {
          console.error(`Error checking permission ${permission}:`, error);
        }
      }

      if (!allGranted && blockedPermissions.length > 0) {
        Alert.alert(
          'Permissions Required',
          'Some permissions are required for the app to work properly. Please grant them in settings.',
          [
            {
              text: 'Open Settings',
              onPress: openSettings,
            },
            {
              text: 'Continue Anyway',
              onPress: () => {
                setupNotifications();
                setPermissionsChecked(true);
              },
            },
          ],
        );
      } else {
        setupNotifications();
        setPermissionsChecked(true);
      }
    } catch (error) {
      console.error('Permission error:', error);
      setPermissionsChecked(true); // Set to true even on error to prevent app from getting stuck
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await checkPermissions();
      await checkSession();
    };
    initialize();
  }, []);

  if (loading || !permissionsChecked) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: '#fff'},
          }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
          />
          <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Category" component={CategoryPage} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
          <Stack.Screen
            name="Digital Exhibition"
            component={DigitalExhibitionScreen}
          />
          <Stack.Screen name="Ratings" component={RatingAndFeedbackScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="Pay per Post" component={PayPerPostScreen} />
          <Stack.Screen name="BlogScreen" component={BlogScreen} />
          <Stack.Screen name="Blog Details" component={BlogDetails} />
          <Stack.Screen name="Advertise" component={AdvertiseWithUs} />
          <Stack.Screen
            name="SingleCategory"
            component={SingleCategoryScreen}
          />
          <Stack.Screen name="filters" component={Filters} />
          <Stack.Screen name="mytransaction" component={MyTransaction} />
          <Stack.Screen name="myprofile" component={MyProfile} />
          <Stack.Screen name="setting" component={SetttingScreen} />
          <Stack.Screen name="support" component={SupportScreen} />
          <Stack.Screen name="faq" component={FAQScreen} />
          <Stack.Screen name="privacy" component={PrivacyScreen} />
          <Stack.Screen name="terms" component={TermsScreen} />
          <Stack.Screen
            name="TransactionDetail"
            component={TransactionDetailScreen}
          />
          <Stack.Screen
            name="TransactionList"
            component={TransactionListScreen}
          />
          <Stack.Screen name="howtouse" component={HowToUse} />
          <Stack.Screen name="About" component={AboutUs} />
          <Stack.Screen name="RegisterPage" component={RegisterPage} />
          <Stack.Screen name="buynow" component={BuyNow} />
          <Stack.Screen name="Chat" component={ChatNow} />
          <Stack.Screen name="Legal" component={Legalandcom} />
          <Stack.Screen name="Directory" component={DirectoryScreen} />
          <Stack.Screen name="CatalogueGeneration" component={CatalogueGeneration} />
          <Stack.Screen name="Marketing" component={DigitalMarketing} />
          <Stack.Screen name="Exhibition" component={DigitalExhibition} />
          <Stack.Screen name="Fintech" component={FintechSolutions} />
          <Stack.Screen name="wallet" component={Wallet} />
          <Stack.Screen name="DirectoryDetails" component={DirectoryDetailsScreen} />
          <Stack.Screen name="InboxScreen" component={InboxScreen} />


        </Stack.Navigator>
      </NavigationContainer>
      <OfflineNotice/>
      <Toast config={toastConfig} />
    </>
  );
};

export default App;

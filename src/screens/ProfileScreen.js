import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

const ProfileScreen = () => {
  React.useEffect(() => {
    Alert.alert(
      'Under Development',
      'This feature is currently under development.',
      [{ text: 'OK', onPress: () => console.log('Alert Closed') }]
    );
  }, []);

  const renderContent = () => (
    <View style={styles.content}>
      <Text style={styles.text}>Sample Content</Text>
      <Text style={styles.text}>This will be blurred</Text>
      {/* Add your actual content here */}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderContent()}
      {Platform.OS === 'ios' ? (
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={10}
        />
      ) : (
        <View style={[styles.blur, styles.androidBlur]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  androidBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ProfileScreen;
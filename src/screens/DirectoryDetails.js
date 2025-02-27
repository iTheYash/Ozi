import React from 'react';

import {

  View,

  Text,

  StyleSheet,

  Image,

  ScrollView,

  SafeAreaView,

  TouchableOpacity,

} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
 
const DirectoryDetails = ({ route, navigation }) => {

  const { advertisement } = route.params;
 
  return (
<SafeAreaView style={styles.container}>
<View style={styles.header}>
<TouchableOpacity

          style={styles.backButton}

          onPress={() => navigation.goBack()}
>
<AntDesign name="left" size={24} color="#026456" />
</TouchableOpacity>
<Text style={styles.title}>{advertisement.name || 'Details'}</Text>
</View>
<ScrollView contentContainerStyle={styles.content}>

        {advertisement.logo ? (
<Image

            source={{ uri: advertisement.logo }}

            style={styles.image}

            resizeMode="contain"

          />

        ) : (
<View style={[styles.image, styles.noImage]}>
<Text style={styles.noImageText}>No Image</Text>
</View>

        )}
<View style={styles.details}>
<Text style={styles.label}>About Us:</Text>
<Text style={styles.description}>{advertisement.aboutus || 'N/A'}</Text>
 
          <Text style={styles.label}>Address:</Text>
<Text style={styles.description}>

            {advertisement.address || 'Not provided'}
</Text>
 
          <Text style={styles.label}>Contact:</Text>
<Text style={styles.description}>

            {advertisement.phone || 'Not available'}
</Text>
 
          <Text style={styles.label}>Email:</Text>
<Text style={styles.description}>

            {advertisement.email || 'Not available'}
</Text>
 
          <Text style={styles.label}>Ratings:</Text>
<Text style={styles.description}>

            {advertisement.ratings || 'No ratings available'}
</Text>
</View>
</ScrollView>
</SafeAreaView>

  );

};
 
const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#fff',

  },

  header: {

    flexDirection: 'row',

    alignItems: 'center',

    padding: 16,

    borderBottomWidth: 1,

    borderBottomColor: '#ccc',

    backgroundColor: '#f9f9f9',

  },

  backButton: {

    padding: 4,

  },

  title: {

    fontSize: 20,

    fontWeight: 'bold',

    color: '#026456',

    marginLeft: 12,

  },

  content: {

    padding: 16,

  },

  image: {

    width: '100%',

    height: 200,

    backgroundColor: '#f0f0f0',

    borderRadius: 8,

    marginBottom: 16,

  },

  noImage: {

    justifyContent: 'center',

    alignItems: 'center',

  },

  noImageText: {

    color: '#999',

    fontSize: 16,

  },

  details: {

    marginTop: 16,

  },

  label: {

    fontSize: 16,

    fontWeight: 'bold',

    color: '#333',

    marginTop: 12,

  },

  description: {

    fontSize: 14,

    color: '#666',

    marginTop: 4,

    lineHeight: 20,

  },

});
 
export default DirectoryDetails;

 
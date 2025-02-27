import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const BlogDetails = ({ route }) => {
  const { blog } = route.params;
  const navigation = useNavigation();
  const [imageErrors, setImageErrors] = useState({});
  const [contentSections, setContentSections] = useState([]);

  useEffect(() => {
    if (blog.content) {
      // Split content into words and create ~100 word sections
      const words = blog.content.split(' ');
      const sections = [];
      let currentSection = [];
      
      words.forEach((word) => {
        if (currentSection.length < 100) {
          currentSection.push(word);
        } else {
          sections.push(currentSection.join(' '));
          currentSection = [word];
        }
      });
      
      // Add the last section if it exists
      if (currentSection.length > 0) {
        sections.push(currentSection.join(' '));
      }
      
      setContentSections(sections);
    }
  }, [blog.content]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const renderHeroSection = () => {
    if (!blog.image_urls?.[0] || imageErrors[0]) {
      return (
        <View style={[styles.heroContainer, styles.noImageHero]}>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
            style={styles.gradient}
          />
        </View>
      );
    }

    return (
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: blog.image_urls[0] }}
          style={styles.heroImage}
          resizeMode="cover"
          onError={() => handleImageError(0)}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
      </View>
    );
  };

  const renderContentSection = (content, index) => {
    return (
      <View key={index} style={styles.contentSection}>
        <Text style={styles.description}>{content}</Text>
      </View>
    );
  };

  const renderImageWithContent = (imageIndex, contentIndex) => {
    if (!blog.image_urls?.[imageIndex] || imageErrors[imageIndex]) {
      return null;
    }

    return (
      <View style={styles.additionalImageSection}>
        <Image
          source={{ uri: blog.image_urls[imageIndex] }}
          style={styles.additionalImage}
          resizeMode="cover"
          onError={() => handleImageError(imageIndex)}
        />
        {contentSections[contentIndex] && (
          <Text style={styles.description}>{contentSections[contentIndex]}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {renderHeroSection()}

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Category Badge */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>{blog.category}</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Title Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>{blog.title}</Text>
            <View style={styles.metaInfo}>
              <View style={styles.authorInfo}>
                <Icon name="person-circle-outline" size={20} color="#666" />
                <Text style={styles.authorText}>{blog.created_by || "oz team"}</Text>
              </View>
              <View style={styles.dateInfo}>
                <Icon name="calendar-outline" size={18} color="#666" />
                <Text style={styles.dateText}>{formatDate(blog.created_at)}</Text>
              </View>
            </View>
          </View>

          {/* First Content Section */}
          {contentSections[0] && renderContentSection(contentSections[0], 0)}

          {/* Image and Content Sections */}
          {renderImageWithContent(1, 1)}
          {renderImageWithContent(2, 2)}

          {/* Remaining Content Sections */}
          {contentSections.slice(3).map((content, index) => 
            renderContentSection(content, index + 3)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles remain the same ...
  noImageHero: {
    backgroundColor: '#026456',
  },
  additionalImageSection: {
    marginVertical: 24,
    marginHorizontal: -20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  additionalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  imageDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'justify',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroContainer: {
    height: 300,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: '#026456',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  contentContainer: {
    padding: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 36,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  contentSection: {
    paddingTop: 8,
  },
  description: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    marginBottom: 24,
    fontWeight: '500',
  }

});

export default BlogDetails;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HowToUseScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('sellers');

  const steps = {
    sellers: [
      { 
        title: 'List your jewelry',
        description: 'Take high-quality photos and create detailed listings of your pieces',
        icon: 'camera' 
      },
      { 
        title: 'Reach a broader audience',
        description: 'Connect with verified buyers from across the marketplace',
        icon: 'people' 
      },
      { 
        title: 'Turn dead stock into profit',
        description: 'Convert your unsold inventory into immediate revenue',
        icon: 'trending-up' 
      }
    ],
    buyers: [
      { 
        title: 'Explore premium listings',
        description: 'Browse through curated collections from verified sellers',
        icon: 'search' 
      },
      { 
        title: 'Find exclusive deals',
        description: 'Access special prices on high-quality jewelry pieces',
        icon: 'star' 
      },
      { 
        title: 'Shop with confidence',
        description: 'Every transaction is protected and verified',
        icon: 'verified' 
      }
    ]
  };

  const StepCard = ({ title, description, icon, index }) => (
    <Animated.View style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconContainer, { backgroundColor: selectedTab === 'sellers' ? '#FFF8E7' : '#FFF8E7' }]}>
          <MaterialIcons 
            name={icon} 
            size={24} 
            color={selectedTab === 'sellers' ? '#DCA818' : '#DCA818'} 
          />
        </View>
        <Text style={styles.stepNumber}>STEP {index + 1}</Text>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="#026456" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How to Use Ozaveria</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedTab === 'sellers' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('sellers')}
        >
          <MaterialIcons 
            name="store" 
            size={20} 
            color={selectedTab === 'sellers' ? '#026456' : '#666666'} 
          />
          <Text style={[
            styles.tabText,
            selectedTab === 'sellers' && styles.activeTabText
          ]}>For Sellers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedTab === 'buyers' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('buyers')}
        >
          <MaterialIcons 
            name="shopping-bag" 
            size={20} 
            color={selectedTab === 'buyers' ? '#026456' : '#666666'} 
          />
          <Text style={[
            styles.tabText,
            selectedTab === 'buyers' && styles.activeTabText
          ]}>For Buyers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>
          {selectedTab === 'sellers' 
            ? 'Transform your jewelry business by reaching new customers and increasing sales.'
            : 'Discover exceptional jewelry pieces at exclusive prices from verified sellers.'
          }
        </Text>

        <View style={styles.stepsContainer}>
          {steps[selectedTab].map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </View>

        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Text style={styles.ctaSubtitle}>
            {selectedTab === 'sellers'
              ? 'Create your first listing and start selling today!'
              : 'Browse our curated collection of premium jewelry.'
            }
          </Text>
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={() => navigation.navigate(selectedTab==='sellers'?'Upload':'Home')}
          >
            <Text style={styles.getStartedButtonText}>
              {selectedTab === 'sellers' ? 'Start Selling' : 'Start Shopping'}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F0EC',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#026456',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F0EC',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#E8F3F1',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#026456',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  stepsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  stepCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 0.4,
    borderColor: '#026456',
    elevation: 2,
    shadowColor: '#026456',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#026456',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  ctaContainer: {
    padding: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#026456',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  getStartedButton: {
    backgroundColor: '#026456',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HowToUseScreen;

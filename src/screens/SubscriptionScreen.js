import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { id: 1, name: 'Basic', price: '₹499', features: ['Basic Content', 'No Ads'] },
    { id: 2, name: 'Premium', price: '₹799', features: ['Premium Content', 'No Ads', 'HD Quality'] },
  ];

  return (
    <SafeAreaView style={subStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={subStyles.icon}
          onPress={() => navigation.navigate('Home')}
        >
          <AntDesign name="left" size={24} color="#dca818" /> 
        </TouchableOpacity>
        <View style={subStyles.header}>
          <Text style={subStyles.headerTitle}>Premium Subscription</Text>
          <Text style={subStyles.headerSubtitle}>Unlock Premium Features</Text>
        </View>

        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              subStyles.planBox,
              selectedPlan?.id === plan.id && subStyles.selectedPlan
            ]}
            onPress={() => setSelectedPlan(plan)}
          >
            <Text style={subStyles.planName}>{plan.name}</Text>
            <Text style={subStyles.planPrice}>{plan.price}/month</Text>
            {plan.features.map((feature, index) => (
              <Text key={index} style={subStyles.feature}>
                ✓ {feature}
              </Text>
            ))}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={subStyles.subscribeButton}
          onPress={() => console.log('Subscribe to:', selectedPlan)}
        >
          <Text style={subStyles.buttonText}>Subscribe Now</Text>
        </TouchableOpacity>

        {/* Pay Per Post Hint Section */}
        <View style={subStyles.hintContainer}>
          <Text style={subStyles.hintTitle}>Not Ready to Subscribe?</Text>
          <Text style={subStyles.hintText}>
            Try our Pay Per Post option! Buy credits and read only what interests you.
          </Text>
          <Text style={subStyles.hintPrice}>Starting at just ₹199 for 5 credits</Text>
          <TouchableOpacity
            style={subStyles.hintButton}
            onPress={() => navigation.navigate('Pay per Post')}
          >
            <Text style={subStyles.hintButtonText}>Try Pay Per Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const subStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#026456',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  planBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  selectedPlan: {
    borderColor: '#DCA818',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#026456',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 32,
    color: '#DCA818',
    marginBottom: 20,
  },
  feature: {
    color: '#333333',
    fontSize: 16,
    marginBottom: 8,
  },
  subscribeButton: {
    backgroundColor: '#026456',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#DCA818',
  },
  hintTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#026456',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  hintPrice: {
    fontSize: 16,
    color: '#DCA818',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hintButton: {
    backgroundColor: '#DCA818',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  hintButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    position:'absolute'
  }
});



export default SubscriptionScreen;
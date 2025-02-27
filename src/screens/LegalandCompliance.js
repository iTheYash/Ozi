import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
 
const Legalandcom = ({ navigation }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      padding: 16,
      backgroundColor: '#026456',
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#FFFFFF',
      marginLeft: 20,
    },
    scrollContainer: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    sectionContainer: {
      marginBottom: 20,
      backgroundColor: '#F7FAFC',
      borderRadius: 16,
      padding: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#026456',
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(2, 100, 86, 0.2)',
      paddingBottom: 8,
    },
    paragraph: {
      fontSize: 16,
      color: '#4A5568',
      lineHeight: 24,
      marginBottom: 16,
    },
    bulletPoint: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    bulletIcon: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#026456',
      marginRight: 12,
    },
    bulletText: {
      fontSize: 16,
      color: '#4A5568',
      flex: 1,
      lineHeight: 24,
    },
  });
 
  const BulletPoint = ({ children }) => (
    <View style={styles.bulletPoint}>
      <View style={styles.bulletIcon} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
 
  const TermSection = ({ title, content, bulletPoints = [] }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content && <Text style={styles.paragraph}>{content}</Text>}
      {bulletPoints.map((point, index) => (
        <BulletPoint key={index}>{point}</BulletPoint>
      ))}
    </View>
  );
 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#026456" />
     
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal and Compliance</Text>
      </View>
     
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <TermSection
          title="1. Introduction"
          content="Welcome to Ozaveria. This platform enables sellers to list and offer products (jewelry) to buyers without direct intervention from Ozaveria."
        />
 
        <TermSection
          title="2. Information Collection"
          content="We collect various types of information, including:"
          bulletPoints={[
            "Registration Information (name, address, contact details)",
            "Account Information (payment and billing details)",
            "Activities Information (transaction and communication records)",
            "Browsing Information (IP addresses, usage patterns)"
          ]}
        />
 
        <TermSection
          title="3. Use of Information"
          content="Your information may be used for:"
          bulletPoints={[
            "User verification and account management",
            "Customer service",
            "Transaction processing",
            "Marketing communications",
            "Platform improvement"
          ]}
        />
 
        <TermSection
          title="4. Information Disclosure"
          content="We may share your information with:"
          bulletPoints={[
            "Service providers",
            "Affiliated companies",
            "Professional advisors",
            "Law enforcement agencies"
          ]}
        />
 
        <TermSection
          title="5. User Rights"
          content="You have the right to:"
          bulletPoints={[
            "Access your personal information",
            "Request updates or corrections",
            "Withdraw consent for data processing"
          ]}
        />
 
        <TermSection
          title="6. Cookies"
          content="We use cookies to enhance user experience, gather usage statistics, and personalize services. You can manage cookie preferences through your browser settings."
        />
 
        <TermSection
          title="7. Security"
          content="We employ commercially reasonable security methods to protect your information. However, no internet transmission is 100% secure."
        />
 
        <TermSection
          title="8. Minors"
          content="Our platform is not targeted at minors. Parents or guardians should contact us to remove a minor's information."
        />
 
        <TermSection
          title="9. Policy Changes"
          content="We may update this policy periodically. Continued use of the platform indicates acceptance of the latest terms."
        />
      </ScrollView>
    </SafeAreaView>
  );
};
 
export default Legalandcom;
 
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


const PayPerPostScreen = ({ navigation }) => {
    const [credits, setCredits] = useState(0);

    const packages = [
        { id: 1, credits: 5, price: '₹199', savings: '' },
        { id: 2, credits: 20, price: '₹699', savings: 'Save 15%' },
        { id: 3, credits: 50, price: '₹1499', savings: 'Save 25%' },
    ];

    return (
        <SafeAreaView style={ppStyles.container}>
            <TouchableOpacity
                style={ppStyles.icon}
                onPress={() => navigation.navigate('Home')}
            >
                <AntDesign name="left" size={24} color="#dca818" />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={ppStyles.balanceCard}>
                    <Text style={ppStyles.balanceTitle}>Your Credit Balance</Text>
                    <Text style={ppStyles.balanceAmount}>{credits}</Text>
                    <Text style={ppStyles.balanceSubtext}>credits remaining</Text>
                </View>

                <Text style={ppStyles.sectionTitle}>Buy Credits</Text>

                {packages.map((pkg) => (
                    <TouchableOpacity
                        key={pkg.id}
                        style={ppStyles.packageCard}
                        onPress={() => setCredits(credits + pkg.credits)}
                    >
                        <View style={ppStyles.packageLeft}>
                            <Text style={ppStyles.creditAmount}>{pkg.credits} Credits</Text>
                            {pkg.savings ? (
                                <Text style={ppStyles.savingsText}>{pkg.savings}</Text>
                            ) : null}
                        </View>
                        <View style={ppStyles.packageRight}>
                            <Text style={ppStyles.priceText}>{pkg.price}</Text>
                            <Text style={ppStyles.buyButton}>Buy Now</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <Text style={ppStyles.infoText}>
                    1 credit = 1 premium post access
                </Text>

                {/* Subscription Hint Section */}
                <View style={ppStyles.hintContainer}>
                    <Text style={ppStyles.hintTitle}>Want Unlimited Access?</Text>
                    <Text style={ppStyles.hintText}>
                        Get unlimited access to all content with our subscription plans.
                    </Text>
                    <Text style={ppStyles.hintPrice}>Plans starting at ₹499/month</Text>
                    <TouchableOpacity
                        style={ppStyles.hintButton}
                        onPress={() => navigation.navigate('Subscription')}
                    >
                        <Text style={ppStyles.hintButtonText}>View Subscription Plans</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const ppStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    balanceCard: {
        backgroundColor: '#026456',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        marginBottom: 30,
    },
    balanceTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 10,
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: 48,
        fontWeight: 'bold',
    },
    balanceSubtext: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.8,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#026456',
    },
    packageCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    packageLeft: {
        flex: 1,
    },
    packageRight: {
        alignItems: 'flex-end',
    },
    creditAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#026456',
        marginBottom: 5,
    },
    savingsText: {
        color: '#DCA818',
        fontSize: 14,
        fontWeight: 'bold',
    },
    priceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#026456',
        marginBottom: 5,
    },
    buyButton: {
        color: '#DCA818',
        fontWeight: 'bold',
    },
    infoText: {
        textAlign: 'center',
        color: '#666666',
        marginTop: 20,
        fontSize: 14,
        marginBottom: 30,
    },
    hintContainer: {
        marginVertical: 20,
        padding: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#026456',
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
        backgroundColor: '#026456',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    hintButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon:{
        marginBottom:10,
    }
});

export default PayPerPostScreen;
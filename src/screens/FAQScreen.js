import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function FAQScreen() {
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState(null);

    const faqs = [
        {
            question: "How do I list my products on the ozaveria?",
            answer: "You can list your products by signing up as a seller, navigating to your dashboard, and adding details about your jewelry stock."
        },
        {
            question: "What are the benefits of using this ozaveria?",
            answer: "You can reach a broader audience across india, clear unsold stock efficiently, and maximize your profits with minimal effort."
        },
        {
            question: "How can buyers trust the listings?",
            answer: "We ensure all sellers are verified, and buyers can check reviews and ratings before making a purchase."
        },
        {
            question: "Is there any listing fee for sellers?",
            answer: "Currently, there is no listing fee. Sellers can list their products for free and pay a small commission only when the product is sold."
        }
    ];

    const toggleExpansion = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const FAQItem = ({ item, index }) => {
        const isExpanded = expandedIndex === index;

        return (
            <TouchableOpacity 
                style={styles.faqCard}
                onPress={() => toggleExpansion(index)}
                activeOpacity={0.7}
            >
                <View style={styles.questionContainer}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <AntDesign 
                        name={isExpanded ? "minus" : "plus"} 
                        size={20} 
                        color="#DCA818"
                    />
                </View>
                {isExpanded && (
                    <View style={styles.answerContainer}>
                        <Text style={styles.faqAnswer}>{item.answer}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="left" size={24} color="#026456" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
            </View>
            
            <ScrollView 
                style={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.subtitle}>Frequently Asked Questions</Text>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} item={faq} index={index} />
                ))}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
}

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
        elevation: 2,
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#026456',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#026456',
        marginBottom: 24,
        marginTop: 8,
    },
    faqCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F4F0EC',
        elevation: 1,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#026456',
        flex: 1,
        marginRight: 16,
    },
    answerContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F4F0EC',
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666666',
    },
    bottomPadding: {
        height: 20,
    },
});
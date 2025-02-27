import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TransactionDetailScreen = ({ route }) => {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.transactionDetailCard}>
        <Text style={styles.detailTitle}>Transaction Details</Text>
        <Image source={transaction.image} style={styles.transactionimg} resizeMode='cover'/>
        <View style={styles.detailTextContainer}>
          <Text style={styles.detailText}>Bank: {transaction.bank}</Text>
          <Text style={styles.detailText}>To: {transaction.to}</Text>
          <Text style={styles.detailText}>From: {transaction.from}</Text>
          <Text style={styles.detailText}>Amount: ₹{transaction.amount}</Text>
          <Text style={styles.detailText}>Transaction ID: {transaction.transactionId}</Text>
          <Text style={styles.detailText}>Date: {transaction.date}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 30,
  },
  transactionDetailCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center'
  },
  detailTextContainer: {
    flexDirection: 'column',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#026456',
    marginBottom: 15,
    textAlign: 'center'
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    paddingLeft: 20,
    fontWeight: 'bold'
  },
  transactionimg: {
    width: 250,
    height: 200,
    marginLeft: 20
  },
});

export default TransactionDetailScreen;

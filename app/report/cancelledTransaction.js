import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { getCancelledTransactions } from '../(services)/api/transactionsApi';

const CancelledTransaction = () => {
  const [cancelledTransactions, setCancelledTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(state => state.auth.user?.userId);

  useEffect(() => {
    const fetchCancelledTransactions = async () => {
      if (!userId) {
        console.log("User ID not available");
        setLoading(false);
        return;
      }

      try {
        const data = await getCancelledTransactions(userId);  // Fetch transactions without token
        setCancelledTransactions(data.data);
      } catch (error) {
        console.error("Error fetching cancelled transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledTransactions();
  }, [userId]);

  const renderTransaction = ({ item }) => (
    <View style={[styles.transactionItem, item.transaction.type === 'income' ? styles.income : styles.expense]}>
      <View>
        <Text style={styles.transactionDescription}>{item.transaction.description}</Text>
        <Text style={styles.transactionCategory}>{item.transaction.category}</Text>
        <Text style={styles.transactionDate}>Cancelled on: {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.transactionAmount}>
        {item.transaction.type === 'income' ? `+` : `-`} ${item.transaction.amount}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff3b30" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cancelled Transactions</Text>
      {cancelledTransactions.length > 0 ? (
        <FlatList
          data={cancelledTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransaction}
          style={styles.transactionList}
        />
      ) : (
        <Text style={styles.noTransactions}>No cancelled transactions found.</Text>
      )}
    </View>
  );
};

export default CancelledTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff3b30',
  },
  transactionList: {
    marginTop: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f8d7da',
    borderRadius: 10,
    marginBottom: 10,
  },
  income: {
    backgroundColor: '#d4edda',
  },
  expense: {
    backgroundColor: '#f8d7da',
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactions: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
});

import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useQuery } from '@tanstack/react-query';
import { getRecentTransactions } from '../(services)/api/transactionsApi';

const Transactions = () => {
  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user?.userId);

  const { data: transactions = [], isLoading, isError, error } = useQuery({
    queryKey: ['recentTransactions', userId],
    queryFn: () => getRecentTransactions(userId, token),
    enabled: !!userId && !!token, // Ensures the query only runs when userId and token are available
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#6200EE" />;
  }

  if (isError) {
    console.error('Error fetching recent transactions:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading transactions</Text>
      </View>
    );
  }

  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavings = 0;

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        totalIncome += amount;
      } else if (transaction.type === 'expense') {
        totalExpense += amount;
      } else if (transaction.type === 'saving') {
        totalSavings += amount;
      }
    });

    return { totalIncome, totalExpense, totalSavings };
  };

  const { totalIncome, totalExpense, totalSavings } = calculateTotals();

  const renderItem = ({ item }) => {
    const { description, amount, type, category, createdAt } = item;
    return (
      <View style={[styles.transactionContainer, styles[`type_${type}`]]}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={type === 'income' ? 'arrow-circle-up' : type === 'expense' ? 'arrow-circle-down' : 'bank'}
            size={24}
            color="white"
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{description}</Text>
          <Text style={styles.transactionCategory}>{category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>
            {parseFloat(amount)}Rwf
          </Text>
          <Text style={styles.transactionDate}>{new Date(createdAt).toLocaleDateString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.dashboard}>
        <View style={[styles.card, styles.incomeCard]}>
          <FontAwesome name="arrow-circle-up" size={30} color="white" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Income</Text>
            <Text style={styles.cardAmount}>{totalIncome}</Text>
            <Text style={styles.currency}>RWF</Text>

          </View>
        </View>

        <View style={[styles.card, styles.expenseCard]}>
          <FontAwesome name="arrow-circle-down" size={30} color="white" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Expenses</Text>
            <Text style={styles.cardAmount}>{totalExpense}</Text>
            <Text style={styles.currency}>RWF</Text>

          </View>
        </View>

        <View style={[styles.card, styles.savingsCard]}>
          <FontAwesome name="bank" size={30} color="white" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Savings</Text>
            <Text style={styles.cardAmount}>{totalSavings}</Text>
            <Text style={styles.currency}>RWF</Text>
          </View>
        </View>
      </View>
      <Text style={styles.title}>Transactions History</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 100, // Ensures card height is consistent
  },
  incomeCard: {
    backgroundColor: 'green',
  },
  expenseCard: {
    backgroundColor: 'red',
  },
  savingsCard: {
    backgroundColor: 'blue',
  },
  cardContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  cardAmount: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  currency: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'space-between',
  },
  iconContainer: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  type_income: {
    borderLeftColor: 'green',
    borderLeftWidth: 4,
  },
  type_expense: {
    borderLeftColor: 'red',
    borderLeftWidth: 4,
  },
  type_saving: {
    borderLeftColor: 'blue',
    borderLeftWidth: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

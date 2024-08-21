import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getExpense, getIncome, getNetBalance, addIncome } from '../(services)/api/transactionsApi';

const Income = () => {
  const queryClient = useQueryClient();
  const cUser = useSelector((state) => state.auth.user) || {};
  const token = useSelector((state) => state.auth.token);
  const userId = cUser.userId;

  const { data: netBalanceData, isLoading: isNetBalanceLoading } = useQuery({
    queryKey: ['netBalance', userId, token],
    queryFn: () => getNetBalance(userId, token),
  });
  
  const { data: incomeData, isLoading: isIncomeLoading } = useQuery({
    queryKey: ['income', userId, token],
    queryFn: () => getIncome(userId, token),
  });

  const { data: expenseData, isLoading: isExpenseLoading } = useQuery({
    queryKey: ['expenses', userId, token],
    queryFn: () => getExpense(userId, token),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [incomeList, setIncomeList] = useState([]);

  useEffect(() => {
    if (incomeData) {
      setIncomeList(incomeData.income || []); // Ensure you're using the correct key from the API response
    }
  }, [incomeData]);

  const mutation = useMutation({
    mutationFn: (newIncome) => addIncome(newIncome, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['income', userId, token]); // Refetch income data after adding
    },
  });

  const handleAddIncome = () => {
    if (description && amount && category) {
      const newIncome = {
        description,
        amount: parseFloat(amount),
        category,
        userId,
      };

      mutation.mutate(newIncome, {
        onSuccess: () => {
          setDescription('');
          setAmount('');
          setCategory('');
          setModalVisible(false);
        },
      });
    }
  };

  if (isNetBalanceLoading || isIncomeLoading || isExpenseLoading) {
    return <Text>Loading...</Text>; // You can replace this with a proper loading indicator
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Net Balance</Text>
        <Text style={styles.amountText}>${netBalanceData?.balance}</Text>
        <View style={styles.incomeExpenseRow}>
          <View style={styles.incomeContainer}>
            <FontAwesome name="arrow-down" size={24} color="green" />
            <Text style={styles.labelText}>Income</Text>
            <Text style={styles.incomeAmount}>{incomeData?.totalIncome || '$0.00'}</Text>
          </View>
          <View style={styles.expenseContainer}>
            <FontAwesome name="arrow-up" size={24} color="red" />
            <Text style={styles.labelText}>Expense</Text>
            <Text style={styles.expenseAmount}>{expenseData?.totalExpenses || '$0.00'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.recentTransactionsTitle}>Recent Incomes</Text>
      <FlatList
        data={incomeList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.transactionList}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionAmount}>+${item.amount}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Record Income</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
            />
            <Button title="Add Income" onPress={handleAddIncome} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  balanceCard: {
    backgroundColor: "#6200ea",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginStart: 120,
  },
  amountText: {
    marginStart: 120,
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
  incomeExpenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  incomeContainer: {
    alignItems: "center",
  },
  expenseContainer: {
    alignItems: "center",
  },
  labelText: {
    fontSize: 16,
    color: "#fff",
  },
  incomeAmount: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginTop: 5,
  },
  expenseAmount: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  recentTransactionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionList: {
    paddingBottom: 100, // For space below the list
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "500",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6200ea",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#6200ea",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default Income;

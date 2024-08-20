import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const transactions = [
  { id: '1', description: 'Freelance Project', amount: 500 },
  { id: '2', description: 'Gift', amount: 200 },
  { id: '3', description: 'Salary', amount: 1000 },
  // Add more transactions as needed
];

const Income = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState('income');
  const [incomeList, setIncomeList] = useState(transactions);

  const handleAddIncome = () => {
    if (description && amount && category) {
      setIncomeList([
        ...incomeList,
        { id: (incomeList.length + 1).toString(), description, amount: parseFloat(amount) }
      ]);
      setDescription('');
      setAmount('');
      setCategory('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Net Balance</Text>
        <Text style={styles.amountText}>$2000</Text>
        <View style={styles.incomeExpenseRow}>
          <View style={styles.incomeContainer}>
            <FontAwesome name="arrow-down" size={24} color="green" />
            <Text style={styles.labelText}>Income</Text>
            <Text style={styles.incomeAmount}>$2500</Text>
          </View>
          <View style={styles.expenseContainer}>
            <FontAwesome name="arrow-up" size={24} color="red" />
            <Text style={styles.labelText}>Expense</Text>
            <Text style={styles.expenseAmount}>$500</Text>
          </View>
        </View>
      </View>

      <Text style={styles.recentTransactionsTitle}>Recent Income</Text>
      <FlatList
        data={incomeList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionAmount}>${item.amount}</Text>
          </View>
        )}
        contentContainerStyle={styles.transactionList}
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
    marginStart:120,
  },
  amountText: {
    marginStart:120,
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

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getExpense, getIncome, getNetBalance, addTransaction } from '../(services)/api/transactionsApi'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

// Validation schema with Yup
const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
  category: Yup.string().required('Category is required'),
});

const incomeCategories = [
  { label: 'Salary', value: 'salary' },
  { label: 'Investment', value: 'investment' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Rental Income', value: 'rental_income' },
  { label: 'Other', value: 'other' },
];

const expenseCategories = [
  { label: 'Food', value: 'food' },
  { label: 'Transport', value: 'transport' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Other', value: 'other' },
];

const NewTransaction = () => {
  const queryClient = useQueryClient();
  const cUser = useSelector((state) => state.auth.user) || {};
  const token = useSelector((state) => state.auth.token);
  const userId = cUser.userId;

  const { data: netBalanceData } = useQuery({
    queryKey: ['netBalance', userId, token],
    queryFn: () => getNetBalance(userId, token),
  });

  const { data: incomeData } = useQuery({
    queryKey: ['income', userId, token],
    queryFn: () => getIncome(userId, token),
  });

  const { data: expenseData } = useQuery({
    queryKey: ['expenses', userId, token],
    queryFn: () => getExpense(userId, token),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [transactionType, setTransactionType] = useState('income');
  const [error, setError] = useState('');

  useEffect(() => {
    if (incomeData) {
      setIncomeList(incomeData.income || []);
    }
    if (expenseData) {
      setExpenseList(expenseData.expenses || []);
    }
  }, [incomeData, expenseData]);

  const mutation = useMutation({
    mutationFn: async (newTransaction) => {
      // Check for balance before adding transaction
      if (newTransaction.type === 'expense' && newTransaction.amount > netBalanceData.balance) {
        throw new Error('Insufficient balance');
      }
      try {
        await addTransaction(userId, newTransaction, token);
      } catch (error) {
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'An error occurred');
        }
        throw new Error('An error occurred');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['income', userId, token]);
      queryClient.invalidateQueries(['expenses', userId, token]);
      setModalVisible(false);
    },
    onError: (error) => {
      setError(error.message || 'An error occurred');
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>My Balance</Text>
        <Text style={styles.amountText}>{netBalanceData?.balance || '0.00'}Rwf</Text>
        <View style={styles.incomeExpenseRow}>
          <View style={styles.incomeContainer}>
            <FontAwesome name="arrow-down" size={24} color="green" />
            <Text style={styles.labelText}>Income</Text>
            <Text style={styles.incomeAmount}>{incomeData?.totalIncome || '0.00'}Rwf</Text>
          </View>
          <View style={styles.expenseContainer}>
            <FontAwesome name="arrow-up" size={24} color="red" />
            <Text style={styles.labelText}>Expense</Text>
            <Text style={styles.expenseAmount}>{expenseData?.totalExpenses || '0.00'}Rwf</Text>
          </View>
        </View>
      </View>

      <Text style={styles.recentTransactionsTitle}>Recent {transactionType}</Text>
      <View style={styles.transactionTypeContainer}>
        <TouchableOpacity
          style={[styles.transactionTypeButton, transactionType === 'income' && styles.activeButton]}
          onPress={() => setTransactionType('income')}
        >
          <Text style={styles.transactionTypeText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.transactionTypeButton, transactionType === 'expense' && styles.activeButton]}
          onPress={() => setTransactionType('expense')}
        >
          <Text style={styles.transactionTypeText}>Expense</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactionType === 'income' ? incomeList : expenseList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.transactionList}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionAmount}>
              {transactionType === 'income' ? `+${item.amount}` : `-${item.amount}`}Rwf
            </Text>
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="times" size={24} color="red" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Record Transaction</Text>
            <View style={styles.transactionTypeContainer}>
              <TouchableOpacity
                style={[styles.transactionTypeButton, transactionType === 'income' && styles.activeButton]}
                onPress={() => setTransactionType('income')}
              >
                <Text style={styles.transactionTypeText}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.transactionTypeButton, transactionType === 'expense' && styles.activeButton]}
                onPress={() => setTransactionType('expense')}
              >
                <Text style={styles.transactionTypeText}>Expense</Text>
              </TouchableOpacity>
            </View>
            <Formik
              initialValues={{ description: '', amount: '', category: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                const newTransaction = {
                  description: values.description,
                  amount: parseFloat(values.amount),
                  category: values.category,
                  type: transactionType,
                };
                mutation.mutate(newTransaction);
                resetForm();
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                  <TextInput
                    style={[styles.input, touched.description && errors.description && { borderColor: 'red' }]}
                    placeholder="Description"
                    placeholderTextColor="#888"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                  {touched.description && errors.description && (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  )}

                  <TextInput
                    style={[styles.input, touched.amount && errors.amount && { borderColor: 'red' }]}
                    placeholder="Amount"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    onChangeText={handleChange('amount')}
                    onBlur={handleBlur('amount')}
                    value={values.amount}
                  />
                  {touched.amount && errors.amount && (
                    <Text style={styles.errorText}>{errors.amount}</Text>
                  )}

                  <Picker
                    selectedValue={values.category}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFieldValue('category', itemValue)}
                  >
                    <Picker.Item label="Select Category" value="" />
                    {(transactionType === 'income' ? incomeCategories : expenseCategories).map((category) => (
                      <Picker.Item key={category.value} label={category.label} value={category.value} />
                    ))}
                  </Picker>
                  {touched.category && errors.category && (
                    <Text style={styles.errorText}>{errors.category}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <LinearGradient
                      colors={['#6200ea', '#b341f4']}
                      style={styles.submitButtonBackground}
                    >
                      <Text style={styles.submitButtonText}>Add {transactionType}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}
                </>
              )}
            </Formik>
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
    top:54,
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
    marginStart: 100,
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
    color: "#a4f5ab",
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
    marginTop: 20,
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
    bottom: 80,
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
    borderRadius: 16,
    padding: 17,
    width: '86%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6200ea',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    width: '100%',
    borderRadius: 12,
  },
  submitButtonBackground: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  transactionTypeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#96a5b5',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#034203',
  },
  transactionTypeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
});
export default NewTransaction;

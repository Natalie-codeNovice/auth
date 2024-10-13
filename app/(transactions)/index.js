import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, FlatList, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getExpense, getIncome, getNetBalance, addTransaction, cancelTransaction } from '../(services)/api/transactionsApi'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { Swipeable } from 'react-native-gesture-handler';

// Validation schema with Yup
const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
  category: Yup.string().required('Category is required'),
});

const renderRightActions = (transactionId, onCancel) => {
  return (
    <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => onCancel(transactionId)}
    >
      <Text style={styles.cancelText}>Cancel</Text>
    </TouchableOpacity>
  );
};

const renderLeftActions = (transactionId, onCancel) => {
  return (
    <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => onCancel(transactionId)}
    >
      <Text style={styles.cancelText}>Cancel</Text>
    </TouchableOpacity>
  );
};
const incomeCategories = [
  { label: 'Salary/Wages', value: 'salary' },
  { label: 'Bonuses/Commissions', value: 'bonus' },
  { label: 'Investment Income', value: 'investment' },
  { label: 'Freelance Income', value: 'freelance' },
  { label: 'Rental Income', value: 'rental_income' },
  { label: 'Dividends', value: 'dividends' },
  { label: 'Interest Income', value: 'interest' },
  { label: 'Pension/Retirement Income', value: 'pension' },
  { label: 'Gifts/Donations', value: 'gifts' },
  { label: 'Government Benefits', value: 'government_benefits' },
  { label: 'Side Business Income', value: 'side_business' },
  { label: 'Royalties', value: 'royalties' },
  { label: 'Other', value: 'other_income' },
];

const expenseCategories = [
  { label: 'Housing', value: 'housing' },
  { label: 'Rent/Mortgage', value: 'rent_mortgage' },
  { label: 'Property Taxes', value: 'property_taxes' },
  { label: 'Home Insurance', value: 'home_insurance' },
  { label: 'Repairs/Maintenance', value: 'repairs_maintenance' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Electricity', value: 'electricity' },
  { label: 'Water', value: 'water' },
  { label: 'Gas', value: 'gas' },
  { label: 'Internet', value: 'internet' },
  { label: 'Phone', value: 'phone' },
  { label: 'Food', value: 'food' },
  { label: 'Groceries', value: 'groceries' },
  { label: 'Dining Out', value: 'dining_out' },
  { label: 'Snacks/Coffee', value: 'snacks_coffee' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Gas/Fuel', value: 'gas_fuel' },
  { label: 'Public Transportation', value: 'public_transport' },
  { label: 'Car Payments', value: 'car_payments' },
  { label: 'Insurance', value: 'car_insurance' },
  { label: 'Repairs/Maintenance', value: 'car_repairs' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Medical Bills', value: 'medical_bills' },
  { label: 'Insurance Premiums', value: 'health_insurance' },
  { label: 'Medications', value: 'medications' },
  { label: 'Gym/Fitness Memberships', value: 'gym_membership' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Movies/Concerts', value: 'movies_concerts' },
  { label: 'Subscriptions', value: 'subscriptions' },
  { label: 'Hobbies', value: 'hobbies' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Apparel', value: 'apparel' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Education', value: 'education' },
  { label: 'Tuition', value: 'tuition' },
  { label: 'Books/Supplies', value: 'books_supplies' },
  { label: 'Student Loans', value: 'student_loans' },
  { label: 'Personal Care', value: 'personal_care' },
  { label: 'Haircuts', value: 'haircuts' },
  { label: 'Toiletries', value: 'toiletries' },
  { label: 'Spa Treatments', value: 'spa_treatments' },
  { label: 'Travel', value: 'travel' },
  { label: 'Flights', value: 'flights' },
  { label: 'Accommodation', value: 'accommodation' },
  { label: 'Meals', value: 'meals' },
  { label: 'Childcare', value: 'childcare' },
  { label: 'Daycare', value: 'daycare' },
  { label: 'School Fees', value: 'school_fees' },
  { label: 'Activities', value: 'activities' },
  { label: 'Miscellaneous', value: 'miscellaneous' },
  { label: 'Gifts', value: 'gifts_expense' },
  { label: 'Donations', value: 'donations_expense' },
  { label: 'Pet Expenses', value: 'pet_expenses' },
  { label: 'Unexpected Expenses', value: 'unexpected_expenses' },
];

const NewTransaction = () => {
  const queryClient = useQueryClient();
  const cUser = useSelector((state) => state.auth.user) || {};
  const token = useSelector((state) => state.auth.token);
  const userId = cUser.userId;
  const [loading, setLoading] = useState(false);
  
  const { data: netBalanceData, isLoading: isLoadingNetBalance } = useQuery({
    queryKey: ['netBalance', userId, token],
    queryFn: () => getNetBalance(userId, token),
  });

  const { data: incomeData, isLoading: isLoadingIncome } = useQuery({
    queryKey: ['income', userId, token],
    queryFn: () => getIncome(userId, token),
  });

  const { data: expenseData, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', userId, token],
    queryFn: () => getExpense(userId, token),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [transactionType, setTransactionType] = useState('income');
  const [error, setError] = useState('');

  const confirmCancel = (transactionId) => {
    Alert.alert(
      "Cancel Transaction",
      "Are you sure you want to cancel this transaction?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            if (!transactionId) {
              ToastAndroid.show("Invalid transaction ID", ToastAndroid.SHORT);
              return;
            }
            try {
              await cancelTransaction(transactionId);
              queryClient.invalidateQueries(['income', userId, token]);
              queryClient.invalidateQueries(['expenses', userId, token]);
              queryClient.invalidateQueries(['netBalance', userId, token]); 
              ToastAndroid.show("Transaction cancelled successfully", ToastAndroid.SHORT);
            } catch (error) {
              console.error("Error cancelling transaction:", error);
              const errorMessage = error.response?.data?.message || "Failed to cancel transaction";
              ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

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
      if (newTransaction.type === 'expense' && newTransaction.amount > netBalanceData.balance) {
        throw new Error('Insufficient balance');
      }
      try {
        await addTransaction(userId, newTransaction, token);
      } catch (error) {
        // Ensure the loading state is reset in case of an error
        setLoading(false);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'An error occurred');
        }
        throw new Error('An error occurred');
      }
    },
    onSuccess: () => {
      // Reset loading state and close modal on success
      setLoading(false); // Reset loading state here
      queryClient.invalidateQueries(['income', userId, token]);
      queryClient.invalidateQueries(['expenses', userId, token]);
      queryClient.invalidateQueries(['netBalance', userId, token]); 
      setModalVisible(false);
    },
    onError: (error) => {
      // Reset loading state on error
      setLoading(false); // Reset loading state here
      setError(error.message || 'An error occurred');
    },
  });

  // Check if all data is loaded
  const isLoading = isLoadingNetBalance || isLoadingIncome || isLoadingExpenses;

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>My Balance</Text>
        <Text style={styles.amountText}>{netBalanceData?.balance || '0.00'} Rwf</Text>
        <View style={styles.incomeExpenseRow}>
          <View style={styles.incomeContainer}>
            <FontAwesome name="arrow-down" size={24} color="green" />
            <Text style={styles.labelText}>Income</Text>
            <Text style={styles.incomeAmount}>{incomeData?.totalIncome || '0.00'} Rwf</Text>
          </View>
          <View style={styles.expenseContainer}>
            <FontAwesome name="arrow-up" size={24} color="red" />
            <Text style={styles.labelText}>Expense</Text>
            <Text style={styles.expenseAmount}>{expenseData?.totalExpenses || '0.00'} Rwf</Text>
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
          <Swipeable
            renderRightActions={() => renderRightActions(item.id, confirmCancel)}
            renderLeftActions={() => renderLeftActions(item.id, confirmCancel)}
          >
            <View style={styles.transactionItem}>
              <Text style={styles.transactionDescription}>{item.description}</Text>
              <Text style={styles.transactionAmount}>
                {transactionType === 'income' ? `+${item.amount}` : `-${item.amount}`} Rwf
              </Text>
            </View>
          </Swipeable>
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
              onSubmit={async (values, { resetForm }) => {
                setLoading(true);
                const newTransaction = {
                  ...values,
                  type: transactionType,
                  amount: parseFloat(values.amount), // Ensure amount is a number
                };
                try {
                  await mutation.mutateAsync(newTransaction);
                  resetForm();
                  setError('');
                  ToastAndroid.show('Transaction added successfully!', ToastAndroid.SHORT);
                } catch (err) {
                  setError(err.message || 'An error occurred');
                }
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <>
                  <TextInput
                    placeholder="Description"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                    style={styles.input}
                  />
                  {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                  <TextInput
                    placeholder="Amount"
                    keyboardType="numeric"
                    onChangeText={handleChange('amount')}
                    onBlur={handleBlur('amount')}
                    value={values.amount}
                    style={styles.input}
                  />
                  {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

                  <Picker
                    selectedValue={values.category}
                    onValueChange={handleChange('category')}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a category" value="" />
                    {(transactionType === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                      <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                    ))}
                  </Picker>
                  {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading} // Disable button when loading
                  >
                    <LinearGradient
                      colors={['#6200ea', '#b341f4']}
                      style={styles.submitButtonBackground}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.submitButtonText}>Add {transactionType}</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                  {error && <Text style={styles.errorText}>{error}</Text>}
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
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: "500",
  },
  transactionAmount: {
    fontSize: 14,
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
  cancelButton: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    margin: 10,
    height: 37,
    borderRadius: 5,
    bottom: 10,
  },
  cancelText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default NewTransaction;

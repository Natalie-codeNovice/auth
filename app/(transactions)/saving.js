import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Modal, TextInput, Button, Platform, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux'; 
import { addTransaction, getSavings, getNetBalance, useSaving } from '../(services)/api/transactionsApi'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Yup from 'yup';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native-paper';

const categoryOptions = [
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

const Saving = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [minDate, setMinDate] = useState(new Date()); 
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const queryClient = useQueryClient();
  const token = useSelector(state => state.auth.token); 
  const userId = useSelector(state => state.auth.user?.userId);
 

  // Query for fetching savings
  const { data = { totalSavings: 0, savings: [] }, isLoading, error, refetch } = useQuery({
    queryKey: ['savings', userId],
    queryFn: () => getSavings(userId, token),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Error loading savings:', error);
    }
  });

  // Mutation for adding a saving
  const mutation = useMutation({
    mutationFn: (newTransaction) => addTransaction(userId, newTransaction, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['savings', userId]);
      setModalVisible(false);
      setIsSubmitting(false); // Enable button after success
    },
    onError: (error) => {
      console.error('Error adding transaction:', error);
      Alert.alert("Error", "An error occurred while adding the saving. Please try again.");
      setIsSubmitting(false); // Enable button if there's an error
    },
  });

  // Mutation for using a saving
  const useSavingMutation = useMutation({
    mutationFn: (savingId) => useSaving(savingId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['savings', userId]);
      Alert.alert("Saving Used", "The saving has been marked as used.");
    },
    onError: (error) => {
      console.error('Error using saving:', error);
      Alert.alert("Error", "An error occurred while using the saving. Please try again.");
    },
  });

  // Handler for pressing the use button
  const handleUseButtonPress = (isOverdue, savingId, usageDate) => {
    if (!isOverdue) {
      Alert.alert(
        'Cannot Use Savings',
        `You will be able to use these savings on ${usageDate.toDateString()}.`
      );
    } else {
      Alert.alert(
        'Confirm Use',
        'Are you sure you want to use these savings?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Use', onPress: () => useSavingMutation.mutate(savingId) }
        ]
      );
    }
  };

  // Handler for adding a saving
  const handleAddSaving = async (values) => {
    try {
      setIsSubmitting(true); // Disable button on submit

      const netBalanceResponse = await getNetBalance(userId, token);
      const netBalance = netBalanceResponse?.balance || 0;

      if (netBalance <= 0) {
        Alert.alert("Netbalance not found!", "Add income first before creating a saving.");
        setIsSubmitting(false); // Re-enable button if there's no net balance
        return;
      }

      const amount = parseFloat(values.amount);

      if (netBalance < amount) {
        Alert.alert("Error", "Insufficient balance to create a saving.");
        setIsSubmitting(false); // Re-enable button if insufficient balance
        return;
      }

      await mutation.mutateAsync({ ...values, usageDate: date.toISOString().split('T')[0] });
      Alert.alert("Saving Added", "New saving has been recorded.");
    } catch (error) {
      console.error('Error adding saving:', error);
      Alert.alert("Error", "An error occurred while adding the saving. Please try again.");
      setIsSubmitting(false); // Re-enable button if an error occurs
    }
  };

  // Handler for date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate >= minDate) {
      setDate(selectedDate);
    } else {
      Alert.alert("Invalid Date", "Please select a future date.");
    }
  };

  // Rendering each item in the FlatList
  const renderItem = React.useCallback(({ item }) => {
    const amount = parseFloat(item.amount) || 0;
    const usageDate = new Date(item.usageDate);
    const isOverdue = new Date() > usageDate;

    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <Text style={styles.description}>{item.transactions.description}</Text>
          <Text style={styles.amount}>{amount} RWF</Text>
        </View>
        <TouchableOpacity 
          style={[styles.useButton, isOverdue ? styles.buttonEnabled : styles.buttonDisabled]}
          onPress={() => handleUseButtonPress(isOverdue, item.id, usageDate)}
        >
          <Text style={styles.buttonText}>Use</Text>
        </TouchableOpacity>
      </View>
    );
  }, [handleUseButtonPress]);

  // Handler for refreshing the list
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.isLoading}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.totalSavings}>
        Total Savings: {data.totalSavings === 0 ? '0.00 RWF' : data.totalSavings + ' RWF'}
      </Text>
      {data.totalSavings > 0 && data.savings.length > 0 ? (
        <FlatList
          data={data.savings}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      ) : (
        <Text style={styles.noData}>
          {data.totalSavings === 0 ? 'No savings available.' : 'No savings data available.'}
        </Text>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Icon name="save" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
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
            <Text style={styles.modalTitle}>Add New Saving</Text>
            <Formik
              initialValues={{
                description: '',
                amount: '',
                type: 'saving',
                category: '',
              }}
              validationSchema={Yup.object({
                description: Yup.string().required('Description is required'),
                amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
                category: Yup.string().required('Category is required'),
              })}
              onSubmit={(values) => handleAddSaving(values)}
              
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Description"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                  {errors.description && touched.description ? (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  ) : null}
                  <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    onChangeText={handleChange('amount')}
                    onBlur={handleBlur('amount')}
                    value={values.amount}
                  />
                  {errors.amount && touched.amount ? (
                    <Text style={styles.errorText}>{errors.amount}</Text>
                  ) : null}
                  <RNPickerSelect
                    onValueChange={handleChange('category')}
                    items={categoryOptions}
                    placeholder={{ label: 'Select a category', value: null }}
                    style={pickerSelectStyles}
                    value={values.category}
                  />
                  {errors.category && touched.category ? (
                    <Text style={styles.errorText}>{errors.category}</Text>
                  ) : null}
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerText}>Select Usage Date: {date.toDateString()}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      minimumDate={minDate}
                      onChange={handleDateChange}
                    />
                  )}
                  <Button
                    onPress={handleSubmit}
                    title="Save"
                    disabled={isSubmitting} // Disable button while submitting
                    color={isSubmitting ? 'gray' : '#0066cc'}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Saving;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  totalSavings: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,

  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContent: {
    flexDirection: 'column',
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
  amount: {
    fontSize: 14,
    color: 'green',
  },
  useButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonEnabled: {
    backgroundColor: '#0066cc',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  datePickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  isLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
});

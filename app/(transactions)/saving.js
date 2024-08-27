import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Modal, TextInput, Button, Platform, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import { addTransaction, getSavings, getNetBalance, useSaving } from '../(services)/api/transactionsApi'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Yup from 'yup';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


const categoryOptions = [
  { label: 'Shelter', value: 'Shelter' },
  { label: 'Food', value: 'Food' },
  { label: 'Transportation', value: 'Transportation' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Other', value: 'Other' },
];

const Saving = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [minDate, setMinDate] = useState(new Date()); 
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const queryClient = useQueryClient();
  const token = useSelector(state => state.auth.token); 
  const userId = useSelector(state => state.auth.user?.userId);

  const { mutate: useSavingMutate } = useMutation({
    mutationFn: (savingId) => useSaving(savingId),
    onSuccess: () => {
      queryClient.invalidateQueries(['savings', userId]);
      Alert.alert("Success", "Amount is added to net balance.");
    },
    onError: (error) => {
      console.error('Error using saving:', error);
      Alert.alert("Error", "An error occurred while using the saving. Please try again.");
    },
  });
  

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['savings', userId],
    queryFn: () => getSavings(userId, token),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (newTransaction) => addTransaction(userId, newTransaction, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['savings', userId]);
      setModalVisible(false);
    },
    onError: (error) => {
      console.error('Error adding transaction:', error);
      Alert.alert("Error", "An error occurred while adding the saving. Please try again.");
    },
  });

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
          { text: 'Use', onPress: () => useSavingMutate(savingId) }
        ]
      );
    }
  };
  

  const handleAddSaving = async (values) => {
    try {
      const netBalanceResponse = await getNetBalance(userId, token);
      const netBalance = netBalanceResponse?.balance || 0;

      if (netBalance === undefined) {
        Alert.alert("Error", "Unable to fetch net balance. Please try again.");
        return;
      }

      if (netBalance <= 0) {
        Alert.alert("Error", "Add income first before creating a saving.");
        return;
      }

      const amount = parseFloat(values.amount);

      if (netBalance < amount) {
        Alert.alert("Error", "Insufficient balance to create a saving.");
        return;
      }

      await mutation.mutateAsync({ ...values, usageDate: date.toISOString().split('T')[0] });
      Alert.alert("Saving Added", "New saving has been recorded.");
    } catch (error) {
      console.error('Error adding saving:', error);
      Alert.alert("Error", "An error occurred while adding the saving. Please try again.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate >= minDate) {
      setDate(selectedDate);
    } else {
      Alert.alert("Invalid Date", "Please select a future date.");
    }
  };

  const renderItem = ({ item }) => {
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
  };
  

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(); // Refetch the data
    setRefreshing(false);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading savings</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.totalSavings}>Total Savings: {data?.totalSavings || '0.00'} RWF</Text>
      {data?.savings.length > 0 ? (
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
        <Text style={styles.noData}>No savings data available.</Text>
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
                  {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    onChangeText={handleChange('amount')}
                    onBlur={handleBlur('amount')}
                    value={values.amount}
                  />
                  {touched.amount && errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                  
                  <RNPickerSelect
                    placeholder={{ label: 'Select a category...', value: '' }}
                    items={categoryOptions}
                    onValueChange={handleChange('category')}
                    value={values.category}
                    style={pickerSelectStyles}
                  />
                  {touched.category && errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                  
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text>I will use it at</Text>
                    <Text style={styles.datePickerText}>{date.toISOString().split('T')[0]}</Text>
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      minimumDate={minDate}
                    />
                  )}
                  
                  <Button title="SAVE" onPress={handleSubmit} />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 5,
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    top:54,
  },
  totalSavings: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    color: '#007bff',
  },
  useButton: {
    padding: 10,
    borderRadius: 5,
  },
  buttonEnabled: {
    backgroundColor: '#28a745',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  datePickerButton: {
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: 'green',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default Saving;

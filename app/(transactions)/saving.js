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
  const [refreshing, setRefreshing] = useState(false);
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
    },
    onError: (error) => {
      console.error('Error adding transaction:', error);
      Alert.alert("Error", "An error occurred while adding the saving. Please try again.");
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
      const netBalanceResponse = await getNetBalance(userId, token);
      const netBalance = netBalanceResponse?.balance || 0;

      if (netBalance <= 0) {
        Alert.alert("Netbalance not found!", "Add income first before creating a saving.");
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
                  <View>
                    <RNPickerSelect
                      onValueChange={handleChange('category')}
                      onBlur={handleBlur('category')}
                      value={values.category}
                      items={categoryOptions}
                      placeholder={{ label: 'Select a category...', value: '' }}
                      style={pickerSelectStyles}
                    />
                    {errors.category && touched.category ? (
                      <Text style={styles.errorText}>{errors.category}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerText}>Select Date: {date.toDateString()}</Text>
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
                  <Button title="Save" onPress={handleSubmit} />
                </View>
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
    top: "5%"
  },
  totalSavings: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    marginBottom: 60,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemContent: {
    flex: 1,
  },
  description: {
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  useButton: {
    padding: 10,
    borderRadius: 5,
  },
  buttonEnabled: {
    backgroundColor: 'green',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  datePickerButton: {
    marginTop: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#0066cc',
  },
  isLoading:{
    top:'50%',
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  placeholder: {
    color: '#999',
  },
});

export default Saving;

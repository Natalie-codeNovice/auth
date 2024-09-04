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

  const { data = { totalSavings: 0, savings: [] }, isLoading, error, refetch } = useQuery({
    queryKey: ['savings', userId],
    queryFn: () => getSavings(userId, token),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Error loading savings:', error);
    }
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate >= minDate) {
      setDate(selectedDate);
    } else {
      Alert.alert("Invalid Date", "Please select a future date.");
    }
  };

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return <Text>Loading...</Text>;
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
                    placeholder={{ label: 'Select a category...', value: '' }}
                    items={categoryOptions}
                    onValueChange={handleChange('category')}
                    value={values.category}
                    style={pickerSelectStyles}
                  />
                  {errors.category && touched.category ? (
                    <Text style={styles.errorText}>{errors.category}</Text>
                  ) : null}
                  
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
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

                  <Button title="Add Saving" onPress={handleSubmit} />
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
    padding: 20,
    top:57
  },
  totalSavings: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    flexGrow: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    color: 'green',
  },
  useButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
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
    bottom: 80,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
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
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  datePickerButton: {
    marginVertical: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#007bff',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default Saving;

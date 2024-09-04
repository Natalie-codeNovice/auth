import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList, Platform, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getCustomReport } from '../(services)/api/transactionsApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const Custom = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('all'); // To filter by type

  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user?.userId);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['customReport', startDate.toISOString(), endDate.toISOString()],
    queryFn: () => getCustomReport(userId, token, startDate.toISOString(), endDate.toISOString()),
    enabled: false, // Disable automatic refetching
    refetchOnWindowFocus: false,
    retry: false,
  });

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      Alert.alert('Validation Error', 'Please select both start and end dates.');
      return;
    }

    refetch();
    setModalVisible(true); // Show modal when report is ready
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const filterTransactions = (transactions) => {
    if (selectedType === 'all') return transactions;
    return transactions.filter(item => item.type === selectedType);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Generate Custom Report</Text>

      <View style={styles.datePickerContainer}>
        <View style={styles.datePickerWrapper}>
          <Text style={styles.label}>Start Date:</Text>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>

        <View style={styles.datePickerWrapper}>
          <Text style={styles.label}>End Date:</Text>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>{endDate.toDateString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Generate Report</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Error fetching report: {error.message}</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.reportTitle}>Custom Report</Text>

            <View style={styles.filterContainer}>
              <TouchableOpacity style={[styles.filterButton, selectedType === 'all' && styles.selectedFilter]} onPress={() => setSelectedType('all')}>
                <Text style={styles.filterText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedType === 'income' && styles.selectedFilter]} onPress={() => setSelectedType('income')}>
                <Text style={styles.filterText}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedType === 'expense' && styles.selectedFilter]} onPress={() => setSelectedType('expense')}>
                <Text style={styles.filterText}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedType === 'saving' && styles.selectedFilter]} onPress={() => setSelectedType('saving')}>
                <Text style={styles.filterText}>Saving</Text>
              </TouchableOpacity>
            </View>

            {data && data.transactions ? (
              <FlatList
                data={filterTransactions(data.transactions)}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.transactionItem}>
                    <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(item.type) }]}>
                      <FontAwesome name={getTransactionIcon(item.type)} size={24} color="white" />
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionDescription}>{item.description}</Text>
                      <Text style={styles.transactionType}>{item.type}</Text>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text style={styles.transactionAmount}>{item.amount} RWF</Text>
                      <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noDataText}>No transactions available</Text>
            )}

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Total Income: {data?.totalIncome || '0.00'} RWF</Text>
              <Text style={styles.summaryText}>Total Savings: {data?.totalSavings || '0.00'} RWF</Text>
              <Text style={styles.summaryText}>Total Expenses: {data?.totalExpenses || '0.00'} RWF</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const getTransactionIcon = (type) => {
  switch (type) {
    case 'income':
      return 'arrow-up';
    case 'expense':
      return 'arrow-down';
    case 'saving':
      return 'dollar';
    default:
      return 'circle';
  }
};

const getTransactionColor = (type) => {
  switch (type) {
    case 'income':
      return '#4CAF50'; // Green
    case 'expense':
      return '#FF4D4D'; // Red
    case 'saving':
      return '#2196F3'; // Blue
    default:
      return '#9E9E9E'; // Grey
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datePickerWrapper: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  dateButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loading: {
    fontSize: 18,
    color: '#555',
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  error: {
    fontSize: 18,
    color: '#d9534f',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height:  '90%'
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  selectedFilter: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    fontSize: 16,
    color: '#fff',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  transactionIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
  },
  transactionType: {
    fontSize: 14,
    color: '#666',
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
    fontSize: 14,
    color: '#999',
  },
  summaryContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});

export default Custom;

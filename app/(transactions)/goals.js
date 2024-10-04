import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Modal, TouchableOpacity, RefreshControl, Platform, TextInput, Button, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { addGoal, getGoals } from '../(services)/api/transactionsApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker} from '@react-native-picker/picker';


const validationSchema = Yup.object({
  categoryName: Yup.string().required('Category name is required'),
  limitAmount: Yup.number().required('Limit amount is required').positive('Limit amount must be positive'),
  startingDate: Yup.date().required('Starting date is required').typeError('Invalid date format'),
  endingDate: Yup.date().required('Ending date is required').typeError('Invalid date format'),
});

const motivationalQuotes = [
  "Setting goals is the first step in turning the invisible into the visible.",
  "A goal without a plan is just a wish.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Your limitation—it's only your imagination.",
];

const Goals = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user?.userId);
  const queryClient = useQueryClient();

  // Fetch goals
  const { data: goals, error, isLoading, refetch } = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => getGoals(userId, token),
    enabled: !!userId && !!token,
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      categoryName: '',
      limitAmount: '',
      startingDate: new Date(),
      endingDate: new Date(),
    },
    validationSchema,
    onSubmit: (values) => {
      addGoalMutation.mutate(values);
    },
  });

  // Add new goal mutation
  const addGoalMutation = useMutation({
    mutationFn: (newGoal) => addGoal(userId, token, newGoal),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals', userId]);
      formik.resetForm();
      setModalVisible(false);
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formik.values.startingDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    formik.setFieldValue('startingDate', currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formik.values.endingDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    formik.setFieldValue('endingDate', currentDate);
  };

  if (isLoading)     
  return(<View style={styles.isLoading}>
    <ActivityIndicator size="large" color="#0066cc" />
  </View>);

  const renderGoalItem = ({ item, index }) => (
    <View style={styles.goalCard}>
      <View style={styles.numberingContainer}>
        <Text style={styles.numbering}>{index + 1}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.leftSide}>
          <Text style={styles.label}>Category Name:</Text>
          <Text style={styles.value}>{item.categoryName}</Text>
          <Text style={styles.label}>Usage Amount:</Text>
          <Text style={styles.value}>{item.usageAmount} Rwf</Text>
          <Text style={styles.label}>Starting Date:</Text>
          <Text style={styles.value}>{new Date(item.startingDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.rightSide}>
          <Text style={styles.label}>Category Limit:</Text>
          <Text style={styles.value}>{item.limitAmount}</Text>
          <Text style={styles.label}>Remaining Amount:</Text>
          <Text style={styles.value}>{item.remainedAmount} Rwf</Text>
          <Text style={styles.label}>Ending Date:</Text>
          <Text style={styles.value}>{new Date(item.endingDate).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Usage: {item.usagePercentage}%</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${item.usagePercentage}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGoalItem}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Setting your Budget!</Text>
            <Text style={styles.motivationalQuote}>
              {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add New Goal"
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for Adding New Goal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <FontAwesome name="close" size={24} color="red" />
            </TouchableOpacity>
            <Text style={styles.header}>Add New Goal</Text>
            <Text style={styles.inputLabel}>Category</Text>
            <Picker
              selectedValue={formik.values.categoryName}
              onValueChange={(itemValue) => formik.setFieldValue('categoryName', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Transport" value="Transport" />
              <Picker.Item label="Shopping" value="Shopping" />
              <Picker.Item label="Utilities" value="Utilities" />
              <Picker.Item label="Healthcare" value="Healthcare" />
              <Picker.Item label="Entertainment" value="Entertainment" />
            </Picker>
            {formik.touched.categoryName && formik.errors.categoryName ? (
              <Text style={styles.errorText}>{formik.errors.categoryName}</Text>
            ) : null}

            <Text style={styles.inputLabel}>Limit Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Limit Amount"
              keyboardType="numeric"
              value={formik.values.limitAmount}
              onChangeText={formik.handleChange('limitAmount')}
              onBlur={formik.handleBlur('limitAmount')}
              accessibilityLabel="Limit Amount"
            />
            {formik.touched.limitAmount && formik.errors.limitAmount ? (
              <Text style={styles.errorText}>{formik.errors.limitAmount}</Text>
            ) : null}

            <Text style={styles.inputLabel}>Starting Date</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}>
                {formik.values.startingDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={formik.values.startingDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
                minimumDate={new Date()}
              />
            )}

            <Text style={styles.inputLabel}>Ending Date</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>
                {formik.values.endingDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={formik.values.endingDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={new Date()}
              />
            )}

            <Button
              title="Add Goal"
              onPress={formik.handleSubmit}
              disabled={addGoalMutation.isLoading}
            />
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
    top:35
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  numberingContainer: {
    backgroundColor: '#2196F3',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  numbering: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    top:10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'green',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'red',
  },
  noDataContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    marginBottom: 8,
  },
  motivationalQuote: {
    fontStyle: 'italic',
    color: '#888',
  },
  fab: {
    position: 'absolute',
    bottom: 60,
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: '#2196F3',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    elevation: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'red',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    marginBottom: 10,
  },
  dateText: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  errorText: {
    color: 'red',
  },
  isLoading: {
    top:'50%',
  }
});
export default Goals;
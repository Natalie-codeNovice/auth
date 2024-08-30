import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Alert, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { addGoal, getGoals } from '../(services)/api/transactionsApi';

const Goals = () => {
  const [newGoal, setNewGoal] = useState({
    categoryName: '',
    limitAmount: '',
    startingDate: '',
    endingDate: '',
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user?.userId);
  const queryClient = useQueryClient();

  // Fetch goals
  const { data: goals, error, isLoading } = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => getGoals(userId, token),
    enabled: !!userId && !!token, // Ensure queries run only when userId and token are available
  });

  // Add new goal mutation
  const addGoalMutation = useMutation({
    mutationFn: (newGoal) => addGoal(userId, token, newGoal),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals', userId]); // Refresh goals after adding a new one
      setNewGoal({
        categoryName: '',
        limitAmount: '',
        startingDate: '',
        endingDate: '',
      });
      setModalVisible(false); // Close the modal after adding the goal
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleAddGoal = () => {
    const { categoryName, limitAmount, startingDate, endingDate } = newGoal;
    if (!categoryName || !limitAmount || !startingDate || !endingDate) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    addGoalMutation.mutate(newGoal);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error fetching goals: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Category Limits</Text>

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.goalCard}>
              <Text style={styles.title}>{item.categoryName}</Text>
              <Text>Limit Amount: {item.limitAmount}</Text>
              <Text>Starting Date: {new Date(item.startingDate).toLocaleDateString()}</Text>
              <Text>Ending Date: {new Date(item.endingDate).toLocaleDateString()}</Text>
              <Text>Usage Amount: {item.usageAmount}</Text>
              <Text>Remaining Amount: {item.remainedAmount}</Text>
              <Text>Usage Percentage: {item.usagePercentage}%</Text>
              <Text>Status: {item.isValid ? 'Valid' : 'Invalid'}</Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
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
            <Text style={styles.header}>Add New Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={newGoal.categoryName}
              onChangeText={(text) => setNewGoal({ ...newGoal, categoryName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Limit Amount"
              keyboardType="numeric"
              value={newGoal.limitAmount}
              onChangeText={(text) => setNewGoal({ ...newGoal, limitAmount: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Starting Date (YYYY-MM-DD)"
              value={newGoal.startingDate}
              onChangeText={(text) => setNewGoal({ ...newGoal, startingDate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Ending Date (YYYY-MM-DD)"
              value={newGoal.endingDate}
              onChangeText={(text) => setNewGoal({ ...newGoal, endingDate: text })}
            />
            <Button title="Add Goal" onPress={handleAddGoal} />
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
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default Goals;

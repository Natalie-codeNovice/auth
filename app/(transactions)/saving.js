import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getSavings } from '../(services)/api/transactionsApi';
import { FontAwesome } from '@expo/vector-icons';

const Saving = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newSaving, setNewSaving] = useState({ description: '', amount: '' });

  const cUser = useSelector((state) => state.auth.user) || {};
  const token = useSelector((state) => state.auth.token);
  const userId = cUser.userId;

  const { data, isLoading, error } = useQuery({
    queryKey: ['savings', userId, token],
    queryFn: () => getSavings(userId, token),
  });

  if (isLoading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading transactions.</Text>;
  }

  const { savings, totalSavings } = data;

  const handleSave = () => {
    // Logic to save new savings
    setModalVisible(false);
    setNewSaving({ description: '', amount: '' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings Overview</Text>
      <View style={styles.totalContainer}>
        <Text style={styles.totalTitle}>Total Savings:</Text>
        <Text style={styles.totalAmount}>{totalSavings}</Text>
      </View>
      <FlatList
        data={savings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text style={styles.transactionText}>{item.description}</Text>
            <Text style={styles.transactionAmount}>${item.amount}</Text>
          </View>
        )}
      />
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)} // Open the modal when the button is pressed
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for adding new savings */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Saving</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newSaving.description}
              onChangeText={(text) => setNewSaving({ ...newSaving, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newSaving.amount}
              onChangeText={(text) => setNewSaving({ ...newSaving, amount: text })}
              keyboardType="numeric"
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#f44336" />
              <Button title="Save" onPress={handleSave} color="#2a9d8f" />
            </View>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  totalContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a9d8f',
    marginTop: 8,
  },
  transaction: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#2a9d8f',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2a9d8f',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Saving;

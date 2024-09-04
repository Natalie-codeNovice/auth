import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { getDaylyReport } from '../(services)/api/transactionsApi';
const Day = () => {
  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user?.userId);
  useEffect(() => {
  }, [userId, token]);

  const { data, error, isLoading } = useQuery({
    queryKey: ['dailyReport', userId],
    queryFn: () => getDaylyReport(userId, token),
    enabled: !!userId && !!token,
    onError: (err) => {
      console.error('Error fetching daily report:', err);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load daily report: {error.message}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No report data available</Text>
      </View>
    );
  }

  const { totalIncome, totalSavings, totalExpenses, categoryBreakdown } = data;

  return (
    <LinearGradient colors={['#e0eafc', '#cfdef3']} style={styles.gradientContainer}>
      <View style={styles.header}>
        <MaterialIcons name="today" size={28} color="#333" />
        <Text style={styles.title}>Daily Report</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.reportItem}>
          <Text style={styles.reportLabel}>Total Income:</Text>
          <Text style={styles.reportValue}>{totalIncome.toFixed(2)} RWF</Text>
        </View>

        <View style={styles.reportItem}>
          <Text style={styles.reportLabel}>Total Savings:</Text>
          <Text style={styles.reportValue}>{totalSavings.toFixed(2)} RWF</Text>
        </View>

        <View style={styles.reportItem}>
          <Text style={styles.reportLabel}>Total Expenses:</Text>
          <Text style={styles.reportValue}>{totalExpenses.toFixed(2)} RWF</Text>
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Income by Category</Text>
          {Object.entries(categoryBreakdown.income).map(([category, amount]) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>{category}:</Text>
              <Text style={styles.categoryValue}>{amount.toFixed(2)} RWF</Text>
            </View>
          ))}

          <Text style={styles.categoryTitle}>Savings by Category</Text>
          {Object.entries(categoryBreakdown.savings).map(([category, amount]) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>{category}:</Text>
              <Text style={styles.categoryValue}>{amount.toFixed(2)} RWF</Text>
            </View>
          ))}

          <Text style={styles.categoryTitle}>Expenses by Category</Text>
          {Object.entries(categoryBreakdown.expenses).map(([category, amount]) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>{category}:</Text>
              <Text style={styles.categoryValue}>{amount.toFixed(2)} RWF</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0eafc',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  reportItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  reportLabel: {
    fontSize: 18,
    color: '#333',
  },
  reportValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: '#f1f3f5',
    padding: 10,
    borderRadius: 8,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#555',
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Day;

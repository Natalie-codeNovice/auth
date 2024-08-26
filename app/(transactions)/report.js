import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { getMonthReport, getWeekReport } from '../(services)/api/transactionsApi';
import { useQuery } from '@tanstack/react-query';

const Report = () => {
  const [isWeek, setIsWeek] = useState(true);

  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user?.userId);

  // Use React Query to fetch Week or Month reports
  const reportQuery = useQuery({
    queryKey: ['report', isWeek, userId], // Query key
    queryFn: () => (isWeek ? getWeekReport(userId, token) : getMonthReport(userId, token)), // Query function
    enabled: !!userId, // Enable the query only if userId is available
    refetchOnWindowFocus: false, // Avoid refetching on window focus
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  const toggleReportType = () => {
    setIsWeek(prev => !prev);
    reportQuery.refetch(); // Manually refetch the data when switching the report type
  };

  const renderTransactionItem = ({ item, index }) => {
    if (!item) return null; // Ensure item is not undefined

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View style={styles.numberCircle}>
            <Text style={styles.transactionNumber}>{index + 1}</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionText}>{item.description || 'N/A'}</Text>
            <Text style={styles.transactionText}>{item.type || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>{item.amount || '0.00'} RWF</Text>
          <Text style={styles.transactionDate}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</Text>
        </View>
      </View>
    );
  };

  if (reportQuery.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (reportQuery.isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{reportQuery.error.message}</Text>
      </View>
    );
  }

  const reportData = reportQuery.data || {}; // Fallback to empty object if data is undefined
  const transactions = reportData.transactions || []; // Ensure transactions is defined

  return (
    <View style={styles.container}>
      <Button title={`Switch to ${isWeek ? 'Month' : 'Week'} Report`} onPress={toggleReportType} />
      <View style={styles.reportContainer}>
        <Text style={styles.title}>{isWeek ? 'Week Report' : 'Month Report'}</Text>
        <Text style={styles.summary}>Total Income: {reportData.totalIncome || '0.00'}RWF</Text>
        <Text style={styles.summary}>Total Savings: {reportData.totalSavings || '0.00'}RWF</Text>
        <Text style={styles.summary}>Total Expenses: {reportData.totalExpenses || '0.00'}RWF</Text>
        <Text style={styles.summary}>Net Balance: {reportData.netBalance || '0.00'}RWF</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.transactionList}
          refreshControl={
            <RefreshControl
              refreshing={reportQuery.isRefetching}
              onRefresh={() => reportQuery.refetch()}
            />
          }
          ListFooterComponent={
            reportQuery.hasNextPage ? (
              <Button
                title="Load More"
                onPress={() => reportQuery.fetchNextPage()}
                disabled={reportQuery.isFetchingNextPage}
              />
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  reportContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summary: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  transactionList: {
    marginTop: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  numberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionText: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
  },
});

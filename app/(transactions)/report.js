import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, RefreshControl, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { getMonthReport, getWeekReport } from '../(services)/api/transactionsApi';
import { useQuery } from '@tanstack/react-query';
import { Appbar } from 'react-native-paper';
import { Menu, MenuTrigger, MenuOptions, MenuOption, MenuProvider } from 'react-native-popup-menu';
import { LinearGradient } from 'expo-linear-gradient';

const Report = () => {
  const [isWeek, setIsWeek] = useState(true);

  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user?.userId);

  const reportQuery = useQuery({
    queryKey: ['report', isWeek, userId],
    queryFn: () => (isWeek ? getWeekReport(userId, token) : getMonthReport(userId, token)),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const handleMenuSelect = (value) => {
    setIsWeek(value === 'week');
    reportQuery.refetch();
  };

  const renderTransactionItem = ({ item, index }) => {
    if (!item) return null;

    // Define gradients based on transaction type
    const typeGradients = {
      expense: ['#FF4D4D', '#FF1A1A'], // Red gradient
      income: ['#4CAF50', '#388E3C'], // Green gradient
      saving: ['#2196F3', '#0D47A1'], // Blue gradient
    };

    // Determine the gradient based on the transaction type
    const gradientColors = typeGradients[item.type] || ['#0066cc', '#0033cc']; // Default gradient if type is unknown

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <LinearGradient
            colors={gradientColors}
            style={styles.numberCircle}
          >
            <Text style={styles.transactionNumber}>{index + 1}</Text>
          </LinearGradient>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionText}>{item.description || 'N/A'}</Text>
            <Text style={styles.transactionType}>{item.type || 'N/A'}</Text>
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
        <ActivityIndicator size="large" color="#0066cc" />
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

  const reportData = reportQuery.data || {};
  const transactions = reportData.transactions || [];

  return (
    <MenuProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Report" />
          <Menu>
            <MenuTrigger>
              <Appbar.Action icon="dots-vertical" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => handleMenuSelect('week')}>
                <Text>Week Report</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleMenuSelect('month')}>
                <Text>Month Report</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </Appbar.Header>
        <View style={styles.reportContainer}>
          <View style={styles.netBalanceContainer}>
            <LinearGradient
              colors={['#990f87', '#0072ff']} // gradient colors
              style={styles.netBalanceCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.netBalanceText}>{reportData.netBalance || '0.00'} RWF</Text>
            </LinearGradient>
            <Text style={styles.reportTitle}>{isWeek ? 'Week Report' : 'Month Report'}</Text>
          </View>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Income</Text>
              <Text style={styles.summaryValue}>{reportData.totalIncome || '0.00'} RWF</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Savings</Text>
              <Text style={styles.summaryValue}>{reportData.totalSavings || '0.00'} RWF</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Expenses</Text>
              <Text style={styles.summaryValue}>{reportData.totalExpenses || '0.00'} RWF</Text>
            </View>
          </View>
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
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </MenuProvider>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  reportContainer: {
    flex: 1,
    padding: 20,
  },
  netBalanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  netBalanceCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  netBalanceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
    marginTop: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    marginTop: 5,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  transactionList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    marginBottom:3
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionText: {
    fontSize: 14,
    color: '#333',
  },
  transactionType: {
    fontSize: 12,
    color: '#999',
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
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
});

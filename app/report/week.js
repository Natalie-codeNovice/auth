import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, ScrollView } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const Week = () => {
  // Sample data for the week
  const incomeData = [150, 200, 250, 180, 300, 400, 320];
  const expenseData = [100, 150, 200, 170, 250, 350, 300];
  const savingData = [50, 50, 50, 10, 50, 50, 20];

  const incomeCategories = [
    { name: 'Salary', amount: 600, color: '#4CAF50' },
    { name: 'Freelancing', amount: 400, color: '#8BC34A' },
    { name: 'Investments', amount: 300, color: '#CDDC39' },
  ];

  const expenseCategories = [
    { name: 'Rent', amount: 500, color: '#FF5252' },
    { name: 'Groceries', amount: 300, color: '#FF7043' },
    { name: 'Entertainment', amount: 150, color: '#FF9800' },
  ];

  const savingCategories = [
    { name: 'Emergency Fund', amount: 300, color: '#2196F3' },
    { name: 'Retirement', amount: 200, color: '#03A9F4' },
    { name: 'Vacation', amount: 100, color: '#00BCD4' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('income');

  const getCategoryData = () => {
    switch (selectedCategory) {
      case 'income':
        return incomeCategories;
      case 'expenses':
        return expenseCategories;
      case 'savings':
        return savingCategories;
      default:
        return [];
    }
  };

  // Calculate totals
  const totalIncome = incomeData.reduce((a, b) => a + b, 0);
  const totalExpenses = expenseData.reduce((a, b) => a + b, 0);
  const totalSavings = savingData.reduce((a, b) => a + b, 0);

  // Decision summary
  let decisionSummary;
  if (totalExpenses > totalIncome) {
    decisionSummary = 'You have spent more than you earned. Consider cutting down your expenses.';
  } else if (totalSavings < (totalIncome * 0.1)) {
    decisionSummary = 'Your savings are low. Try to save at least 10% of your income.';
  } else {
    decisionSummary = 'You are managing your finances well. Keep it up!';
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Weekly Financial Report</Text>

      {/* Buttons to switch between charts */}
      <View style={styles.switchContainer}>
        <Button title="Income" onPress={() => setSelectedCategory('income')} />
        <Button title="Expenses" onPress={() => setSelectedCategory('expenses')} />
        <Button title="Savings" onPress={() => setSelectedCategory('savings')} />
      </View>

      {/* Pie Chart Section */}
      <PieChart
        data={getCategoryData().map((item) => ({
          name: item.name,
          population: item.amount,
          color: item.color,
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
        }))}
        width={Dimensions.get('window').width - 30}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />

      <LineChart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              data: incomeData, // Income data
              color: () => '#4CAF50', // Green color for income
              strokeWidth: 2,
            },
            {
              data: expenseData, // Expenses data
              color: () => '#FF5252', // Red color for expenses
              strokeWidth: 2,
            },
            {
              data: savingData, // Savings data
              color: () => '#2196F3', // Blue color for savings
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 30} // Width of the chart
        height={220} // Height of the chart
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // Optional, can set to 1 for easier steps
        chartConfig={{
          backgroundColor: '#f5f5f5',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // Number of decimal places to display
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* Legend Section */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: '#FF5252' }]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Savings</Text>
        </View>
      </View>

      <View style={styles.overviewContainer}>
        <Text style={styles.overviewHeader}>Week Overview</Text>
        <Text style={styles.overviewText}>Total Income: ${totalIncome.toFixed(2)}k</Text>
        <Text style={styles.overviewText}>Total Expenses: ${totalExpenses.toFixed(2)}k</Text>
        <Text style={styles.overviewText}>Total Savings: ${totalSavings.toFixed(2)}k</Text>
        <Text style={styles.summary}>{decisionSummary}</Text>
      </View>
    </ScrollView>
  );
};

export default Week;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '90%',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '90%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  overviewContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '90%',
  },
  overviewHeader: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  overviewText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  summary: {
    marginTop: 10,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#00796B',
  },
});

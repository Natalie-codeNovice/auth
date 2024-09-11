import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux'; 
import { getWeekReportChart } from '../(services)/api/transactionsApi';
import { Card, Button, ActivityIndicator } from 'react-native-paper';

const generateColorPalette = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = i * (360 / numColors);
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

const Week = () => {
  const token = useSelector(state => state.auth.token); 
  const userId = useSelector(state => state.auth.user?.userId);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['weekReport', userId],
    queryFn: () => getWeekReportChart(userId, token),
  });

  if (isLoading) {
    return(<View style={styles.isLoading}>
      <ActivityIndicator size="large" color="#0066cc" />
    </View>);
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading data</Text>;
  }

  const labels = data.dailyBreakdown.map(day => new Date(day.day).toLocaleDateString('en-US', { weekday: 'short' }));
  const incomeData = data.dailyBreakdown.map(day => day.totalIncome);
  const savingsData = data.dailyBreakdown.map(day => day.totalSavings);
  const expensesData = data.dailyBreakdown.map(day => day.totalExpenses);

  const totalIncome = incomeData.reduce((acc, cur) => acc + cur, 0);
  const totalSavings = savingsData.reduce((acc, cur) => acc + cur, 0);
  const totalExpenses = expensesData.reduce((acc, cur) => acc + cur, 0);

  const handleDataPointClick = (dataPoint) => {
    const selectedDayData = {
      day: labels[dataPoint.index],
      totalIncome: incomeData[dataPoint.index],
      totalSavings: savingsData[dataPoint.index],
      totalExpenses: expensesData[dataPoint.index],
    };

    const advice = generateAdvice(selectedDayData);
    setSelectedPoint({ ...selectedDayData, advice });
  };

  const generateAdvice = ({ totalIncome, totalSavings, totalExpenses }) => {
    let advice = "Good job! Keep monitoring your finances.";
    
    if (totalExpenses > totalIncome) {
      advice = "Your expenses exceeded your income. Consider reducing unnecessary spending.";
    } else if (totalSavings === 0) {
      advice = "No savings were recorded. Try to save a portion of your income.";
    } else if (totalIncome > totalExpenses && totalSavings > 0) {
      advice = "Great work! You've saved some money. Consider investing it.";
    } else if (totalIncome > 0 && totalExpenses === 0) {
      advice = "You had a surplus of income today. This could be a good opportunity to save or invest.";
    }

    return advice;
  };

  const incomeCategories = Object.entries(data.categoryBreakdown.income || {}).map(([category, amount]) => ({
    name: category,
    amount,
    color: generateColorPalette(Object.keys(data.categoryBreakdown.income || {}).length)[Object.keys(data.categoryBreakdown.income || {}).indexOf(category)],
    legendFontColor: '#000000',
    legendFontSize: 14
  }));

  const expenseCategories = Object.entries(data.categoryBreakdown.expenses || {}).map(([category, amount]) => ({
    name: category,
    amount,
    color: generateColorPalette(Object.keys(data.categoryBreakdown.expenses || {}).length)[Object.keys(data.categoryBreakdown.expenses || {}).indexOf(category)],
    legendFontColor: '#000000',
    legendFontSize: 14
  }));

  const savingsCategories = Object.entries(data.categoryBreakdown.savings || {}).map(([category, amount]) => ({
    name: category,
    amount,
    color: generateColorPalette(Object.keys(data.categoryBreakdown.savings || {}).length)[Object.keys(data.categoryBreakdown.savings || {}).indexOf(category)],
    legendFontColor: '#000000',
    legendFontSize: 14
  }));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Report</Text>

        {/* Overview Section */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text style={styles.overviewTitle}>Overview</Text>
            <Text style={styles.overviewText}>Total Income: {totalIncome.toFixed(2)} RWF</Text>
            <Text style={styles.overviewText}>Total Savings: {totalSavings.toFixed(2)} RWF</Text>
            <Text style={styles.overviewText}>Total Expenses: {totalExpenses.toFixed(2)} RWF</Text>
          </Card.Content>
        </Card>

        {/* Line Chart */}
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: incomeData,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: savingsData,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: expensesData,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: ['Income', 'Savings', 'Expenses'],
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
          onDataPointClick={handleDataPointClick}
        />

        {/* Pie Charts */}
        <View style={styles.pieChartContainer}>
          <Text style={styles.subtitle}>Income Breakdown</Text>
          <PieChart
            data={incomeCategories}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />

          <Text style={styles.subtitle}>Expense Breakdown</Text>
          <PieChart
            data={expenseCategories}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />

          <Text style={styles.subtitle}>Savings Breakdown</Text>
          <PieChart
            data={savingsCategories}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Modal for Data Point Details */}
        <Modal
          transparent={true}
          visible={!!selectedPoint}
          onRequestClose={() => setSelectedPoint(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedPoint && (
                <>
                  <Text style={styles.modalTitle}>Details for {selectedPoint.day}</Text>
                  <Text style={styles.modalText}>Total Income: {selectedPoint.totalIncome.toFixed(2)} RWF</Text>
                  <Text style={styles.modalText}>Total Savings: {selectedPoint.totalSavings.toFixed(2)} RWF</Text>
                  <Text style={styles.modalText}>Total Expenses: {selectedPoint.totalExpenses.toFixed(2)} RWF</Text>
                  <Text style={styles.modalAdvice}>{selectedPoint.advice}</Text>
                  <Button mode="contained" onPress={() => setSelectedPoint(null)}>Close</Button>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overviewCard: {
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  overviewText: {
    fontSize: 16,
    marginVertical: 4,
  },
  chart: {
    marginVertical: 8,
  },
  pieChartContainer: {
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 4,
  },
  modalAdvice: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#ff6347',
    marginVertical: 8,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  isLoading: {
    top:'50%',
  }
});

export default Week;

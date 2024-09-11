import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Modal } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getMonthReportChart } from '../(services)/api/transactionsApi';
import { Card, Button, ActivityIndicator } from 'react-native-paper';

// Function to generate distinct colors for categories
const generateColorPalette = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = i * (360 / numColors);
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

const Month = () => {
  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user?.userId);
  const { data, error, isLoading } = useQuery({
    queryKey: ['monthlyReport', userId],
    queryFn: () => getMonthReportChart(userId, token),
  });

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (isLoading) {
    return(<View style={styles.isLoading}>
      <ActivityIndicator size="large" color="#0066cc" />
    </View>);
  }

  if (error) {
    return <Text style={styles.errorText}>Error fetching data</Text>;
  }

  // Convert category breakdown object to array
  const convertToArray = (obj) => Object.entries(obj).map(([name, amount]) => ({ name, amount }));

  // Handle empty data
  const handleEmptyCategories = (categories = []) => {
    if (categories.length === 0) {
      return [{ name: 'No Data', amount: 0, color: '#d3d3d3' }];
    }
    return categories;
  };

  // Generate colors dynamically
  const generateChartData = (categories) => {
    const categoryEntries = handleEmptyCategories(convertToArray(categories));
    const colors = generateColorPalette(categoryEntries.length);

    return categoryEntries.map((category, index) => ({
      ...category,
      color: colors[index],
      legendFontColor: '#000000',
      legendFontSize: 14
    }));
  };

  // Handle data point click
  const handleDataPointClick = (data) => {
    setSelectedPoint(data);
    // Set category details based on the clicked point
    const categoryData = convertToArray(data.categories || {});
    setSelectedCategory(categoryData.find(cat => cat.name === data.label));
  };

  // Prepare data for PieCharts
  const incomeCategories = generateChartData(data?.categoryBreakdown?.income || {});
  const expenseCategories = generateChartData(data?.categoryBreakdown?.expenses || {});
  const savingsCategories = generateChartData(data?.categoryBreakdown?.savings || {});

  // Prepare data for LineChart
  const labels = data?.weeklyBreakdown?.map((_, index) => `Week ${index + 1}`) || [];
  const incomeData = data?.weeklyBreakdown?.map(week => week.totalIncome) || [];
  const expensesData = data?.weeklyBreakdown?.map(week => week.totalExpenses) || [];
  const savingsData = data?.weeklyBreakdown?.map(week => week.totalSavings) || [];

  // Calculate total values
  const totalIncome = convertToArray(data?.categoryBreakdown?.income || {}).reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = convertToArray(data?.categoryBreakdown?.expenses || {}).reduce((acc, curr) => acc + curr.amount, 0);
  const totalSavings = convertToArray(data?.categoryBreakdown?.savings || {}).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text style={styles.overviewTitle}>Overview</Text>
            <Text style={styles.overviewText}>Total Income: {totalIncome.toFixed(2)} RWF</Text>
            <Text style={styles.overviewText}>Total Savings: {totalSavings.toFixed(2)} RWF</Text>
            <Text style={styles.overviewText}>Total Expenses: {totalExpenses.toFixed(2)} RWF</Text>
          </Card.Content>
        </Card>

        <Text style={styles.title}>Monthly Report</Text>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: incomeData,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // green for income
                strokeWidth: 3
              },
              {
                data: expensesData,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // red for expenses
                strokeWidth: 3
              },
              {
                data: savingsData,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // blue for savings
                strokeWidth: 3
              }
            ]
          }}
          width={Dimensions.get('window').width - 30}
          height={220}
          yAxisLabel="RWF"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#000000'
            }
          }}
          bezier
          style={styles.chart}
          onDataPointClick={({ value, index, label }) => handleDataPointClick({ value, index, label, categories: data?.categoryBreakdown })}
        />
        <Text style={styles.subtitle}>Income Categories</Text>
        <PieChart
          data={incomeCategories}
          width={Dimensions.get('window').width - 30}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          onDataPointClick={({ value, index }) => handleDataPointClick({ value, index, label: incomeCategories[index].name, categories: data?.categoryBreakdown?.income })}
        />
        <Text style={styles.subtitle}>Expense Categories</Text>
        <PieChart
          data={expenseCategories}
          width={Dimensions.get('window').width - 30}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          onDataPointClick={({ value, index }) => handleDataPointClick({ value, index, label: expenseCategories[index].name, categories: data?.categoryBreakdown?.expenses })}
        />
        <Text style={styles.subtitle}>Savings Categories</Text>
        <PieChart
          data={savingsCategories}
          width={Dimensions.get('window').width - 30}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          onDataPointClick={({ value, index }) => handleDataPointClick({ value, index, label: savingsCategories[index].name, categories: data?.categoryBreakdown?.savings })}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedPoint}
          onRequestClose={() => {
            setSelectedPoint(null);
            setSelectedCategory(null);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedPoint?.label || 'Details'}</Text>
              <Text style={styles.modalText}>Total Amount: {selectedPoint?.value?.toFixed(2)} RWF</Text>
              {selectedCategory && (
                <View>
                  <Text style={styles.modalSubtitle}>Category Details:</Text>
                  <Text style={styles.modalText}>Name: {selectedCategory.name}</Text>
                  <Text style={styles.modalText}>Amount: ${selectedCategory.amount.toFixed(2)}</Text>
                </View>
              )}
              <Button style={styles.closeButton} mode="contained" onPress={() => setSelectedPoint(null)}>
                Close
              </Button>
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
    padding: 15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  overviewCard: {
    width: '100%',
    marginVertical: 10,
    elevation: 3,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  overviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    right:100,
    color: '#333',
  },
  chart: {
    marginVertical: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#f00',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
  },
  isLoading: {
    top: '50%',
  },
});

export default Month;

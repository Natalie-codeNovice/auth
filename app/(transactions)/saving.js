import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getMonthReport, getWeekReport } from '../(services)/api/transactionsApi';
 // Adjust the path as needed

const Report = () => {
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);

  // Access userId and token from Redux store
  const { userId, token } = useSelector(state => ({
    userId: state.auth.userId,  // Adjust according to your Redux state structure
    token: state.auth.token     // Adjust according to your Redux state structure
  }));

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch weekly report data
        const weekResponse = await getWeekReport(userId, token);
        const monthResponse = await getMonthReport(userId, token);

        const weekTransactions = weekResponse.transactions;
        const monthTransactions = monthResponse.transactions;

        // Prepare data for charts
        const weekChartData = weekTransactions.map(transaction => parseFloat(transaction.amount));
        const monthChartData = monthTransactions.map(transaction => parseFloat(transaction.amount));

        setWeekData(weekChartData);
        setMonthData(monthChartData);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [userId, token]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Weekly Report</Text>
      {weekData.length > 0 ? (
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],  // Adjust labels as needed
            datasets: [
              {
                data: weekData,
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
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
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No data available for this week.</Text>
      )}

      <Text style={styles.header}>Monthly Report</Text>
      {monthData.length > 0 ? (
        <LineChart
          data={{
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],  // Adjust labels as needed
            datasets: [
              {
                data: monthData,
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
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
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No data available for this month.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default Report;

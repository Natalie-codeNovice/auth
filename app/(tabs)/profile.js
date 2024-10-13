import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { getUser } from "../(services)/api/api";
import { getExpense, getIncome, getNetBalance } from "../(services)/api/transactionsApi";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Profile() {
  const userId = useSelector((state) => state.auth.user.userId);
  const token = useSelector((state) => state.auth.token);

  const [user, setUser] = useState(null);
  const [netBalance, setNetBalance] = useState({});
  const [income, setIncome] = useState({});
  const [expense, setExpense] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const handleUsernameChange = () => {
    router.push("/user/changeUsername");
  };
  const handleTransHist = () => {
    router.push("/history/")
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userId && token) {
          const userData = await getUser(userId, token);
          setUser(userData);

          const netBalanceData = await getNetBalance(userId, token);
          setNetBalance(netBalanceData);

          const incomeData = await getIncome(userId, token);
          setIncome(incomeData);

          const expenseData = await getExpense(userId, token);
          setExpense(expenseData);
        }
      } catch (err) {
        setError("Failed to load data");
        Alert.alert("Error", "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderProfileHeader = () => (
    <LinearGradient colors={['#1f6bc4', '#33ccff']} style={styles.gradientBackground}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user?.profilePicture || 'https://via.placeholder.com/150' }} // Placeholder image
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.phoneNumber}>{user?.phoneNumber}</Text>

        <View style={styles.balanceCard}>
          <FontAwesome name="money" size={32} color="#fff" />
          <Text style={styles.balanceText}>{netBalance.balance || '0.00'} RWF</Text>
        </View>

        {/* Adding buttons for additional actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}
            onPress={handleUsernameChange}
          >
            <FontAwesome name="edit" size={24} color="#fff" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}
          onPress={handleTransHist}
          >
            <FontAwesome name="history" size={24} color="#fff" />
            <Text style={styles.buttonText}>View Transactions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Your Statistics</Text>
      <View style={styles.statsCards}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{income.totalIncome || '0.00'}RWF</Text>
          <Text style={styles.statLabel}>Total Income</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{expense.totalExpenses || '0.00'}RWF</Text>
          <Text style={styles.statLabel}>Total Expense</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            {renderProfileHeader()}
            {renderStats()}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  gradientBackground: {
    padding: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#fff',
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#f0f0f0",
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    color: "#f0f0f0",
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#009688',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '80%',
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fff",
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6bc4',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    margin: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  statsContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

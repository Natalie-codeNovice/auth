import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { getUser } from "../(services)/api/api";
import { getNetBalance, getRecentTransactions } from "../(services)/api/transactionsApi";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const userId = useSelector((state) => state.auth.user.userId);
  const token = useSelector((state) => state.auth.token);

  const [user, setUser] = useState(null);
  const [netBalance, setNetBalance] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userId && token) {
          const userData = await getUser(userId, token);
          setUser(userData);

          const netBalanceData = await getNetBalance(userId, token);
          setNetBalance(netBalanceData);

          const transactionsData = await getRecentTransactions(userId, token);
          setRecentTransactions(transactionsData);
        }
      } catch (err) {
        console.log(setError("Failed to load data"))
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  if (loading) {
    return (
        console.log(loading)
    );
  }

  if (error) {
    return (
        console.log(error)
    );
  }

  const renderProfileHeader = () => (
    <LinearGradient colors={['#347deb', '#c334eb']} style={styles.gradientBackground}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user?.profilePicture || 'https://via.placeholder.com/150' }} // Placeholder image
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.phoneNumber}>{user?.phoneNumber}</Text>
        <View style={styles.balanceContainer}>
          <FontAwesome name="money" size={24} color="#fff" />
          <Text style={styles.balance}>${netBalance.balance || '0.00'}</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderTransaction = ({ item }) => (
    <View style={styles.transaction}>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
    </View>
  );

  const renderTransactionTitle = () => (
    <View style={styles.transactionsTitleContainer}>
      <Text style={styles.transactionsTitle}>Recent Transactions</Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          {renderProfileHeader()}
          {renderTransactionTitle()}
        </>
      }
      data={recentTransactions}
      renderItem={renderTransaction}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text style={styles.emptyText}>No recent transactions</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  gradientBackground: {
    padding: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 16,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 18,
    color: "#fff",
  },
  phoneNumber: {
    fontSize: 18,
    color: "#fff",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  transactionsTitleContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  transactionsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  transactionDescription: {
    fontSize: 16,
    color: "#333",
  },
  transactionAmount: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  loading: {
    marginTop:351,
  },
});

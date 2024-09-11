import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator, Alert } from "react-native";
import { useSelector } from "react-redux";
import { getUser } from "../(services)/api/api";
import { getNetBalance } from "../(services)/api/transactionsApi";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const userId = useSelector((state) => state.auth.user.userId);
  const token = useSelector((state) => state.auth.token);

  const [user, setUser] = useState(null);
  const [netBalance, setNetBalance] = useState({});
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
    <LinearGradient colors={['#0062ff', '#33ccff']} style={styles.gradientBackground}>
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
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderProfileHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  gradientBackground: {
    padding: 20,
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
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fff",
    marginLeft: 10,
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
});

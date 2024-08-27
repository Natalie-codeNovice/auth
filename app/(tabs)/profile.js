import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator, Alert } from "react-native";
import { useSelector } from "react-redux";
import { getUser } from "../(services)/api/api";
import { getNetBalance} from "../(services)/api/transactionsApi";
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
          <Text style={styles.balance}>{netBalance.balance || '0.00'}Rwf</Text>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            {renderProfileHeader()}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    flexGrow: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from "react";
import { View, StyleSheet, Text,Image, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";


export default function Profile() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const netBalance = useSelector((state) => state.auth.netBalance); // Assuming netBalance is in the auth slice


  // Sample data for recent transactions and goals (Replace with actual data)
  const recentTransactions = [
    { id: '1', description: 'Salary', amount: '$1200' },
    { id: '2', description: 'Groceries', amount: '-$150' },
    { id: '3', description: 'Utilities', amount: '-$100' },
  ];

  const financialGoals = [
    { id: '1', goal: 'Vacation Fund', amount: '$5000', progress: '40%' },
    { id: '2', goal: 'Emergency Fund', amount: '$2000', progress: '70%' },
  ];

  const renderTransaction = ({ item }) => (
    <View style={styles.transaction}>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
    </View>
  );

  const renderGoal = ({ item }) => (
    <View style={styles.goal}>
      <Text style={styles.goalDescription}>{item.goal}</Text>
      <Text style={styles.goalAmount}>{item.amount}</Text>
      <Text style={styles.goalProgress}>Progress: {item.progress}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {user ? (
        <>
          <Image
            source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }} // Placeholder image
            style={styles.profileImage}
          />
          <Text style={styles.text}>Username: {user.username}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Phone: {user.phoneNumber}</Text>
          <Text style={styles.text}>Balance: ${netBalance ? netBalance.balance : '0.00'}</Text>

          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <FlatList
            data={recentTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
          />

          <Text style={styles.sectionTitle}>Financial Goals</Text>
          <FlatList
            data={financialGoals}
            renderItem={renderGoal}
            keyExtractor={(item) => item.id}
          />
        </>
      ) : (
        <Text style={styles.text}>No user logged in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
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
  goal: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  goalDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  goalAmount: {
    fontSize: 16,
    color: "#333",
  },
  goalProgress: {
    fontSize: 14,
    color: "#777",
  },
  button: {
    height: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

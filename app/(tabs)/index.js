import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const TabHome = () => {
  const router = useRouter();
  const handleIncome = () => {
    router.push("/(transactions)");
  };

  const handleReport = () => {
    router.push("/report/");
  };
  const handleTransHist = () => {
    router.push("/history/")
  };
  const handleDonate = () => {
    router.push("/user/donate")
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Finance Tracker</Text>
      <Text style={styles.subtitle}>Explore App Features:</Text>
      <View style={styles.featureList}>
        <TouchableOpacity style={styles.featureItem} onPress={handleIncome}>
          <LinearGradient colors={["#4CAF50", "#388E3C"]} style={styles.gradient}>
            <Icon name="exchange" size={30} color="#fff" />
            <Text style={styles.featureText}>Transactions</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureItem} onPress={handleReport}>
          <LinearGradient colors={["#FFC107", "#FF9800"]} style={styles.gradient}>
            <Icon name="calendar" size={30} color="#fff" />
            <Text style={styles.featureText}>Generate Reports</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureItem} onPress={handleTransHist}>
          <LinearGradient colors={["#9E9E9E", "#616161"]} style={styles.gradient}>
            <Icon name="user" size={30} color="#fff" />
            <Text style={styles.featureText}>Transaction History</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureItem} onPress={handleDonate}>
          <LinearGradient colors={["red", "red"]} style={styles.gradient}>
            <Icon name="heart" size={30} color="#fff" />
            <Text style={styles.featureText}>Donate</Text>
          </LinearGradient>
        </TouchableOpacity>        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  featureList: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  featureItem: {
    width: "90%",
    marginBottom: 15,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
  },
  featureText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default TabHome;

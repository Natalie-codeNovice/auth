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
          <LinearGradient colors={["#FF5733", "#C70039"]} style={styles.gradient}>
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
    backgroundColor: "#E8F0F2", // Light background color for a soft look
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  featureList: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  featureItem: {
    width: "90%",
    marginBottom: 20,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 6, // Enhanced elevation for a more pronounced shadow effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  featureText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default TabHome;

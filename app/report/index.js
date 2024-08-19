import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ReportHome = () => {
  const handleCustomReport = () => {
    console.log("Custom Report clicked!");
  };

  const handleDayReport = () => {
    console.log("Day Report clicked!");
  };

  const handleWeek = () => {
    console.log("Week Report clicked!");
  };

  const handleMonthReport = () => {
    console.log("Month Report clicked!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.option}
          onPress={handleCustomReport}
        >
          <Icon name="cogs" size={24} color="#4caf50" />
          <Text style={styles.optionText}>Custom Report</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleDayReport}
        >
          <Icon name="clock-o" size={24} color="#ff9800" />
          <Text style={styles.optionText}>Day Report</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleWeek}
        >
          <View style={styles.weekContainer}>
            <Icon name="calendar" size={24} color="#6b96c2" />
            <Text style={styles.supText}>7</Text>
          </View>
          <Text style={styles.optionText}>Week Report</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleMonthReport}
        >
          <Icon name="calendar" size={24} color="#f44336" />
          <Text style={styles.optionText}>Month Report</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReportHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  optionIcon: {
    marginLeft: "auto",
  },
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supText: {
    fontSize: 22, // Adjust as needed
    color: "black",
    position: 'absolute',
    top: -9,
    right: 0,
    zIndex: 1,
  },
});

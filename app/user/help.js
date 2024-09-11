import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';

const Help = () => {
  const handleContactSupport = () => {
    // Replace with your support email or phone number
    const email = 'support@personalfinancemonitoring.com';
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      
      <Text style={styles.subtitle}>How can we assist you?</Text>
      <Text style={styles.description}>
        Welcome to our Help section. Here you'll find answers to common questions and contact information for further assistance.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q1: How do I reset my password?</Text>
          <Text style={styles.faqAnswer}>A1: Go to the login page and click on "Forgot Password" to reset your password.</Text>
        </Text>
        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q2: How can I update my email address?</Text>
          <Text style={styles.faqAnswer}>A2: Update your email address in the profile settings of your account.</Text>
        </Text>
        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q3: Why is my transaction not showing up?</Text>
          <Text style={styles.faqAnswer}>A3: Ensure you have a stable internet connection and refresh the app. If the issue persists, check if the transaction was successfully recorded in the app settings.</Text>
        </Text>
        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q4: How do I categorize a new transaction?</Text>
          <Text style={styles.faqAnswer}>A4: When adding a new transaction, you can select a category from the provided options or create a new one in the transaction form.</Text>
        </Text>
        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q5: How do I view my financial goals?</Text>
          <Text style={styles.faqAnswer}>A5: Go to the "Financial Goals" section in the app menu to view and manage your goals.</Text>
        </Text>
        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q6: How can I contact support?</Text>
          <Text style={styles.faqAnswer}>A6: If you have any other questions or need further assistance, you can contact our support team via email by clicking the "Contact Support" button below.</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <Text style={styles.description}>
          If you have any other questions or need further assistance, feel free to contact our support team.
        </Text>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  faqItem: {
    marginBottom: 12,
  },
  faqQuestion: {
    fontWeight: '600',
  },
  faqAnswer: {
    fontSize: 16,
    color: '#555',
  },
  contactButton: {
    backgroundColor: '#6200ea',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Help;

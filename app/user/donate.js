import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Animated,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "@tanstack/react-query";
import Icon from "react-native-vector-icons/FontAwesome"; 
import { useSelector } from 'react-redux';  // Ensure you import useSelector
import { donate as donateAPI } from "../(services)/api/api";

const DonateSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(10, "Phone number is too short")
    .max(10, "Phone number is too long")
    .required("Phone number is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be greater than zero"),
});

export default function Donate() {
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = new Animated.Value(1);
  const userId = useSelector((state) => state.auth.user?.userId);

  const donationMutation = useMutation({
    mutationFn: (values) => donateAPI({ ...values, userId }), // Pass userId with the donation values
    mutationKey: ["donate"],
    onSuccess: () => {
      Alert.alert("Thank You!", "Your donation has been processed.");
      setModalVisible(false);
    },
    onError: (error) => {
      Alert.alert("Error", error.response?.data?.message || "An error occurred.");
    },
  });

  const startPumping = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startPumping();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF5722', '#E64A19']}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Support Us with a Donation</Text>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Icon name="heart" size={80} color="#fff" />
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.text}>
          Your support helps us improve and maintain this app. Any amount you donate will make a difference!
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.donateButton} 
            onPress={() => setModalVisible(true)}
            accessible={true}
            accessibilityLabel="Donate Now"
          >
            <LinearGradient
              colors={['#FF9800', '#F57C00']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Donate Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Donation Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeIcon}
              accessible={true}
              accessibilityLabel="Close donation form"
            >
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Donate Now</Text>

            <Formik
              initialValues={{ phoneNumber: '', amount: '' }}
              validationSchema={DonateSchema}
              onSubmit={(values) => donationMutation.mutate(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    accessibilityLabel="Phone Number Input"
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Amount (RWF)"
                    keyboardType="numeric"
                    onChangeText={handleChange("amount")}
                    onBlur={handleBlur("amount")}
                    value={values.amount}
                    accessibilityLabel="Amount Input"
                  />
                  {errors.amount && touched.amount && (
                    <Text style={styles.errorText}>{errors.amount}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={donationMutation.isLoading}
                    accessibilityLabel="Submit Donation"
                  >
                    {donationMutation.isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Donate</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerGradient: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  donateButton: {
    width: '80%',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
});

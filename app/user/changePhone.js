import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { getUser, updateUser } from "../(services)/api/api";
import ProtectedRoute from "../components/ProtectedRoute";

const ChangePhoneSchema = Yup.object().shape({
  newPhoneNumber: Yup.string().required("Required"),
});

export default function ChangePhone() {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.userId);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(userId, token);
        setCurrentPhoneNumber(userData.phoneNumber);
      } catch (err) {
        setError("Failed to load current phone");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchUserData();
    }
  }, [userId, token]);

  const handleLogout = () => {
    router.push("/(tabs)/profile");
  };

  const mutation = useMutation({
    mutationFn: (newPhoneNumber) => updateUser(userId, { phoneNumber: newPhoneNumber }, token),
    onSuccess: () => {
      Alert.alert(
        "Phone number Updated",
        "Your phone number has been updated.",
        [
          {
            text: "OK",
            onPress: handleLogout,
          },
        ]
      );
    },
    onError: (error) => {
      console.log("Error details:", error.response ? error.response.data : error.message);
      Alert.alert("Error", error?.response?.data?.message || "Failed to update phone number.");
    },
  });

  if (loading) {
    return (
        console.log(loading)
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Change Phone Number</Text>
        <Text style={styles.currentPhoneText}>Current Phone: {currentPhoneNumber}</Text>
        {mutation.isError && (
          <Text style={styles.errorText}>
            {mutation.error?.response?.data?.message || "An error occurred."}
          </Text>
        )}
        <Formik
          initialValues={{
            newPhoneNumber: "",
          }}
          validationSchema={ChangePhoneSchema}
          onSubmit={(values) => {
            mutation.mutate(values.newPhoneNumber);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              {errors.newPhoneNumber && touched.newPhoneNumber && (
                <Text style={styles.errorText}>{errors.newPhoneNumber}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="New Phone Number"
                onChangeText={handleChange("newPhoneNumber")}
                onBlur={handleBlur("newPhoneNumber")}
                value={values.newPhoneNumber}
                keyboardType="phone-pad"
              />
              {errors.newPhoneNumber && touched.newPhoneNumber && (
                <Text style={styles.errorText}>{errors.newPhoneNumber}</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  currentPhoneText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
  },
});

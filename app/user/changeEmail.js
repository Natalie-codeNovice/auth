import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { getUser, updateUser } from "../(services)/api/api";
import ProtectedRoute from "../components/ProtectedRoute";

const ChangeEmailSchema = Yup.object().shape({
  newEmail: Yup.string().email("Invalid email").required("Required"),
});

export default function ChangeEmail() {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.userId);
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(userId, token);
        setCurrentEmail(userData.email);
      } catch (err) {
        setError("Failed to load current email");
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
    mutationFn: (newEmail) => updateUser(userId, { email: newEmail }, token),
    onSuccess: () => {
      Alert.alert(
        "Email Updated",
        "Your email address has been updated.",
        [
          {
            text: "OK",
            onPress: handleLogout,
          },
        ]
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
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
        <Text style={styles.title}>Change Email</Text>
        
        {/* Display the current email */}
        <Text style={styles.currentEmailText}>Current Email: {currentEmail}</Text>
        
        {mutation.isError && (
          <Text style={styles.errorText}>
            {mutation.error?.response?.data?.message || "An error occurred."}
          </Text>
        )}
        
        <Formik
          initialValues={{
            newEmail: "",
          }}
          validationSchema={ChangeEmailSchema}
          onSubmit={(values) => {
            mutation.mutate(values.newEmail);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="New Email"
                onChangeText={handleChange("newEmail")}
                onBlur={handleBlur("newEmail")}
                value={values.newEmail}
                keyboardType="email-address"
              />
              {errors.newEmail && touched.newEmail && (
                <Text style={styles.errorText}>{errors.newEmail}</Text>
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
  currentEmailText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
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
});

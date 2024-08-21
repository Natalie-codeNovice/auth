import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../(services)/api/api";
import ProtectedRoute from "../components/ProtectedRoute";

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Required'),
});

export default function ChangePassword() {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.userId);

  const [error, setError] = useState(null);

  const handleLogout = () => {
    router.push("/(tabs)");
  };

  const mutation = useMutation({
    mutationFn: (values) => {
      const { currentPassword, newPassword } = values;
      return updatePassword(userId, currentPassword, newPassword, token);
    },
    onSuccess: () => {
      Alert.alert(
        "Password Updated",
        "Your password has been updated successfully.",
        [
          {
            text: "OK",
            onPress: handleLogout
          },
        ]
      );
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "An error occurred.");
    },
  });

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={ChangePasswordSchema}
          onSubmit={(values) => {
            mutation.mutate(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                onChangeText={handleChange("currentPassword")}
                onBlur={handleBlur("currentPassword")}
                value={values.currentPassword}
                secureTextEntry
              />
              {errors.currentPassword && touched.currentPassword && (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="New Password"
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                value={values.newPassword}
                secureTextEntry
              />
              {errors.newPassword && touched.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                secureTextEntry
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
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
});

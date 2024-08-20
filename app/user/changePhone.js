import React from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../(services)/api/api";
import { logoutAction } from "../(redux)/authSlice";
import ProtectedRoute from "../components/ProtectedRoute";


const ChangePhoneSchema = Yup.object().shape({
  currentPhoneNumber: Yup.string().required("Required"),
  newPhoneNumber: Yup.string().required("Required"),
});

export default function ChangePhone() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user) || {};
  const token = useSelector((state) => state.auth.token);
  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  const mutation = useMutation({
    mutationFn: (values) => {
      const { newPhoneNumber } = values;
      return updateUser(user.userId, { phoneNumber: newPhoneNumber }, token);
    },
    onSuccess: () => {
      Alert.alert(
        "Phone Number Updated",
        "Your phone number has been updated. Please log out and log back in to see the changes.",
        [
          {
            text: "OK",
            onPress: handleLogout
          },
        ]
      );
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to update phone number.");
    },
  });

  return (
    <ProtectedRoute>
    <View style={styles.container}>
      <Text style={styles.title}>Change Phone Number</Text>
      <Text style={styles.currentPhoneText}>Current Phone: {user.phoneNumber}</Text>
      {mutation.isError && (
        <Text style={styles.errorText}>
          {mutation.error?.response?.data?.message || "An error occurred."}
        </Text>
      )}
      <Formik
        initialValues={{
          currentPhoneNumber: user.phoneNumber || "",
          newPhoneNumber: "",
        }}
        validationSchema={ChangePhoneSchema}
        onSubmit={(values) => {
          mutation.mutate(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            {errors.currentPhoneNumber && touched.currentPhoneNumber && (
              <Text style={styles.errorText}>{errors.currentPhoneNumber}</Text>
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

import React from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../(services)/api/api";

const ChangePhoneSchema = Yup.object().shape({
  currentPhoneNumber: Yup.string().required("Required"),
  newPhoneNumber: Yup.string().required("Required"),
});

export default function ChangePhone() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user) || {};
  const token = useSelector((state) => state.auth.token);

  // Mutation function updated to handle `newPhoneNumber`
  const mutation = useMutation({
    mutationFn: (values) => {
      const { newPhoneNumber } = values;
      return updateUser(user.userId, { phoneNumber: newPhoneNumber }, token);
    },
    onSuccess: () => {
      router.push("/(tabs)");
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to update phone number.");
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Phone Number</Text>
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
            <TextInput
              style={styles.input}
              placeholder="Current Phone Number"
              onChangeText={handleChange("currentPhoneNumber")}
              onBlur={handleBlur("currentPhoneNumber")}
              value={values.currentPhoneNumber}
              keyboardType="phone-pad"
            />
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

import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../(services)/api/api";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phoneNumber: Yup.string().required("Required"),
});

export default function Register() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: registerUser,
    mutationKey: ["register"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {mutation.isError && (
        <Text style={styles.errorText}>
          {mutation.error?.response?.data?.message || "Registration failed"}
        </Text>
      )}
      {mutation.isSuccess && (
      Alert.alert(
        'Success',
        'Registration successful! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      )
      )}
      <Formik
        initialValues={{ username: "", email: "", password: "", confirmPassword: "", phoneNumber: "" }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          mutation.mutateAsync(values)
            .then((data) => {
              console.log("Registration data:", data);
              // Show success message or redirect to a different page if needed
            })
            .catch((err) => {
              console.error("Registration error:", err);
              // Handle registration error here
            });
        }}
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
              placeholder="Username"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
            />
            {errors.username && touched.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              secureTextEntry
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
            />
            {errors.phoneNumber && touched.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.loginLink}>Login here</Text>
              </TouchableOpacity>
            </View>
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
  successText: {
    color: "green",
    marginBottom: 16,
    textAlign: "center",
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
  loginPrompt: {
    marginTop: 20,
    alignItems: "center",
  },
  loginPromptText: {
    fontSize: 16,
    color: "#333",
  },
  loginLink: {
    color: "#6200ea",
    fontSize: 16,
    marginTop: 8,
  },
});

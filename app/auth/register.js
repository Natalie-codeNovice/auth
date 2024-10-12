import React, { useState } from "react";
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
import { FontAwesome } from '@expo/vector-icons'; // Import icons

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
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    Alert.alert(
      'Success',
      'Registration successful! Please check your email to verify your account.',
      [{ text: 'OK', onPress: () => router.push("/auth/login") }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      {mutation.isError && (
        <Text style={styles.errorText}>
          {mutation.error?.response?.data?.message || "Registration failed"}
        </Text>
      )}
      <Formik
        initialValues={{ username: "", email: "", password: "", confirmPassword: "", phoneNumber: "" }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          setLoading(true);
          mutation.mutateAsync(values)
            .then((data) => {
              handleSuccess();
            })
            .catch((err) => {
              console.error("Registration error:", err);
            })
            .finally(() => {
              setLoading(false);
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
            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
            </View>
            {errors.username && touched.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
              />
            </View>
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
              />
            </View>
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                secureTextEntry
              />
            </View>
            {errors.confirmPassword && touched.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <FontAwesome name="phone" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
              />
            </View>
            {errors.phoneNumber && touched.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
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
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1E3A8A",
  },
  form: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  button: {
    height: 50,
    backgroundColor: "#4A90E2",
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
    color: "#4A90E2",
    fontSize: 16,
    marginTop: 8,
  },
});

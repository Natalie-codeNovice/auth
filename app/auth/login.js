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
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { loginAction } from "../(redux)/authSlice";
import { loginUser, forgotPassword as forgotPasswordAPI } from "../(services)/api/api";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(3, "Too Short!").required("Required"),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordAPI,
    mutationKey: ["forgotPassword"],
  });

  const handleForgotPassword = (email) => {
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          Alert.alert("Success", "A new password has been sent to your email.", [
            { text: "OK", onPress: () => setForgotPassword(false) },
          ]);
        },
        onError: (error) => {
          Alert.alert("Error", error.response?.data?.message || "An error occurred.");
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FinanceTrack</Text>
      <Text style={styles.subtitle}>Manage your finances effortlessly</Text>

      {loginMutation.isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {loginMutation.error?.response?.data?.message}
          </Text>
          {!forgotPassword && (
            <TouchableOpacity
              onPress={() => setForgotPassword(true)}
              style={styles.forgotPasswordLink}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {forgotPassword ? (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email("Invalid email").required("Required"),
          })}
          onSubmit={(values) => handleForgotPassword(values.email)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#B0BEC5" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholderTextColor="#999"
                />
              </View>
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={forgotPasswordMutation.isLoading}
              >
                {forgotPasswordMutation.isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setForgotPassword(false)}
                style={styles.backLink}
              >
                <Text style={styles.backLinkText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            setLoading(true);
            loginMutation
              .mutateAsync(values)
              .then((data) => {
                dispatch(loginAction(data));
                router.push("/(tabs)");
              })
              .catch((err) => {
                console.error("Login error:", err);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#B0BEC5" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  placeholderTextColor="#999"
                />
              </View>
              {errors.username && touched.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#B0BEC5" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry
                  placeholderTextColor="#999"
                />
              </View>
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/auth/register")}>
                  <Text style={styles.loginLink}>Signup here</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E8F0F2", // Light background color
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A90E2", // Primary color for title
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#777", // Subtitle color
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#B0BEC5",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    flex: 1,
    paddingHorizontal: 16,
  },
  icon: {
    padding: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#4A90E2", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
    elevation: 2, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  forgotPasswordLink: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "#4A90E2", // Link color
    fontSize: 16,
  },
  backLink: {
    marginTop: 16,
  },
  backLinkText: {
    color: "#4A90E2", // Link color
    fontSize: 16,
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
    color: "#4A90E2", // Link color
    fontSize: 16,
    marginTop: 8,
  },
});

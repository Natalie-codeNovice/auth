import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginAction } from "../(redux)/authSlice";
import { useDispatch } from "react-redux";
import { loginUser, forgotPassword as forgotPasswordAPI } from "../(services)/api/api";


const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [forgotPassword, setForgotPassword] = useState(false);

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
      { email }, // Send the email as an object
      {
        onSuccess: () => {
          Alert.alert(
            "Success",
            "A new password has been sent to your email.",
            [{ text: "OK", onPress: () => setForgotPassword(false) }]
          );
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error.response?.data?.message || "An error occurred."
          );
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {loginMutation?.isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {loginMutation?.error?.response?.data?.message}
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
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.forgotPasswordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
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
                  <Text style={styles.buttonText}>Submit</Text>
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
          initialValues={{ username: "paccy", password: "123456" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            loginMutation
              .mutateAsync(values)
              .then((data) => {
                dispatch(loginAction(data));
                router.push("/(tabs)");
              })
              .catch((err) => {
                console.error("Login error:", err);
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
                placeholder="username"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                keyboardType="username"
              />
              {errors.username && touched.username ? (
                <Text style={styles.errorText}>{errors.username}</Text>
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
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loginMutation.isLoading} // Disable button while loading
              >
                {loginMutation.isLoading ? ( // Show loading spinner or change button text
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>Don't you have an account?</Text>
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
  errorContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  forgotPasswordLink: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "#6200ea",
    fontSize: 16,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "center",
  },
  backLink: {
    marginTop: 16,
  },
  backLinkText: {
    color: "#6200ea",
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
    color: "#6200ea",
    fontSize: 16,
    marginTop: 8,
  },
});

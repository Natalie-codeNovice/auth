import React from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../(services)/api/api";
import { logoutAction } from "../(redux)/authSlice";
import ProtectedRoute from "../components/ProtectedRoute";

const ChangeUsernameSchema = Yup.object().shape({
  newUsername: Yup.string().required("Required"),
});

export default function ChangeUsername() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || {};
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  const mutation = useMutation({
    mutationFn: (newUsername) => updateUser(user.userId, { username: newUsername }, token),
    onSuccess: () => {
      Alert.alert(
        "Username Updated",
        "Your username has been updated. Please log out and log back in to see the changes.",
        [
          {
            text: "OK",
            onPress: handleLogout,
          },
        ]
      );
    },
    onError: (error) => {
      console.log(error)
    },
  });

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Change Username</Text>
        
        {/* Display the current username */}
        <Text style={styles.currentUsernameText}>Current Username: {user.username}</Text>
        {mutation.isError && (
          <Text style={styles.errorText}>
            {mutation.error?.response?.data?.message || "An error occurred."}
          </Text>
        )}
        
        <Formik
          initialValues={{
            newUsername: "",
          }}
          validationSchema={ChangeUsernameSchema}
          onSubmit={(values) => {
            mutation.mutate(values.newUsername);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="New Username"
                onChangeText={handleChange("newUsername")}
                onBlur={handleBlur("newUsername")}
                value={values.newUsername}
              />
              {errors.newUsername && touched.newUsername && (
                <Text style={styles.errorText}>{errors.newUsername}</Text>
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
  currentUsernameText: {
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

import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;
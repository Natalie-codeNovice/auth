import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import ProtectedRoute from "../components/ProtectedRoute";
export default function RootLayout() {
  return (
    <ProtectedRoute>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Income",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="dollar" color={color} />
            ),
          }}
        />
        {/* profile */}

        <Tabs.Screen
          name="saving"
          options={{
            headerShown: false,
            title: "Savings",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="bank" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expense"
          options={{
            headerShown:false,
            title: "Expenses",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="minus-circle" color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
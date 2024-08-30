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
            title: "Transactions",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="dollar" color={color} />
            ),
          }}
        />

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
          name="report"
          options={{
            headerShown:false,
            title: "Report",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="book" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            headerShown:false,
            title: "Goals",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="graduation-cap" color={color} />
            ),
          }}
        />        
      </Tabs>
    </ProtectedRoute>
  );
}
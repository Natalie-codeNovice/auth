import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { deleteUser } from "../(services)/api/api";
import { useLogout } from "../(services)/hooks/useLogout";
import { logoutAction } from "../(redux)/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user) || {};
  const token = useSelector((state) => state.auth.token);
  
  // Initialize the useLogout hook
  const { mutate: logout, isLoading: isLoggingOut } = useLogout();

  const handleEmailChange = () => {
    router.push("/user/changeEmail");
  };
  
  const handleUsernameChange = () => {
    router.push("/user/changeUsername");
  };
  
  const handleHelp = () => {
    router.push("/user/help");
  };
  
  const handleChangeNumber = () => {
    router.push("/user/changePhone");
  };

  const handleChangePassword = () => {
    router.push("/user/changePassword");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              if (token && user.userId) {
                await deleteUser(user.userId, token);
                Alert.alert('Account Deleted', 'Your account has been deleted.');
                dispatch(logoutAction());
                router.push("/auth/login");
              } else {
                Alert.alert('Error', 'Unable to delete account. User or token is missing.');
              }
            } catch (error) {
              console.error("Deletion error:", error);
              Alert.alert('Error', 'Failed to delete account.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    if (user.userId && token) {
      logout({ userId: user.userId, token }, {
        onSuccess: () => {
          dispatch(logoutAction()); // Clear Redux state
          router.push("/auth/login");
        },
        onError: (error) => {
          console.error('Error during logout:', error);
        },
      });
    } else {
      Alert.alert('Error', 'User or token information is missing.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.option}
          onPress={handleUsernameChange}
        >
          <Icon name="user" size={24} color="#4caf50" />
          <Text style={styles.optionText}>Change username</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleEmailChange}
        >
          <Icon name="envelope" size={24} color="#4caf50" />
          <Text style={styles.optionText}>Email Address</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleChangeNumber}
        >
          <Icon name="phone" size={24} color="#ff9800" />
          <Text style={styles.optionText}>Change Number</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleChangePassword}
        >
          <Icon name="lock" size={24} color="#f44336" />
          <Text style={styles.optionText}>Change Password</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleDeleteAccount}
        >
          <Icon name="trash" size={24} color="#3f51b5" />
          <Text style={styles.optionText}>Delete Account</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleHelp}
        >
          <Icon name="info-circle" size={24} color="#3f51b5" />
          <Text style={styles.optionText}>Help</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleLogout} disabled={isLoggingOut}>
          <Icon name="sign-out" size={24} color="#e91e63" />
          <Text style={styles.optionText}>Logout</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  optionIcon: {
    marginLeft: "auto",
  },
});

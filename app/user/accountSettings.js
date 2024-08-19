import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You can choose the icon set you prefer

const AccountSettings = () => {
  const handleEmailChange = () => {
    Alert.alert('Change Email Address', 'Functionality to change email address');
  };

  const handleChangeNumber = () => {
    Alert.alert('Change Phone Number', 'Functionality to change phone number');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Functionality to change password');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Add functionality to delete account
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={handleEmailChange}>
        <Icon name="email" size={24} color="#6200ea" />
        <Text style={styles.optionText}>Email Address</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleChangeNumber}>
        <Icon name="phone" size={24} color="#6200ea" />
        <Text style={styles.optionText}>Change Number</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleChangePassword}>
        <Icon name="lock" size={24} color="#6200ea" />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleDeleteAccount}>
        <Icon name="delete" size={24} color="#6200ea" />
        <Text style={styles.optionText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
    marginLeft: 16,
  },
});

export default AccountSettings;

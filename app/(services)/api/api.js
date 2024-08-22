import axios from "axios";

// Base URL for the API
const baseURL = "https://finance-zgvt.onrender.com";

// API call for logging in a user
const loginUser = async ({ username, password }) => {
  const response = await axios.post(`${baseURL}/login`, {
    username,
    password
  });
  return response.data;
};

// API call for registering a new user
const registerUser = async ({ username, email, password, phoneNumber }) => {
  const response = await axios.post(`${baseURL}/signup`, {
    username,
    email,
    password,
    phoneNumber
  });
  return response.data;
};

// API call for updating user information
const updateUser = async (userId, data, token) => {
  const response = await axios.put(
    `${baseURL}/${userId}`, // Assuming endpoint format
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// API call for updating the user's password
const updatePassword = async (userId, currentPassword, newPassword, token) => {
  console.log("Token", token);
  console.log("UserId", userId);
  console.log("New", newPassword);
  const response = await axios.put(
    `${baseURL}/password/${userId}`, // Assuming endpoint format
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// API call for deleting a user
const deleteUser = async (userId, token) => {
  const response = await axios.delete(
    `${baseURL}/${userId}`, // Assuming endpoint format
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


// API call for deleting a user
const getUser = async (userId, token) => {
  console.log(token);
  console.log(userId);
  const response = await axios.get(
    `${baseURL}/${userId}`, // Assuming endpoint format
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// forgot password
const forgotPassword = async ({ email }) => {
  console.log(email)
  const response = await axios.post(`${baseURL}/forgot-password`, {email});
  return response.data;
};

export { loginUser, registerUser, updateUser, updatePassword, deleteUser, getUser,forgotPassword };

import axios from "axios";

const loginUser = async ({ email, password }) => {
  const response = await axios.post("https://final-yr.onrender.com/login", {
    email,
    password
  });
  return response.data;
};

const registerUser = async ({ username, email, password, phoneNumber }) => {
  const response = await axios.post("https://final-yr.onrender.com/signup", {
    username,
    email,
    password,
    phoneNumber
  });
  return response.data;
};

const updateUser = async (userId, data, token) => {
    console.log("userId: ",userId);
    console.log("data: ",data);
    console.log("token: ",token);
  const response = await axios.put(
    `https://final-yr.onrender.com/${userId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const deleteUser = async (userId, token) => {
  const response = await axios.delete(
    `https://final-yr.onrender.com/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export { loginUser, registerUser, updateUser, deleteUser };

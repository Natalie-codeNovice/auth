import axios from "axios";

// Base URL for the API
const baseURL = "https://finance-zgvt.onrender.com";

// API call for fetching net balance
const getNetBalance = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/balance/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data; 
};

// API call for fetching income transactions
const getIncome = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/income/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data; 
};

// API call for fetching expense transactions
const getExpense = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/expense/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data; 
};

// API call for fetching saving transactions
const getSavings = async (userId, token) => {
  console.log(token);
  console.log(userId);
  const response = await axios.get(
    `${baseURL}/saving/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data; 
};

const getRecentTransactions = async (userId, token) => {
  console.log(token);
  console.log(userId);
  const response = await axios.get(
    `${baseURL}/transactions/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data; 
};

const addTransaction = async (userId, transaction, token) => {
  console.log(userId)
  const response = await axios.post(
    `${baseURL}/add/${userId}`, 
    transaction,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data; 
};
export { getNetBalance, getIncome, getExpense,getRecentTransactions,addTransaction,getSavings };

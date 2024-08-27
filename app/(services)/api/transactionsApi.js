import axios from "axios";
import { URL } from "./url";

const baseURL = URL;

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

// API call for fetching recent transactions
const getRecentTransactions = async (userId, token) => {
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

// API call for fetching weekly report
const getWeekReport = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/week-report/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data;
};

// API call for fetching monthly report
const getMonthReport = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/month-report/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  ); 
  return response.data;
};

// API call for adding a transaction
const addTransaction = async (userId, transaction, token) => {
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

const useSaving = async (savingId) => {
  console.log("logged savingId: ",savingId);
  const response = await axios.put(
    `${baseURL}/saving/use/${savingId}`, 
  );
  return response.data; 
};

// Export all functions
export { 
  getNetBalance, 
  getIncome, 
  getExpense, 
  getRecentTransactions, 
  addTransaction, 
  getSavings,
  getWeekReport,
  getMonthReport,
  useSaving
};

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

// API call for fetching weekly report chart 
const getWeekReportChart = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/week-chart/${userId}`, 
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

// API call for fetching monthly report line chart
const getMonthReportChart = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/month-chart/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  ); 
  return response.data;
};

// API call for fetching day report
const getDayReport = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/day-report/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  ); 
  return response.data;
};

// API call for fetching day report
const getDaylyReport = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/dayly-report/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  ); 
  return response.data;
};

// API call for fetching custom report
const getCustomReport = async (userId, token, startDate, endDate) => {
  const response = await axios.post(`${baseURL}/custom/${userId}`, {
    startDate,
    endDate,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
//api call for use saving
const useSaving = async (savingId) => {
  console.log("logged savingId: ",savingId);
  const response = await axios.put(
    `${baseURL}/saving/use/${savingId}`, 
  );
  return response.data; 
};

//api call for getting limits
const getGoals = async (userId, token) => {
  const response = await axios.get(
    `${baseURL}/limits/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data; 
};

//api call for adding new limi
const addGoal = async (userId, token, newGoal) => {
  const response = await axios.post(
    `${baseURL}/limits/${userId}`, 
    newGoal,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data; 
};

//api call for cancelling transaction
const cancelTransaction = async (transactionId) => {
  console.log("TransactionId: ", transactionId);
  const response = await axios.post(
    `${baseURL}/cancel-transactions/${transactionId}`, 
    {},
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
  useSaving,
  getGoals,
  addGoal,
  getDayReport,
  getCustomReport,
  getWeekReportChart,
  getMonthReportChart,
  getDaylyReport,
  cancelTransaction
};

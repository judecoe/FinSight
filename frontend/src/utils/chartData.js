// Shared utility for chart data generation and access
// This ensures consistent data across components

// Mock transactions data (moved up to be accessible by other functions)
export const getMockTransactions = () => [
  // June 2025
  {
    id: "1",
    amount: -45.23,
    merchant: "Starbucks",
    date: "2025-06-15",
    category: "Food & Drink",
  },
  {
    id: "2",
    amount: -120.0,
    merchant: "Gas Station",
    date: "2025-06-12",
    category: "Transportation",
  },
  {
    id: "3",
    amount: 2500.0,
    merchant: "Direct Deposit",
    date: "2025-06-01",
    category: "Income",
  },

  // May 2025
  {
    id: "4",
    amount: -89.99,
    merchant: "Amazon",
    date: "2025-05-28",
    category: "Shopping",
  },
  {
    id: "5",
    amount: -15.75,
    merchant: "McDonald's",
    date: "2025-05-25",
    category: "Food & Drink",
  },
  {
    id: "6",
    amount: -60.0,
    merchant: "Uber",
    date: "2025-05-20",
    category: "Transportation",
  },
  {
    id: "7",
    amount: 3000.0,
    merchant: "Freelance Payment",
    date: "2025-05-15",
    category: "Income",
  },
  {
    id: "8",
    amount: -200.0,
    merchant: "Best Buy",
    date: "2025-05-10",
    category: "Shopping",
  },

  // April 2025
  {
    id: "9",
    amount: -75.0,
    merchant: "Gym Membership",
    date: "2025-04-28",
    category: "Health & Fitness",
  },
  {
    id: "10",
    amount: -35.0,
    merchant: "Subway",
    date: "2025-04-22",
    category: "Food & Drink",
  },
  {
    id: "11",
    amount: -150.0,
    merchant: "Target",
    date: "2025-04-18",
    category: "Shopping",
  },
  {
    id: "12",
    amount: -300.0,
    merchant: "Electric Company",
    date: "2025-04-15",
    category: "Bills",
  },
  {
    id: "13",
    amount: 2800.0,
    merchant: "Salary",
    date: "2025-04-01",
    category: "Income",
  },

  // March 2025
  {
    id: "14",
    amount: -20.0,
    merchant: "Spotify",
    date: "2025-03-25",
    category: "Entertainment",
  },
  {
    id: "15",
    amount: -50.0,
    merchant: "Netflix",
    date: "2025-03-20",
    category: "Entertainment",
  },
  {
    id: "16",
    amount: -100.0,
    merchant: "Walmart",
    date: "2025-03-15",
    category: "Shopping",
  },
  {
    id: "17",
    amount: -80.0,
    merchant: "Lyft",
    date: "2025-03-10",
    category: "Transportation",
  },
  {
    id: "18",
    amount: 2900.0,
    merchant: "Paycheck",
    date: "2025-03-01",
    category: "Income",
  },

  // February 2025
  {
    id: "19",
    amount: -45.0,
    merchant: "CVS Pharmacy",
    date: "2025-02-28",
    category: "Health & Fitness",
  },
  {
    id: "20",
    amount: -25.0,
    merchant: "Starbucks",
    date: "2025-02-22",
    category: "Food & Drink",
  },
  {
    id: "21",
    amount: -180.0,
    merchant: "Costco",
    date: "2025-02-18",
    category: "Shopping",
  },
  {
    id: "22",
    amount: -65.0,
    merchant: "Restaurant",
    date: "2025-02-14",
    category: "Food & Drink",
  },
  {
    id: "23",
    amount: 2750.0,
    merchant: "Direct Deposit",
    date: "2025-02-01",
    category: "Income",
  },

  // January 2025
  {
    id: "24",
    amount: 4000.0,
    merchant: "Bonus Payment",
    date: "2025-01-31",
    category: "Income",
  },
  {
    id: "25",
    amount: -280.0,
    merchant: "Rent Payment",
    date: "2025-01-30",
    category: "Bills",
  },
  {
    id: "26",
    amount: -110.0,
    merchant: "Phone Bill",
    date: "2025-01-25",
    category: "Bills",
  },
  {
    id: "27",
    amount: -55.0,
    merchant: "Grocery Store",
    date: "2025-01-20",
    category: "Food & Drink",
  },
  {
    id: "28",
    amount: -90.0,
    merchant: "Gas Station",
    date: "2025-01-15",
    category: "Transportation",
  },
  {
    id: "29",
    amount: -35.0,
    merchant: "Coffee Shop",
    date: "2025-01-10",
    category: "Food & Drink",
  },
  {
    id: "30",
    amount: 2600.0,
    merchant: "Salary",
    date: "2025-01-01",
    category: "Income",
  },
];

// Calculate monthly spending from transactions
export const calculateMonthlySpending = (transactions) => {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    // Only count spending transactions (negative amounts)
    if (transaction.amount < 0) {
      // Parse date properly to avoid timezone issues
      const dateParts = transaction.date.split("-");
      const date = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
      );

      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11

      // Create a unique key combining year and month
      const monthKey = `${year}-${month.toString().padStart(2, "0")}`;

      // Create display name (e.g., "Jan 2025")
      const displayName = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          name: displayName,
          spending: 0,
          year: year,
          month: month,
        };
      }
      // Add absolute value of spending (convert negative to positive)
      monthlyData[monthKey].spending += Math.abs(transaction.amount);
    }
  });

  // Convert to array format for charts and sort chronologically
  return Object.values(monthlyData)
    .map((item) => ({
      name: item.name,
      spending: Math.round(item.spending * 100) / 100, // Round to 2 decimal places
      year: item.year,
      month: item.month,
    }))
    .sort((a, b) => {
      // Sort by year first, then by month
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month - b.month;
    })
    .map((item) => ({
      name: item.name,
      spending: item.spending,
    })); // Remove year/month from final output
};

// Default demo data - represents last 6 months
// Uses session-based randomization to keep values consistent during a session
export const getDefaultChartData = () => {
  // Check if we have cached demo data in session storage
  const cachedData =
    typeof window !== "undefined"
      ? sessionStorage.getItem("demo_chart_data")
      : null;

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Calculate spending from mock transactions instead of random data
  const mockTransactions = getMockTransactions();
  const calculatedData = calculateMonthlySpending(mockTransactions);

  // Cache the generated data for this session
  if (typeof window !== "undefined") {
    sessionStorage.setItem("demo_chart_data", JSON.stringify(calculatedData));
  }

  return calculatedData;
};

// Get the current month's spending from chart data
export const getCurrentMonthSpending = (chartData) => {
  if (!chartData || chartData.length === 0) {
    return 0;
  }

  // The last item in the array should be the current month
  // since the data is generated in chronological order
  return chartData[chartData.length - 1]?.spending || 0;
};

// Get the previous month's spending from chart data
export const getPreviousMonthSpending = (chartData) => {
  if (!chartData || chartData.length < 2) {
    return 0;
  }

  // The second to last item should be the previous month
  return chartData[chartData.length - 2]?.spending || 0;
};

// Calculate spending trend (positive means spending increased, negative means decreased)
export const getSpendingTrend = (chartData) => {
  const currentSpending = getCurrentMonthSpending(chartData);
  const previousSpending = getPreviousMonthSpending(chartData);

  if (previousSpending === 0) {
    return { change: 0, percentage: 0, isPositive: null };
  }

  const change = currentSpending - previousSpending;
  const percentage = (change / previousSpending) * 100;

  return {
    change,
    percentage,
    isPositive: change > 0, // true means spending increased (bad), false means decreased (good)
  };
};

// Determine if we should use real data or demo data
export const getChartData = (bankData, isBankConnected) => {
  const hasValidRealData =
    isBankConnected && bankData?.summary?.monthlySpending?.length > 0;

  let chartData;

  if (hasValidRealData) {
    // Use real bank data if available
    chartData = bankData.summary.monthlySpending;
  } else {
    // Calculate monthly spending from mock transactions
    const mockTransactions = getMockTransactions();
    chartData = calculateMonthlySpending(mockTransactions);
  }

  // Calculate current month spending from transactions (for consistency)
  const hasRealTransactions = bankData?.transactions?.length > 0;
  const transactionsList = hasRealTransactions
    ? bankData.transactions
    : getMockTransactions();

  const currentMonthSpendingFromTransactions = transactionsList.reduce(
    (sum, transaction) =>
      sum + (transaction.amount < 0 ? Math.abs(transaction.amount) : 0),
    0
  );

  const currentMonthSpending = getCurrentMonthSpending(chartData);
  const trend = getSpendingTrend(chartData);

  return {
    chartData,
    hasValidRealData,
    currentMonthSpending,
    previousMonthSpending: getPreviousMonthSpending(chartData),
    trend,
  };
};

// Shared utility for chart data generation and access
// This ensures consistent data across components

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

  // Generate new demo data if none exists
  const data = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthName = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    // Generate session-consistent random spending
    const spending = Math.floor(Math.random() * 300) + 200;
    data.push({ name: monthName, spending });
  }

  // Cache the generated data for this session
  if (typeof window !== "undefined") {
    sessionStorage.setItem("demo_chart_data", JSON.stringify(data));
  }

  return data;
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

// Mock transactions data (same as used in dashboard)
const getMockTransactions = () => [
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
    date: "2025-06-14",
    category: "Transportation",
  },
  {
    id: "3",
    amount: 2500.0,
    merchant: "Direct Deposit",
    date: "2025-06-13",
    category: "Income",
  },
  {
    id: "4",
    amount: -89.99,
    merchant: "Amazon",
    date: "2025-06-12",
    category: "Shopping",
  },
  {
    id: "5",
    amount: -15.75,
    merchant: "McDonald's",
    date: "2025-06-11",
    category: "Food & Drink",
  },
  {
    id: "6",
    amount: -60.0,
    merchant: "Uber",
    date: "2025-06-10",
    category: "Transportation",
  },
  {
    id: "7",
    amount: -200.0,
    merchant: "Best Buy",
    date: "2025-06-09",
    category: "Shopping",
  },
  {
    id: "8",
    amount: 3000.0,
    merchant: "Freelance Payment",
    date: "2025-06-08",
    category: "Income",
  },
  {
    id: "9",
    amount: -75.0,
    merchant: "Gym Membership",
    date: "2025-06-07",
    category: "Health & Fitness",
  },
  {
    id: "10",
    amount: -35.0,
    merchant: "Subway",
    date: "2025-06-06",
    category: "Food & Drink",
  },
  {
    id: "11",
    amount: -150.0,
    merchant: "Target",
    date: "2025-06-05",
    category: "Shopping",
  },
  {
    id: "12",
    amount: -20.0,
    merchant: "Spotify",
    date: "2025-06-04",
    category: "Entertainment",
  },
  {
    id: "13",
    amount: -300.0,
    merchant: "Electric Company",
    date: "2025-06-03",
    category: "Bills",
  },
  {
    id: "14",
    amount: -50.0,
    merchant: "Netflix",
    date: "2025-06-02",
    category: "Entertainment",
  },
  {
    id: "15",
    amount: -100.0,
    merchant: "Walmart",
    date: "2025-06-01",
    category: "Shopping",
  },
  {
    id: "16",
    amount: 4000.0,
    merchant: "Bonus Payment",
    date: "2025-06-01",
    category: "Income",
  },
  {
    id: "17",
    amount: -25.0,
    merchant: "Starbucks",
    date: "2025-06-01",
    category: "Food & Drink",
  },
  {
    id: "18",
    amount: -80.0,
    merchant: "Lyft",
    date: "2025-06-01",
    category: "Transportation",
  },
  {
    id: "19",
    amount: -45.0,
    merchant: "CVS Pharmacy",
    date: "2025-06-01",
    category: "Health & Fitness",
  },
];

// Determine if we should use real data or demo data
export const getChartData = (bankData, isBankConnected) => {
  const hasValidRealData =
    isBankConnected && bankData?.summary?.monthlySpending?.length > 0;

  const chartData = hasValidRealData
    ? bankData.summary.monthlySpending
    : getDefaultChartData();

  // Calculate current month spending from transactions (same logic as dashboard)
  const hasRealTransactions = bankData?.transactions?.length > 0;
  const transactionsList = hasRealTransactions
    ? bankData.transactions
    : getMockTransactions();
  const currentMonthSpendingFromTransactions = transactionsList.reduce(
    (sum, transaction) =>
      sum + (transaction.amount < 0 ? Math.abs(transaction.amount) : 0),
    0
  );

  // Update the chart data's current month value to match the dashboard calculation
  if (chartData.length > 0) {
    chartData[chartData.length - 1].spending =
      currentMonthSpendingFromTransactions;
  }

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

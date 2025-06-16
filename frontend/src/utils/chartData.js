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

// Determine if we should use real data or demo data
export const getChartData = (bankData, isBankConnected) => {
  const hasValidRealData =
    isBankConnected && bankData?.summary?.monthlySpending?.length > 0;

  const chartData = hasValidRealData
    ? bankData.summary.monthlySpending
    : getDefaultChartData();

  if (hasValidRealData) {
    const transactionsList = bankData.transactions;
    const currentMonthSpending = transactionsList.reduce(
      (sum, transaction) =>
        sum + (transaction.amount < 0 ? -transaction.amount : 0),
      0
    );
    chartData[chartData.length - 1].spending = currentMonthSpending;
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

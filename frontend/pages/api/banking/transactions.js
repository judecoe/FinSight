import { plaidClient } from "../../../lib/plaid";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { access_token } = req.query;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  try {
    // Get transactions for the last 6 months for better chart data
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    const endDate = new Date();

    const transactionsRequest = {
      access_token: access_token,
      start_date: startDate.toISOString().split("T")[0], // YYYY-MM-DD format
      end_date: endDate.toISOString().split("T")[0],
      count: 500, // Increase count to get more historical data
    };

    const transactionsResponse = await plaidClient.transactionsGet(
      transactionsRequest
    );
    const transactions = transactionsResponse.data.transactions;

    // Process transactions for analytics
    const monthlySpending = calculateMonthlySpending(transactions);

    // Calculate current month spending
    const currentDate = new Date();
    const currentMonthSpending = transactions
      .filter((t) => {
        // Parse date properly to avoid timezone issues
        const dateParts = t.date.split("-");
        const transactionDate = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );
        return (
          t.amount > 0 && // Only spending transactions
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const processedData = {
      transactions: transactions.map((transaction) => ({
        id: transaction.transaction_id,
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        category: transaction.category,
        account_id: transaction.account_id,
      })),
      summary: {
        totalSpending: currentMonthSpending, // Current month spending instead of total
        totalIncome: transactions
          .filter((t) => t.amount < 0) // Negative amounts are credits (income)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        transactionCount: transactions.length,
      },
      monthlySpending: monthlySpending,
      categoryBreakdown: calculateCategoryBreakdown(transactions),
    };

    res.status(200).json(processedData);
  } catch (error) {
    console.error("Error fetching transactions:", error);

    res.status(500).json({
      error: "Failed to fetch transactions",
      message: error.message,
    });
  }
}

function calculateMonthlySpending(transactions) {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      // Only spending transactions
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

      // Create display name (e.g., "Jan 2024")
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
      monthlyData[monthKey].spending += transaction.amount;
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
}

function calculateCategoryBreakdown(transactions) {
  const categoryData = {};

  transactions.forEach((transaction) => {
    if (
      transaction.amount > 0 &&
      transaction.category &&
      transaction.category.length > 0
    ) {
      const category = transaction.category[0]; // Use primary category

      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += transaction.amount;
    }
  });

  // Convert to array and sort by amount
  return Object.entries(categoryData)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10); // Top 10 categories
}

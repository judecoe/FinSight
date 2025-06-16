// Test script to verify monthly spending calculation logic
function calculateMonthlySpending(transactions) {
  const monthlyData = {};

  console.log("\nProcessing transactions:");
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

      console.log(
        `  ${transaction.date} -> ${displayName} (${monthKey}): $${transaction.amount}`
      );

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

  console.log("\nMonthly data object:");
  console.log(monthlyData);

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

// Test data spanning multiple months and years
const testTransactions = [
  { date: "2024-01-15", amount: 50.0 },
  { date: "2024-01-20", amount: 30.0 },
  { date: "2024-02-05", amount: 75.0 },
  { date: "2024-02-15", amount: 25.0 },
  { date: "2024-03-10", amount: 100.0 },
  { date: "2023-12-20", amount: 40.0 }, // Previous year
  { date: "2024-01-25", amount: 20.0 }, // Same month as first entries
  { date: "2024-04-01", amount: 60.0 },
  { date: "2024-02-28", amount: 15.0 }, // Same month as earlier entries
];

console.log("Test Transactions:");
testTransactions.forEach((t, i) => {
  console.log(`${i + 1}. ${t.date}: $${t.amount}`);
});

console.log("\nMonthly Spending Result:");
const result = calculateMonthlySpending(testTransactions);
console.log(result);

console.log("\nExpected behavior:");
console.log("- Should group by year-month combination");
console.log("- Should sort chronologically");
console.log("- Should show proper month names with years");
console.log("- Jan 2024: $70 (50 + 30 + 20)");
console.log("- Feb 2024: $115 (75 + 25 + 15)");
console.log("- Mar 2024: $100");
console.log("- Apr 2024: $60");
console.log("- Dec 2023: $40");

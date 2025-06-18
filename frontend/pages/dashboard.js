import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Chart, PureChart } from "../src/components/ui";
import withAuth from "../src/components/auth/withAuth";
import { getChartData } from "../src/utils/chartData";

function Dashboard() {
  const { data: session } = useSession();
  const [bankData, setBankData] = useState({
    accounts: [],
    transactions: [],
    summary: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        setLoading(true);

        // First, check if we have stored bank data in localStorage (demo mode fallback)
        const storedBankData = localStorage.getItem("bankData");
        const isDemoMode =
          localStorage.getItem("demo_bank_connected") === "true";

        if (isDemoMode && storedBankData) {
          setBankData(JSON.parse(storedBankData));
          setLoading(false);
          return;
        }

        // Try to fetch real account data from Plaid
        const accountsResponse = await fetch("/api/banking/accounts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();

          // Fetch transactions
          const transactionsResponse = await fetch(
            "/api/banking/transactions",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          let transactionsData = { transactions: [] };
          if (transactionsResponse.ok) {
            transactionsData = await transactionsResponse.json();
          }

          // Combine data
          const combinedData = {
            accounts: accountsData.accounts || [],
            transactions: transactionsData.transactions || [],
            summary: {
              total_balance: accountsData.total_available || 0,
              last_updated: new Date().toISOString(),
            },
          };

          setBankData(combinedData);
        } else {
          // No bank data available, use empty state
          setBankData({
            accounts: [],
            transactions: [],
            summary: null,
          });
        }
      } catch (error) {
        console.error("Error fetching bank data:", error);
        // Check for demo data fallback
        const storedBankData = localStorage.getItem("bankData");
        if (storedBankData) {
          setBankData(JSON.parse(storedBankData));
        } else {
          setBankData({
            accounts: [],
            transactions: [],
            summary: null,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBankData();
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use real bank data if available, otherwise use mock data for demonstration
  const hasRealData = bankData.accounts.length > 0;

  const accountsData = hasRealData
    ? bankData.accounts
    : [
        {
          id: "1",
          name: "Checking Account",
          balance: 5420.32,
          type: "checking",
        },
        {
          id: "2",
          name: "Savings Account",
          balance: 12000.85,
          type: "savings",
        },
        { id: "3", name: "Credit Card", balance: -1230.45, type: "credit" },
      ];

  const transactions = hasRealData
    ? bankData.transactions
    : [
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

  const spendingData = {
    labels: [
      "Food & Drink",
      "Transportation",
      "Shopping",
      "Entertainment",
      "Bills",
    ],
    datasets: [
      {
        data: [245, 320, 180, 150, 890],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const totalBalance =
    bankData.accounts.length > 0
      ? bankData.accounts.reduce((sum, account) => sum + account.balance, 0)
      : accountsData.reduce((sum, account) => sum + account.balance, 0);

  // Get chart data and current month spending
  const { chartData, trend } = getChartData(bankData, hasRealData);

  // Prepare monthly spending chart data
  const monthlySpendingData = {
    labels: chartData.map((item) => item.name),
    datasets: [
      {
        label: "Monthly Spending",
        data: chartData.map((item) => item.spending),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const calculateCurrentMonthSpending = () => {
    const transactionsList =
      bankData.transactions.length > 0 ? bankData.transactions : transactions;

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    return transactionsList.reduce((sum, transaction) => {
      // Only count spending transactions (negative amounts)
      if (transaction.amount < 0) {
        // Parse transaction date
        const dateParts = transaction.date.split("-");
        const transactionDate = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );

        // Check if transaction is from current month and year
        if (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          return sum + Math.abs(transaction.amount);
        }
      }
      return sum;
    }, 0);
  };

  const currentMonthSpending = calculateCurrentMonthSpending();

  return (
    <>
      <Head>
        <title>Dashboard - FinSight</title>
        <meta name="description" content="Your personal FinSight dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-white">
                  FinSight
                </span>
              </Link>

              <div className="flex items-center space-x-4">
                <Link
                  href="/link-bank"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Link Bank Account
                </Link>

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-300">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-400 hover:text-gray-200"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {session.user?.name?.split(" ")[0]}!
              </h1>
              <p className="mt-1 text-lg text-gray-300">
                Here's an overview of your financial data
              </p>

              {/* Data Source Indicator */}
              <div className="mt-4">
                {!hasRealData ? (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-900 text-yellow-200">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Demo Mode - Connect your bank to see real data
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-900 text-green-200">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Connected - Showing real bank data
                  </div>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <div className="bg-gray-800 rounded-lg shadow-md p-8 py-10 border border-gray-700 min-h-32">
                <div className="flex items-center h-full">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Total Balance
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        $
                        {totalBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-md p-8 py-10 border border-gray-700 min-h-32">
                <div className="flex items-center h-full">
                  <div className="flex-shrink-0">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        trend.isPositive === null
                          ? "bg-gray-100"
                          : trend.isPositive
                          ? "bg-red-100"
                          : "bg-green-100"
                      }`}
                    >
                      <svg
                        className={`h-5 w-5 ${
                          trend.isPositive === null
                            ? "text-gray-600"
                            : trend.isPositive
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            trend.isPositive === null
                              ? "M20 12H4" // horizontal line for no change data
                              : trend.isPositive
                              ? "M7 10l5-5m0 0l5 5m-5-5v18" // up arrow for increase (bad)
                              : "M17 14l-5 5m0 0l-5-5m5 5V4" // down arrow for decrease (good)
                          }
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        This Month Spending
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        $
                        {currentMonthSpending.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        {trend.isPositive !== null && (
                          <span
                            className={`ml-1 text-sm ${
                              trend.isPositive
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            ({trend.isPositive ? "+" : ""}
                            {trend.percentage.toFixed(1)}%)
                          </span>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-md p-8 py-10 border border-gray-700 min-h-32">
                <div className="flex items-center h-full">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9.5m3 9.5l3-9.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Connected Accounts
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {accountsData.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-md p-8 py-10 border border-gray-700 min-h-32">
                <div className="flex items-center h-full">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Recent Transactions
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {bankData.transactions.length || transactions.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Monthly Spending Trend */}
              <div className="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700 min-h-96">
                <PureChart
                  type="line"
                  data={chartData}
                  title="Monthly Spending (Demo)"
                  height={350}
                />
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700 min-h-96">
                <h3 className="text-lg font-medium text-white mb-4">
                  Recent Transactions
                </h3>
                <div className="overflow-y-auto max-h-96">
                  <table className="min-w-full table-auto">
                    <thead className="sticky top-0 bg-gray-800">
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Merchant
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="text-right py-2 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="text-right py-2 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {(bankData.transactions.length > 0
                        ? bankData.transactions
                        : transactions
                      ).map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="hover:bg-gray-700 transition-colors"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                  transaction.amount > 0
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span className="text-sm font-medium text-white truncate">
                                {transaction.merchant}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-xs text-gray-400">
                              {transaction.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`text-sm font-medium ${
                                transaction.amount > 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {transaction.amount > 0 ? "+" : ""}$
                              {Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="text-xs text-gray-400">
                              {transaction.date}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Account Overview */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 min-h-60">
              <h3 className="text-lg font-medium text-white mb-4">
                Account Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(bankData.accounts.length > 0
                  ? bankData.accounts
                  : accountsData
                ).map((account) => (
                  <div
                    key={account.id}
                    className="border border-gray-600 rounded-lg p-6 bg-gray-700 min-h-24"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          {account.name}
                        </h4>
                        <p className="text-xs text-gray-400 capitalize">
                          {account.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-medium ${
                            account.balance >= 0 ? "text-white" : "text-red-400"
                          }`}
                        >
                          $
                          {Math.abs(account.balance).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        {account.balance < 0 && (
                          <p className="text-xs text-red-400">Credit Balance</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default withAuth(Dashboard);

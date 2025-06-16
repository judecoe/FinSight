import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Card, Chart } from "../src/components/ui";
import withAuth from "../src/components/auth/withAuth";

function Dashboard() {
  const { data: session } = useSession();
  const [bankData, setBankData] = useState({
    accounts: [],
    transactions: [],
    summary: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load bank data from localStorage or API
    const storedBankData = localStorage.getItem("bankData");
    if (storedBankData) {
      setBankData(JSON.parse(storedBankData));
    }
    setLoading(false);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockAccountsData = [
    { id: "1", name: "Checking Account", balance: 5420.32, type: "checking" },
    { id: "2", name: "Savings Account", balance: 12000.85, type: "savings" },
    { id: "3", name: "Credit Card", balance: -1230.45, type: "credit" },
  ];

  const mockTransactions = [
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
      : mockAccountsData.reduce((sum, account) => sum + account.balance, 0);

  return (
    <>
      <Head>
        <title>Dashboard - Finance Dashboard</title>
        <meta name="description" content="Your personal finance dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
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
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Finance Dashboard
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/link-bank"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Link Bank Account
                </Link>

                <div className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user?.image || "/api/placeholder/32/32"}
                    alt={session.user?.name || "User"}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user?.name?.split(" ")[0]}!
              </h1>
              <p className="mt-1 text-lg text-gray-600">
                Here's an overview of your financial data
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center">
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Balance
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        $
                        {totalBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        This Month Spending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        $1,845.67
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Connected Accounts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {bankData.accounts.length || mockAccountsData.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Recent Transactions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {bankData.transactions.length ||
                          mockTransactions.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Spending Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Monthly Spending by Category
                </h3>
                <div className="h-64">
                  <Chart type="doughnut" data={spendingData} />
                </div>
              </Card>

              {/* Recent Transactions */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  {(bankData.transactions.length > 0
                    ? bankData.transactions
                    : mockTransactions
                  )
                    .slice(0, 5)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              transaction.amount > 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {transaction.merchant}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}$
                            {Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>

            {/* Account Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(bankData.accounts.length > 0
                  ? bankData.accounts
                  : mockAccountsData
                ).map((account) => (
                  <div
                    key={account.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {account.name}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {account.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-medium ${
                            account.balance >= 0
                              ? "text-gray-900"
                              : "text-red-600"
                          }`}
                        >
                          $
                          {Math.abs(account.balance).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        {account.balance < 0 && (
                          <p className="text-xs text-red-500">Credit Balance</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

export default withAuth(Dashboard);

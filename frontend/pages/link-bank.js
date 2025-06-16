import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { usePlaidLink } from "react-plaid-link";
import { Card, Button } from "../src/components/ui";
import withAuth from "../src/components/auth/withAuth";

function LinkBank() {
  const { data: session } = useSession();
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Create link token
    createLinkToken();
  }, []);

  const createLinkToken = async () => {
    try {
      const response = await fetch("/api/banking/link-token-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session?.user?.email || "user_" + Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create link token");
      }

      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (err) {
      console.error("Error creating link token:", err);
      setError("Failed to initialize bank connection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = async (public_token, metadata) => {
    try {
      setLoading(true);

      // Exchange public token for access token
      const response = await fetch("/api/banking/set-access-token-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_token,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to exchange token");
      }

      const data = await response.json();

      // Store access token securely (in production, this should be stored server-side)
      localStorage.setItem("plaid_access_token", data.access_token);
      localStorage.setItem("plaid_item_id", data.item_id);

      // Fetch initial account data
      await fetchAccountData(data.access_token);

      setSuccess(true);

      // Redirect to dashboard after successful connection
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      console.error("Error exchanging token:", err);
      setError("Failed to connect bank account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountData = async (accessToken) => {
    try {
      // Fetch accounts
      const accountsResponse = await fetch("/api/banking/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
        }),
      });

      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();

        // Fetch transactions
        const transactionsResponse = await fetch("/api/banking/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        });

        let transactionsData = { transactions: [] };
        if (transactionsResponse.ok) {
          transactionsData = await transactionsResponse.json();
        }

        // Store bank data
        const bankData = {
          accounts: accountsData.accounts || [],
          transactions: transactionsData.transactions || [],
          summary: {
            total_balance:
              accountsData.accounts?.reduce(
                (sum, acc) => sum + acc.balances.current,
                0
              ) || 0,
            last_updated: new Date().toISOString(),
          },
        };

        localStorage.setItem("bankData", JSON.stringify(bankData));
      }
    } catch (err) {
      console.error("Error fetching account data:", err);
    }
  };

  const onExit = (err, metadata) => {
    if (err) {
      console.error("Plaid Link exit error:", err);
      setError("Bank connection was cancelled or failed.");
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up bank connection...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your bank account has been successfully connected.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Link Bank Account - Finance Dashboard</title>
        <meta name="description" content="Connect your bank account securely" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/dashboard" className="flex items-center">
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
              </Link>

              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Connect Your Bank Account
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Securely link your bank account to get real-time insights into
              your finances. Your data is encrypted and protected.
            </p>
          </div>

          {error && (
            <div className="mb-8 max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.898-.833-2.668 0L3.732 16.5c-.77.833-.168 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-600"
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
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bank-Level Security
                  </h3>
                  <p className="text-gray-600">
                    Your data is protected with 256-bit encryption and never
                    stored on our servers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Real-Time Updates
                  </h3>
                  <p className="text-gray-600">
                    Get instant updates on your account balances and
                    transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-purple-600"
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Smart Analytics
                  </h3>
                  <p className="text-gray-600">
                    Automatically categorize spending and track financial goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Connection */}
            <div>
              <Card className="p-8">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Connect?
                  </h2>

                  <p className="text-gray-600 mb-8">
                    Click the button below to securely connect your bank account
                    through Plaid. We support thousands of banks and credit
                    unions.
                  </p>

                  <Button
                    onClick={() => open()}
                    disabled={!ready || loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!ready ? "Loading..." : "Connect Bank Account"}
                  </Button>

                  <p className="text-xs text-gray-500 mt-4">
                    Powered by Plaid • Used by millions of users • Bank-level
                    security
                  </p>
                </div>
              </Card>

              {/* Trust indicators */}
              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-gray-900 mb-4">
                  Trusted by leading financial institutions
                </p>
                <div className="flex justify-center items-center space-x-8 opacity-60">
                  <div className="text-gray-400 font-semibold">CHASE</div>
                  <div className="text-gray-400 font-semibold">WELLS FARGO</div>
                  <div className="text-gray-400 font-semibold">
                    BANK OF AMERICA
                  </div>
                  <div className="text-gray-400 font-semibold">CITI</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default withAuth(LinkBank);

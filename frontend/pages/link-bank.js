import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { usePlaidLink } from "react-plaid-link";
import withAuth from "../src/components/auth/withAuth";

function LinkBank() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [linkToken, setLinkToken] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  // Fetch link token from API
  const fetchLinkToken = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo("Fetching link token...");

      const response = await fetch("/api/banking/link-token-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session?.user?.email || "demo_user",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create link token");
      }

      const data = await response.json();
      setLinkToken(data.link_token);
      setDebugInfo("Link token received!");
      console.log("Link token received:", data.link_token ? "✓" : "✗");
    } catch (err) {
      console.error("Error fetching link token:", err);
      setError(err.message || "Failed to initialize bank connection");
      setDebugInfo("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch link token when component mounts
  useEffect(() => {
    fetchLinkToken();
  }, [session]);

  // Handle Plaid Link success
  const onSuccess = useCallback(
    async (public_token, metadata) => {
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
            accounts: metadata.accounts,
            institution: metadata.institution,
            user_id: session?.user?.email || "demo_user",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to connect bank account"
          );
        }

        const data = await response.json();
        console.log("Bank account connected successfully:", data);

        setSuccess(true);

        // Redirect to dashboard after successful connection
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (err) {
        console.error("Error connecting bank account:", err);
        setError(err.message || "Failed to connect bank account");
      } finally {
        setLoading(false);
      }
    },
    [session, router]
  );

  // Handle Plaid Link events
  const onEvent = useCallback((eventName, metadata) => {
    console.log("Plaid Link event:", eventName, metadata);
  }, []);

  // Handle Plaid Link exit
  const onExit = useCallback((err, metadata) => {
    if (err) {
      console.error("Plaid Link error:", err);
      setError("Bank connection was cancelled or failed");
    }
    console.log("Plaid Link exit:", metadata);
  }, []);

  // Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onEvent,
    onExit,
  });

  // Debug logging
  useEffect(() => {
    console.log("Plaid Link state:", {
      linkToken: linkToken ? "present" : "missing",
      ready,
      canOpen: ready && linkToken,
    });
  }, [linkToken, ready]);

  if (loading && !linkToken) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Setting up bank connection...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full text-center border border-gray-700">
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
          <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
          <p className="text-gray-300 mb-6">
            Your bank account has been successfully connected.
          </p>
          <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Link Bank Account - FinSight</title>
        <meta name="description" content="Connect your bank account securely" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/home" className="flex items-center">
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

              <Link
                href="/home"
                className="text-sm text-gray-400 hover:text-gray-200"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Connect Your Bank Account
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Securely connect your bank account using Plaid to view your real
              financial data and transactions.
            </p>
          </div>

          {error && (
            <div className="mb-8 max-w-md mx-auto">
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
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
                    <p className="text-sm text-red-200">{error}</p>
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
                  <h3 className="text-lg font-semibold text-white">
                    Bank-Grade Security
                  </h3>
                  <p className="text-gray-300">
                    Connect your accounts safely using Plaid's secure, encrypted
                    connection trusted by thousands of apps.
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
                  <h3 className="text-lg font-semibold text-white">
                    Real-Time Data
                  </h3>
                  <p className="text-gray-300">
                    Get up-to-date account balances and transaction history from
                    your connected banks.
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
                  <h3 className="text-lg font-semibold text-white">
                    Smart Analytics
                  </h3>
                  <p className="text-gray-300">
                    Automatically categorize spending and get insights into your
                    financial habits.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Plaid Link */}
            <div>
              <div className="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
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

                  <h2 className="text-2xl font-bold text-white mb-4">
                    Connect Your Bank
                  </h2>

                  <p className="text-gray-300 mb-8">
                    Use Plaid's secure connection to link your bank account and
                    access your real financial data.
                  </p>

                  {loading ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600">
                        {linkToken
                          ? "Connecting to your bank..."
                          : "Preparing secure connection..."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <button
                        onClick={() => {
                          console.log("Button clicked!", {
                            ready,
                            linkToken,
                            open,
                          });
                          if (open) {
                            console.log("Calling open()");
                            open();
                          } else {
                            console.log("Open function not available");
                          }
                        }}
                        disabled={!ready || !linkToken}
                        className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {!linkToken ? "Preparing..." : "Connect Bank Account"}
                      </button>

                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <span>Secured by Plaid</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Security notice */}
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-green-800">
                      Your data is encrypted and secure. We never store your
                      bank credentials.
                    </p>
                  </div>
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

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Card, Chart } from "../src/components/ui";
import Navbar from "../src/components/Navbar";

export default function Home() {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Use the bank data hook for automatic refreshing
  const { refreshBankData } = useBankData();

  // Enhanced scroll animation effect with better options
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15, // Slightly higher threshold for smoother triggering
      rootMargin: "0px 0px -100px 0px", // Trigger animations earlier
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add slight delay for staggered effect
          setTimeout(() => {
            entry.target.classList.remove("opacity-0");
            entry.target.classList.add("animate-fadeInDown");
          }, index * 150); // Stagger animations by 150ms

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Get all elements that should be animated
    const animatedElements = document.querySelectorAll(".scroll-animation");
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, [user, isBankConnected]); // Add dependencies

  // Connect Bank function
  const connectBank = async () => {
    // Check if user is authenticated first
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Create a non-sensitive user identifier for Plaid
      // Plaid doesn't allow emails or other sensitive data as client_user_id
      const generateUserId = (user) => {
        if (user.id) return `user_${user.id}`;
        if (user.email) {
          // Create a simple hash from email without exposing it
          const emailHash =
            user.email.split("@")[0] + "_" + Date.now().toString().slice(-6);
          return `user_${emailHash}`;
        }
        return `demo_user_${Date.now()}`;
      };

      // Get link token from Plaid API
      const response = await fetch("/api/banking/link-token-public", {
        headers: {
          "user-id": generateUserId(user), // Pass non-sensitive user identifier
        },
      });
      const data = await response.json();

      if (!data.link_token) {
        console.error("No link token returned:", data);
        if (data.error === "Plaid credentials not configured") {
          const configStatus = data.current_config;
          const setupMessage =
            "🔧 Plaid Setup Required\n\n" +
            "Current Configuration:\n" +
            `• Client ID configured: ${
              configStatus?.client_id_set ? "✅" : "❌"
            }\n` +
            `• Secret configured: ${configStatus?.secret_set ? "✅" : "❌"}\n` +
            `• Environment: ${configStatus?.environment || "sandbox"}\n\n` +
            "To set up Plaid:\n" +
            "1. Go to: https://dashboard.plaid.com/team/keys\n" +
            "2. Copy your Client ID and Secret\n" +
            "3. Update your .env.local file\n" +
            "4. Restart the development server\n\n" +
            "For now, would you like to continue with demo mode?";

          const useDemoMode = window.confirm(setupMessage);
          if (useDemoMode) {
            return simulatePlaidFlow();
          }
          return;
        }
        return;
      }

      // Load Plaid Link script dynamically
      const script = document.createElement("script");
      script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
      script.onload = () => {
        const handler = window.Plaid.create({
          token: data.link_token,
          onSuccess: async (public_token, metadata) => {
            console.log("Plaid Link successful:", metadata);

            try {
              // Exchange public token for access token
              const exchangeResponse = await fetch(
                "/api/banking/set-access-token-public",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ public_token }),
                }
              );

              const exchangeData = await exchangeResponse.json();
              console.log("Account connected:", exchangeData);

              if (exchangeData.success) {
                // Store access token and update bank connection status
                const token = exchangeData.access_token;
                setBankConnected(true, token);

                // Fetch real bank data
                try {
                  const [accountsResponse, transactionsResponse] =
                    await Promise.all([
                      fetch(`/api/banking/accounts?access_token=${token}`),
                      fetch(`/api/banking/transactions?access_token=${token}`),
                    ]);

                  const accountsData = await accountsResponse.json();
                  const transactionsData = await transactionsResponse.json();

                  // Update bank data in context
                  updateBankData({
                    accounts: accountsData.accounts || [],
                    transactions: transactionsData.transactions || [],
                    summary: {
                      ...accountsData.summary,
                      ...transactionsData.summary,
                      monthlySpending: transactionsData.monthlySpending || [],
                      categoryBreakdown:
                        transactionsData.categoryBreakdown || [],
                    },
                  });

                  console.log("Bank data loaded:", {
                    accountsData,
                    transactionsData,
                  });
                } catch (dataError) {
                  console.error("Error fetching bank data:", dataError);
                  // Still allow connection even if data fetch fails
                }

                alert(
                  `🎉 Bank account connected successfully!\n\n` +
                    `Connected accounts: ${
                      exchangeData.accounts?.length || 0
                    }\n` +
                    `Institution: ${
                      metadata.institution?.name || "Unknown"
                    }\n\n` +
                    `Loading your financial data... You can now access your FinSight Dashboard.`
                );
              } else {
                throw new Error(
                  exchangeData.message || "Failed to connect account"
                );
              }
            } catch (error) {
              console.error("Error exchanging token:", error);
              alert("Failed to complete bank connection. Please try again.");
            }
          },
          onExit: (err, metadata) => {
            if (err) {
              console.error("Plaid Link error:", err);
              alert(
                "Bank connection was cancelled or failed. Please try again."
              );
            }
            console.log("Plaid Link exit:", metadata);
          },
          onEvent: (eventName, metadata) => {
            console.log("Plaid Link event:", eventName, metadata);
          },
        });

        handler.open();
      };

      script.onerror = () => {
        console.error("Failed to load Plaid Link script");
        alert(
          "Failed to load Plaid Link. Please check your internet connection and try again."
        );
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Failed to connect bank account:", error);
      alert(
        "Failed to connect bank account. Please try again later.\n\nError: " +
          error.message
      );
    }
  };

  // Fallback demo simulation for when Plaid is not configured
  const simulatePlaidFlow = async () => {
    const confirmed = window.confirm(
      "Demo Mode: Plaid Simulation\n\n" +
        "This simulates a bank connection since Plaid credentials are not configured.\n\n" +
        "Click OK to simulate connecting your bank account."
    );

    if (!confirmed) {
      console.log("User cancelled bank connection");
      return;
    }

    // Simulate successful bank connection
    setBankConnected(true);
    alert(
      "🎉 Demo bank account connected successfully!\n\nYou can now access your FinSight Dashboard."
    );
  };

  return (
    <>
      <Head>
        <title>FinSight Dashboard</title>
        <meta
          name="description"
          content="Personal finance dashboard with bank account integration"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen w-full bg-gray-900 text-white">
        <Navbar
          user={user}
          onLogin={login}
          onLogout={() => {
            logout();
            // Bank connection state is already cleared in the logout function in AuthContext
          }}
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Show bank connection panel only if user is authenticated but bank not connected */}
          {user && !isBankConnected && (
            <div className="w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 lg:p-8 transform transition-all duration-500 ease-in-out animate-fadeIn">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Keep this icon's hover effect */}
                <div className="bg-blue-500 rounded-full p-4 mb-2 transition-transform duration-300 hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Connect Your Bank Account
                </h2>
                <p className="text-gray-300 max-w-md">
                  Link your accounts securely through Plaid to track your
                  finances and get personalized insights.
                  <br />
                  <span className="text-sm text-blue-300 mt-2 block">
                    Secure bank-grade encryption • Powered by Plaid
                  </span>
                </p>
                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20 active:translate-y-0.5"
                  onClick={connectBank}
                >
                  Connect Bank Account
                </button>
              </div>
            </div>
          )}

          {/* Show welcome message if user is not authenticated */}
          {!user && (
            <div className="w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 lg:p-8 transform transition-all duration-500 ease-in-out animate-fadeIn">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-blue-500 rounded-full p-4 mb-2 transition-transform duration-300 hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome to FinSight
                </h2>
                <p className="text-gray-300 max-w-md">
                  Please sign in to access your personal finance dashboard and
                  connect your bank accounts.
                </p>
                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 active:translate-y-0.5"
                  onClick={() => setShowLoginModal(true)}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* Main Dashboard Content - only show if user is authenticated AND bank is connected */}
          {user && isBankConnected && (
            <div className="w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 lg:p-8 space-y-8 transition-all duration-500 ease-in-out animate-fadeIn">
              <h1 className="text-3xl font-bold text-blue-400 text-center">
                FinSight Dashboard
              </h1>

              <div className="flex flex-wrap gap-6 justify-center w-full">
                <div className="flex-1 flex justify-center min-w-[280px]">
                  <Card
                    title="Total Balance"
                    value={
                      bankData.summary?.totalBalance
                        ? `$${bankData.summary.totalBalance.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`
                        : "$5,000"
                    }
                    icon={
                      <span role="img" aria-label="money">
                        💰
                      </span>
                    }
                  />
                </div>
                <div className="flex-1 flex justify-center min-w-[280px]">
                  <Card
                    title="This Month's Spending"
                    value={
                      bankData.summary?.totalSpending
                        ? `$${bankData.summary.totalSpending.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`
                        : "$1,200"
                    }
                    icon={
                      <span role="img" aria-label="expenses">
                        💸
                      </span>
                    }
                  />
                </div>
                <div className="flex-1 flex justify-center min-w-[280px]">
                  <Card
                    title="Accounts"
                    value={
                      bankData.accounts?.length
                        ? `${bankData.accounts.length} Connected`
                        : "0 Connected"
                    }
                    icon={
                      <span role="img" aria-label="accounts">
                        🏦
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="w-full transform transition-all duration-300 ease-in-out hover:translate-y-[-4px]">
                <Chart />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

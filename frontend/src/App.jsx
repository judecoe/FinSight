import { useEffect } from "react";
import { Card, Chart } from "./components/ui";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Wrap the main content with authentication
const AppContent = () => {
  const { user, login, logout } = useAuth();

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
  }, []);

  // Connect Bank function
  const connectBank = async () => {
    try {
      // For testing without authentication:
      const response = await fetch(
        "http://localhost:8000/api/banking/link-token-public"
      );
      const data = await response.json();

      if (!data.link_token) {
        console.error("No link token returned");
        return;
      }

      // Load Plaid Link script dynamically
      const script = document.createElement("script");
      script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
      script.onload = () => {
        const handler = window.Plaid.create({
          token: data.link_token,
          onSuccess: async (public_token, metadata) => {
            console.log("Success:", public_token, metadata);

            // Send public token to backend
            const exchangeResponse = await fetch(
              "http://localhost:8000/api/banking/set-access-token-public",
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

            alert("Bank account connected successfully!");
          },
          onExit: (err, metadata) => {
            if (err) console.error("Error:", err);
            console.log("Exit:", metadata);
          },
        });

        handler.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Failed to connect bank account:", error);
      alert("Failed to connect bank account. See console for details.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <Navbar user={user} onLogin={login} onLogout={logout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* New Plaid Connection Panel - removed hover shadow effect */}
        <div className="w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 lg:p-8 transform transition-all duration-500 ease-in-out opacity-0 scroll-animation">
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
              Link your accounts securely through Plaid to track your finances
              and get personalized insights.
            </p>
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20 active:translate-y-0.5"
              onClick={connectBank}
            >
              Connect Bank Account
            </button>
          </div>
        </div>

        {/* Main Dashboard Content with top-down fade animation */}
        <div className="w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 lg:p-8 space-y-8 transition-all duration-500 ease-in-out opacity-0 scroll-animation">
          <h1 className="text-3xl font-bold text-blue-400 text-center">
            FinSight Dashboard
          </h1>

          <div className="flex flex-wrap gap-6 justify-center w-full">
            <div className="flex-1 flex justify-center min-w-[280px]">
              <Card
                title="Balance"
                value="$5,000"
                icon={
                  <span role="img" aria-label="money">
                    💰
                  </span>
                }
              />
            </div>
            <div className="flex-1 flex justify-center min-w-[280px]">
              <Card
                title="Expenses"
                value="$1,200"
                icon={
                  <span role="img" aria-label="expenses">
                    💸
                  </span>
                }
              />
            </div>
          </div>

          <div className="w-full transform transition-all duration-300 ease-in-out hover:translate-y-[-4px]">
            <Chart />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

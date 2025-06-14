import { Card, Chart } from "./components/ui";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Wrap the main content with authentication
const AppContent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <Navbar user={user} onLogin={login} onLogout={logout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* New Plaid Connection Panel with animation */}
        <div className="w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 lg:p-8 transform transition-all duration-500 ease-in-out hover:shadow-blue-500/20">
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
            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20 active:translate-y-0.5">
              Connect Bank Account
            </button>
          </div>
        </div>

        {/* Main Dashboard Content with animation */}
        <div className="w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 lg:p-8 space-y-8 transition-all duration-500 ease-in-out">
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

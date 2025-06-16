import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useBankData = () => {
  const { accessToken, updateBankData, isBankConnected } = useAuth();

  const fetchBankData = async () => {
    if (!accessToken || !isBankConnected) return;

    try {
      const [accountsResponse, transactionsResponse] = await Promise.all([
        fetch(`/api/banking/accounts?access_token=${accessToken}`),
        fetch(`/api/banking/transactions?access_token=${accessToken}`),
      ]);

      if (accountsResponse.ok && transactionsResponse.ok) {
        const accountsData = await accountsResponse.json();
        const transactionsData = await transactionsResponse.json();

        updateBankData({
          accounts: accountsData.accounts || [],
          transactions: transactionsData.transactions || [],
          summary: {
            ...accountsData.summary,
            ...transactionsData.summary,
            monthlySpending: transactionsData.monthlySpending || [],
            categoryBreakdown: transactionsData.categoryBreakdown || [],
          },
        });

        console.log("Bank data refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing bank data:", error);
    }
  };

  // Fetch data when component mounts and access token is available
  useEffect(() => {
    if (accessToken && isBankConnected) {
      fetchBankData();
    }
  }, [accessToken, isBankConnected]);

  // Set up periodic refresh (every 5 minutes)
  useEffect(() => {
    if (!accessToken || !isBankConnected) return;

    const interval = setInterval(fetchBankData, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [accessToken, isBankConnected]);

  return {
    refreshBankData: fetchBankData,
  };
};

import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBankConnected, setIsBankConnected] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [bankData, setBankData] = useState({
    accounts: [],
    transactions: [],
    summary: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedBankConnection = localStorage.getItem("bankConnected");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedBankData = localStorage.getItem("bankData");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedBankConnection) {
      setIsBankConnected(JSON.parse(storedBankConnection));
    }

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }

    if (storedBankData) {
      setBankData(JSON.parse(storedBankData));
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsBankConnected(false);
    setAccessToken(null);
    setBankData({ accounts: [], transactions: [], summary: null });
    localStorage.removeItem("user");
    localStorage.removeItem("bankConnected");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("bankData");
  };

  const setBankConnected = (connected, token = null) => {
    setIsBankConnected(connected);
    localStorage.setItem("bankConnected", JSON.stringify(connected));

    if (token) {
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
    }
  };

  const updateBankData = (newData) => {
    setBankData(newData);
    localStorage.setItem("bankData", JSON.stringify(newData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isBankConnected,
        setBankConnected,
        accessToken,
        bankData,
        updateBankData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

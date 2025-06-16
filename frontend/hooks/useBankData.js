import { useState, useEffect } from "react";
import axios from "axios";

const useBankData = () => {
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const response = await axios.get("/api/banking/accounts");
        setBankData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBankData();
  }, []);

  return { bankData, loading, error };
};

export default useBankData;

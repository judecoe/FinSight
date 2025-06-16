import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getChartData } from "../../utils/chartData";

const Chart = () => {
  const { bankData, isBankConnected } = useAuth();

  const { chartData, hasValidRealData } = getChartData(
    bankData,
    isBankConnected
  );

  const dataLabel = hasValidRealData
    ? `Monthly Spending (Real Data - ${chartData.length} months)`
    : "Monthly Spending (Demo)";

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-8 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">{dataLabel}</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #4B5563",
              color: "#E5E7EB",
            }}
            formatter={(value) => [`$${value}`, "Spending"]}
          />
          <Line
            type="monotone"
            dataKey="spending"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4, fill: "#3B82F6" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

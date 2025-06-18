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

const PureChart = ({ type = "line", data, title, height = 350 }) => {
  const renderChart = () => {
    if (type === "line") {
      return (
        <LineChart data={data}>
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
      );
    }

    // Add other chart types as needed
    return null;
  };

  return (
    <div className="w-full h-full">
      {title && (
        <h2 className="text-lg font-semibold mb-4 text-gray-200">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default PureChart;

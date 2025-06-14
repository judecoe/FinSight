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

const data = [
  { name: "Jan", spending: 400 },
  { name: "Feb", spending: 300 },
  { name: "Mar", spending: 500 },
  { name: "Apr", spending: 200 },
  { name: "May", spending: 350 },
  { name: "Jun", spending: 420 },
];

const Chart = () => (
  <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700">
    <h2 className="text-lg font-semibold mb-4 text-gray-200">
      Monthly Spending
    </h2>
    <ResponsiveContainer width="100%" height={250}>
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

export default Chart;

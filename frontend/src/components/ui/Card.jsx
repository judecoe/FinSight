import React from "react";

const Card = ({ title, value, icon }) => (
  <div className="bg-gray-800 rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 ease-in-out min-w-[220px] border border-gray-700 w-full transform hover:-translate-y-1 hover:border-blue-500">
    <div className="flex-shrink-0 text-blue-400 text-3xl">{icon}</div>
    <div>
      <div className="text-gray-400 text-sm font-medium">{title}</div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  </div>
);

export default Card;

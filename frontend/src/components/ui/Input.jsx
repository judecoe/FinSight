import React from "react";

const Input = React.forwardRef(({ label, className, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-gray-300">{label}</label>
    )}
    <input
      ref={ref}
      className={`bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        className || ""
      }`}
      {...props}
    />
  </div>
));

export default Input;

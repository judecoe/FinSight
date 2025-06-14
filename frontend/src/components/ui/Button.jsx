import React from "react";
import clsx from "clsx";

const base =
  "inline-flex items-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const Button = ({ variant = "primary", className, children, ...props }) => (
  <button className={clsx(base, variants[variant], className)} {...props}>
    {children}
  </button>
);

export default Button;

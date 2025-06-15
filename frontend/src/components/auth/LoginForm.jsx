import React from "react";
import { useForm } from "react-hook-form";

const LoginForm = ({ onSubmit }) => {
  const { handleSubmit } = useForm();

  const handleLogin = () => {
    onSubmit({
      email: "user@example.com",
      name: "Apple User",
    });
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
      <h2 className="text-center text-xl font-bold text-white mb-6">Sign In</h2>

      <div className="flex justify-center">
        <button
          type="submit"
          className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transform transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-700/30 active:translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            stroke="white"
            strokeWidth="1"
            className="mr-2"
          >
            <path d="M16.5 3c-2.076 0-3.751 1.192-4.5 3.046C11.251 4.192 9.576 3 7.5 3 4.462 3 2 5.462 2 8.5c0 .585.09 1.152.265 1.691C2.83 12.56 6.303 19 12 19c5.698 0 9.17-6.44 9.736-8.809.174-.539.264-1.106.264-1.691C22 5.462 19.538 3 16.5 3z" />
          </svg>
          Sign in with Apple
        </button>
      </div>
    </form>
  );
};

export default LoginForm;

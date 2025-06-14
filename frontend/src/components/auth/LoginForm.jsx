import React from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "../ui";

const LoginForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    // This would typically call an API in a real application
    onSubmit({
      email: data.email,
      // In a real app, you would NOT include the password in the user object
      // This is just for demo purposes
    });
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
      <h2 className="text-center text-xl font-bold text-white mb-6">Sign In</h2>

      <div>
        <Input
          label="Email"
          type="email"
          placeholder="user@example.com"
          className="w-full"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          className="w-full"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;

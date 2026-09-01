import axios from "axios";
import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import FormField from "../components/FormField";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { type ApiError } from "../types/api";
import { loginSchema, type LoginInput } from "../validation/auth.validation";

export default function Login(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const [error, setError] = useState("");

  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (data: LoginInput) => {
    try {
      const { accessToken, user } = await authService.login(data);

      setAuth(accessToken, user);
      setError("");
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiError>(error)) {
        setError(error?.response?.data?.message || "Login failed");
        return;
      }

      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-[12vh] p-6 border rounded-lg border-gray-300">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {error && (
          <div className="p-3 text-sm text-center text-red-700 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <FormField
          label="Username or Email"
          type="text"
          registration={register("usernameOrEmail")}
          error={errors.usernameOrEmail?.message}
        />

        <FormField
          label="Password"
          type="password"
          registration={register("password")}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link to="/signup" className="border-b">
          Sign up
        </Link>
      </p>
    </div>
  );
}

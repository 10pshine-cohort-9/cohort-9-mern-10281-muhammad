import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../validation/auth.validation";
import { useState, type ReactElement } from "react";
import { useAuthStore } from "../store/auth.store";
import { authService } from "../services/auth.service";
import axios from "axios";

export default function LoginForm(): ReactElement {
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
      setError("");
      const { accessToken, user } = await authService.login(data);
      setAuth(accessToken, user);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data?.message || "Login failed");
      }
      setError("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error && (
        <div className="p-3 text-sm text-center text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="usernameOrEmail"
          className="text-xs font-medium text-gray-700"
        >
          Username or Email
        </label>

        <input
          id="usernameOrEmail"
          type="text"
          className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition
            ${
              errors.usernameOrEmail
                ? "border-red-400 focus:ring-red-200 focus:ring-2"
                : "border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black"
            }`}
          {...register("usernameOrEmail")}
        />

        {errors.usernameOrEmail && (
          <p className="text-xs text-red-500">
            {errors.usernameOrEmail.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-xs font-medium text-gray-700">
          Password
        </label>

        <input
          id="password"
          type="password"
          className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition
            ${
              errors.password
                ? "border-red-400 focus:ring-red-200 focus:ring-2"
                : "border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black"
            }`}
          {...register("password")}
        />

        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

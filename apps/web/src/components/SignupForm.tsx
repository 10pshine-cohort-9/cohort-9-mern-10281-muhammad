import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "../validation/auth.validation";
import { useState, type ReactElement } from "react";
import { useAuthStore } from "../store/auth.store";
import { authService } from "../services/auth.service";

export default function SignupForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (data: SignupInput) => {
    try {
      const { confirmPassword, ...payload } = data;
      const { accessToken, user } = await authService.signup(payload);
      setAuth(accessToken, user);
      setError("");
    } catch (error: any) {
      setError(error?.response?.data?.message || "Signup failed");
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
        <label htmlFor="username" className="text-xs font-medium text-gray-700">
          Username
        </label>

        <input
          id="username"
          type="Username"
          className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition
            ${
              errors.username
                ? "border-red-400 focus:ring-red-200 focus:ring-2"
                : "border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black"
            }`}
          {...register("username")}
        />

        {errors.username && (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-xs font-medium text-gray-700">
          Email address
        </label>

        <input
          id="email"
          type="email"
          className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition
            ${
              errors.email
                ? "border-red-400 focus:ring-red-200 focus:ring-2"
                : "border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black"
            }`}
          {...register("email")}
        />

        {errors.email && (
          <p className="text-xs text-red-500">
            {errors.email.message}
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

      <div className="space-y-1">
        <label htmlFor="password" className="text-xs font-medium text-gray-700">
          Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition
            ${
              errors.confirmPassword
                ? "border-red-400 focus:ring-red-200 focus:ring-2"
                : "border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black"
            }`}
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}

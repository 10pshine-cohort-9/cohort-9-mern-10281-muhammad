import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../validation/login.schema";
import type { ReactElement } from "react";

export default function LoginForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      console.log("Login data:", data);

      await new Promise((res) => setTimeout(res, 1000));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label
          htmlFor="usernameOrEmail"
          className="block mb-1 text-xs font-medium cursor-pointer"
        >
          Username or Email Address
        </label>

        <input
          id="usernameOrEmail"
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          {...register("usernameOrEmail")}
        />

        {errors.usernameOrEmail && (
          <p className="text-red-500 text-sm mt-1">
            {errors.usernameOrEmail.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block mb-1 text-xs cursor-pointer font-medium"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          className="w-full border border-gray-300 p-2 rounded"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white p-2 rounded disabled:bg-black-80 hover:bg-black/90"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

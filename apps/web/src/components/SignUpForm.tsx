import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpSchema } from "../validation/signup.schema";
import type { ReactElement } from "react";

export default function SignUpForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpSchema) => {
    try {
      console.log("Signup data:", data);

      await new Promise((res) => setTimeout(res, 1000));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block mb-1 text-xs font-medium cursor-pointer"
        >
          Username
        </label>

        <input
          id="username"
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          {...register("username")}
        />

        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block mb-1 text-xs font-medium cursor-pointer"
        >
          Email address
        </label>

        <input
          id="email"
          type="email"
          className="w-full border border-gray-300 p-2 rounded"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block mb-1 text-xs font-medium cursor-pointer"
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

      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="block mb-1 text-xs font-medium cursor-pointer"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          type="password"
          className="w-full border border-gray-300 p-2 rounded"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white p-2 rounded disabled:bg-black-80 hover:bg-black/90"
      >
        {isSubmitting ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}

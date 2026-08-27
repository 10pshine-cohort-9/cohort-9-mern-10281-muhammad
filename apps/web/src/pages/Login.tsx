import type { ReactElement } from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

export default function Login(): ReactElement {
  return (
    <div className="max-w-md mx-auto mt-[12vh] p-6 border rounded-lg border-gray-300">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <LoginForm />

      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link to="/signup" className="border-b">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

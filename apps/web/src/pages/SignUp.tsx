import type { ReactElement } from "react";
import SignUpForm from "../components/SignUpForm";
import { Link } from "react-router-dom";

export default function SignUp(): ReactElement {
  return (
    <div className="max-w-md mx-auto mt-[12vh] p-6 border rounded-lg border-gray-300">
      <h1 className="text-xl font-semibold mb-4">Sign Up</h1>

      <SignUpForm />

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="border-b">
          Login
        </Link>
      </p>
    </div>
  );
}

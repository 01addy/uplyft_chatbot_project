// src/pages/RegisterPage.jsx

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("/auth/register", data);
      toast.success("Registered successfully! Please login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input {...register("username")} placeholder="Username" className="w-full mb-3 p-2 border" required />
        <input type="password" {...register("password")} placeholder="Password" className="w-full mb-3 p-2 border" required />
        <button type="submit" className="bg-green-600 text-white py-2 w-full rounded">Register
            <div className="mt-4 text-sm text-center">
                Already have an account?{" "}
                <Link to="/" className="text-blue-600 hover:underline">
                    Login here
                </Link>
            </div>

        </button>
      </form>
    </div>
  );
}

export default RegisterPage;

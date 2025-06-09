// src/pages/LoginPage.jsx:

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios, { setAuthToken } from "../api/axios";
import { toast } from "react-toastify";

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/auth/login", data);
      login(res.data.token);
      setAuthToken(res.data.token);
      toast.success("Logged in successfully!");
      navigate("/chat");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input {...register("username")} placeholder="Username" className="w-full mb-3 p-2 border" required />
        <input type="password" {...register("password")} placeholder="Password" className="w-full mb-3 p-2 border" required />
        <button type="submit" className="bg-blue-600 text-white py-2 w-full rounded">Login
            <div className="mt-4 text-sm text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-white-600 hover:underline">
                    Register here
                </Link>
            </div>
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

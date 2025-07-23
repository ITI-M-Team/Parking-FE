import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../apis/config";
import { AlertCircle, Loader } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSuccessOk = () => {
    setShowSuccessMessage(false);
    if (loginData?.role === "driver") {
      navigate("/dashboard/driver");
    } else if (loginData?.role === "garage_owner") {
      navigate("/dashboard/owner");
    } else {
      navigate("/home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowErrorMessage(false);

    try {
      const response = await instance.post("/auth/login/", formData);
      const data = response.data;
      setLoginData(data);
      localStorage.setItem("authTokens", JSON.stringify(data));
      setShowSuccessMessage(true);
    } catch (error) {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

      {showErrorMessage && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
          <AlertCircle className="w-5 h-5" />
          <p>Email or password is incorrect.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm">
            Forgot your password?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => navigate("/password-reset")}
            >
              Reset it
            </button>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="animate-spin w-4 h-4" /> Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessMessage && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <p className="mb-3">Login successful!</p>
          <button
            onClick={handleSuccessOk}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;

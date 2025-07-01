import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterUser() {
  const navigate = useNavigate();
  const [role, setRole] = useState("driver");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    national_id: "",
    driver_license: null,
    car_license: null,
    national_id_img: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });
    payload.append("role", role);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        body: payload,
      });

      if (res.ok) {
        alert("Registered successfully");
        navigate("/login");
      } else {
        const data = await res.json();
        console.log(data);
        alert("Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }
  };

  const FileInput = ({ label, name }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="w-full border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm bg-white">
        <input
          type="file"
          name={name}
          onChange={handleChange}
          className="w-full text-gray-600"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center">
      {/* Left Image Section */}
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <img
          src="../../public/register.svg"
          alt="signup"
          className="max-w-[80%] h-auto"
        />
      </div>

      {/* Right Form Section */}
    <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8 m-4 max-h-[90vh] overflow-y-auto">
    <h2 className="text-2xl font-bold mb-2">Sign up</h2>
    <p className="text-gray-600 mb-4">Choose your role and fill the form</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="driver"
                checked={role === "driver"}
                onChange={handleRoleChange}
              />
              Driver
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="garage_owner"
                checked={role === "garage_owner"}
                onChange={handleRoleChange}
              />
              Garage Owner
            </label>
          </div>

          {/* Inputs */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border border-gray-300 p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full border border-gray-300 p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="national_id"
            placeholder="National ID"
            className="w-full border border-gray-300 p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 p-2 rounded"
            onChange={handleChange}
            required
          />

          {/* Conditional File Inputs for Drivers */}
          {role === "driver" && (
            <div className="space-y-3">
              <FileInput label="Driver License" name="driver_license" />
              <FileInput label="Car License" name="car_license" />
              <FileInput label="National ID Image" name="national_id_img" />
            </div>
          )}

          {/* Submit Button */}
          <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
            Register
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;

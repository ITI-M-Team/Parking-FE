
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InputField = ({ name, type = "text", placeholder, value, onChange, error }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-2 rounded"
      required
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const FileInput = ({ label, name, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="w-full border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm bg-white">
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="w-full text-gray-600"
      />
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
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

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully");
        navigate("/login");
      } else {
        setErrors(data);
        const messages = Object.values(data).flat().join("\n");
        // alert("Registration failed:\n" + messages);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center">
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <img
          src="../../public/register.svg"
          alt="signup"
          className="max-w-[80%] h-auto"
        />
      </div>

      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8 m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">Sign up</h2>
        <p className="text-gray-600 mb-4">Choose your role and fill the form</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <InputField
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />
          <InputField
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <InputField
            name="national_id"
            placeholder="National ID"
            value={formData.national_id}
            onChange={handleChange}
            error={errors.national_id}
          />
          <InputField
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <InputField
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          {role === "driver" && (
            <div className="space-y-3">
              <FileInput label="Driver License" name="driver_license" onChange={handleChange} error={errors.driver_license} />
              <FileInput label="Car License" name="car_license" onChange={handleChange} error={errors.car_license} />
              <FileInput label="National ID Image" name="national_id_img" onChange={handleChange} error={errors.national_id_img} />
            </div>
          )}

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

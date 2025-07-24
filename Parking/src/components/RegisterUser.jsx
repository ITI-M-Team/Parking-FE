import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";


const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const GarageIcon = ( ) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 22v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path><path d="M12 18H7.5"></path><path d="M12 18h4.5"></path><path d="M2 8l10-6 10 6v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"></path></svg>;

const InputGroup = ({ label, name, type = "text", value, error, onChange } ) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
      {label}
    </label>
    <input
      id={name} name={name} type={type} value={value} onChange={onChange} required
      className="block w-full px-3 py-2  dark:bg-black border border-gray-300 dark:border-slate-600 rounded-md shadow-sm 
                 placeholder-gray-400 dark:placeholder-slate-500 
                 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                 sm:text-sm 
                 text-gray-900 dark:text-gray-100" 
    />
    {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
  </div>
);

const FileInputGroup = ({ label, name, error, fileName, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
      {label}
    </label>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div className="flex text-sm text-gray-500 dark:text-slate-400">
          <label htmlFor={name} className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900 focus-within:ring-indigo-500">
            <span>Upload a file</span>
            <input id={name} name={name} type="file" className="sr-only" onChange={onChange} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        {fileName ? (
          <p className="text-sm text-green-500 font-semibold">{fileName}</p>
        ) : (
          <p className="text-xs text-gray-500 dark:text-slate-500">PNG, JPG, PDF up to 10MB</p>
        )}
      </div>
    </div>
    {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
  </div>
);



const RegisterUser = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      setIsLoading(false);
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
      } );
      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully! Please check your email to activate your account.");
        navigate("/login");
      } else {
        setErrors(data);
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex h-screen">
        {/* --- القسم الأيسر: الصورة --- */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-12 bg-white dark:bg-slate-800">
          <img src="/register.svg" alt="Create an Account" className="max-w-lg h-auto" />
        </div>

        {/* --- القسم الأيمن: الفورم --- */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4">
          <div className="absolute top-6 right-6">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          <div className="w-full max-w-md h-full max-h-[90vh] flex flex-col">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-3xl font-bold">Create Account</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Let's get you started!
              </p>
            </div>

            <div className="flex-grow overflow-y-auto pr-3 -mr-3">
              <form className="space-y-6" id="register-form" onSubmit={handleSubmit}>
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${role === 'driver' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-300 dark:border-slate-700 hover:border-slate-500'}`}>
                    <input type="radio" name="role" value="driver" checked={role === 'driver'} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                    <UserIcon />
                    <span className="mt-2 font-semibold">Driver</span>
                  </label>
                  <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${role === 'garage_owner' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-300 dark:border-slate-700 hover:border-slate-500'}`}>
                    <input type="radio" name="role" value="garage_owner" checked={role === 'garage_owner'} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                    <GarageIcon />
                    <span className="mt-2 font-semibold">Garage Owner</span>
                  </label>
                </div>

                <InputGroup label="Username" name="username" value={formData.username} error={errors.username} onChange={handleChange} />
                <InputGroup label="Email" name="email" type="email" value={formData.email} error={errors.email} onChange={handleChange} />
                <InputGroup label="Phone Number" name="phone" value={formData.phone} error={errors.phone} onChange={handleChange} />
                <InputGroup label="National ID" name="national_id" value={formData.national_id} error={errors.national_id} onChange={handleChange} />
                <InputGroup label="Password" name="password" type="password" value={formData.password} error={errors.password} onChange={handleChange} />
                <InputGroup label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} error={errors.confirmPassword} onChange={handleChange} />

                {role === "driver" && (
                  <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <FileInputGroup label="Driver License" name="driver_license" error={errors.driver_license} fileName={formData.driver_license?.name} onChange={handleChange} />
                    <FileInputGroup label="Car License" name="car_license" error={errors.car_license} fileName={formData.car_license?.name} onChange={handleChange} />
                    <FileInputGroup label="National ID Image" name="national_id_img" error={errors.national_id_img} fileName={formData.national_id_img?.name} onChange={handleChange} />
                  </div>
                )}
              </form>
            </div>

            <div className="mt-6">
              {errors.general && <p className="text-sm text-red-500 dark:text-red-400 text-center mb-4">{errors.general}</p>}
              <button
                type="submit" form="register-form" disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Registering..." : "Create Account"}
              </button>
              <p className="mt-4 text-center text-sm text-gray-600 dark:text-slate-400">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;

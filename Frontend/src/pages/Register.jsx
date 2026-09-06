import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import backgroundImage from "../assets/RTC-1 PIC.webp";
import { register } from "../services/authService";

const SPECIALIZATION_OPTIONS = [
  "R-Smart",
  "R-Smart-Pro",
  "Intellect",
  "Intellect Engineering",
  "Arts / Others",
];

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "Student", // "Student" or "Staff"
    name: "",
    register_number: "",
    college_email: "",
    specialization: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailClean = formData.college_email.trim().toLowerCase();

    // Student email rule: MUST end with @rathinam.in
    if (formData.role === "Student" && !emailClean.endsWith("@rathinam.in")) {
      setError("Student email must end with @rathinam.in");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        register_number: formData.register_number.trim(),
        college_email: emailClean,
        password: formData.password,
        specialization: formData.specialization || null,
        role: formData.role,
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError(
          "Cannot connect to the backend server. Please make sure the FastAPI server is running on port 8000."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative py-12"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Register Section */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div
          className="
          w-full
          max-w-xl
          rounded-3xl
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          shadow-2xl
          p-8
          sm:p-10
        "
        >
          {/* Logo / Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white">
              TeamMate Finder
            </h1>
            <p className="text-gray-200 mt-2">
              Create your account to connect and collaborate.
            </p>
          </div>

          {/* Role Toggle: Student vs Staff */}
          <div className="mb-6">
            <label className="text-white text-sm font-medium mb-2 block">
              I am registering as:
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-black/30 border border-white/20">
              <button
                type="button"
                onClick={() => handleRoleSelect("Student")}
                className={`py-2.5 rounded-xl font-semibold text-sm transition ${
                  formData.role === "Student"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                🎓 Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("Staff")}
                className={`py-2.5 rounded-xl font-semibold text-sm transition ${
                  formData.role === "Staff"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                💼 Staff / Faculty
              </button>
            </div>

            <p className="text-xs text-gray-300 mt-2">
              {formData.role === "Student"
                ? "Students must use their official @rathinam.in email address."
                : "Staff and faculty members can register with any email address (e.g. Gmail, Yahoo, etc.)."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-100 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-500/20 border border-green-400 text-green-100 rounded-lg p-3 mb-5 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-white text-sm font-medium mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="
                  w-full
                  rounded-xl
                  bg-white/15
                  border
                  border-white/20
                  px-4
                  py-3
                  text-white
                  placeholder-gray-300
                  outline-none
                  focus:ring-2
                  focus:ring-blue-400
                  transition
                "
                required
              />
            </div>

            {/* Grid for Register Number / Staff ID & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">
                  {formData.role === "Student"
                    ? "Register Number"
                    : "Staff ID / Employee ID"}
                </label>
                <input
                  type="text"
                  name="register_number"
                  placeholder={
                    formData.role === "Student"
                      ? "e.g. 21BCS101"
                      : "e.g. RTCSTAFF01"
                  }
                  value={formData.register_number}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    bg-white/15
                    border
                    border-white/20
                    px-4
                    py-3
                    text-white
                    placeholder-gray-300
                    outline-none
                    focus:ring-2
                    focus:ring-blue-400
                    transition
                  "
                  required
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">
                  {formData.role === "Student"
                    ? "College Email (@rathinam.in)"
                    : "Email Address (Any)"}
                </label>
                <input
                  type="email"
                  name="college_email"
                  placeholder={
                    formData.role === "Student"
                      ? "name@rathinam.in"
                      : "name@gmail.com"
                  }
                  value={formData.college_email}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    bg-white/15
                    border
                    border-white/20
                    px-4
                    py-3
                    text-white
                    placeholder-gray-300
                    outline-none
                    focus:ring-2
                    focus:ring-blue-400
                    transition
                  "
                  required
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label className="text-white text-sm font-medium mb-1.5 block">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="
                  w-full
                  rounded-xl
                  bg-slate-900/90
                  border
                  border-white/20
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-400
                  transition
                "
              >
                <option value="" className="bg-slate-900 text-gray-300">
                  Select your specialization (Optional)
                </option>
                {SPECIALIZATION_OPTIONS.map((spec) => (
                  <option
                    key={spec}
                    value={spec}
                    className="bg-slate-900 text-white"
                  >
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid for Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      bg-white/15
                      border
                      border-white/20
                      pl-4
                      pr-12
                      py-3
                      text-white
                      placeholder-gray-300
                      outline-none
                      focus:ring-2
                      focus:ring-blue-400
                      transition
                    "
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white p-1 focus:outline-none transition"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      bg-white/15
                      border
                      border-white/20
                      pl-4
                      pr-12
                      py-3
                      text-white
                      placeholder-gray-300
                      outline-none
                      focus:ring-2
                      focus:ring-blue-400
                      transition
                    "
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white p-1 focus:outline-none transition"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                mt-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                transition
                text-white
                font-semibold
                py-3
                shadow-lg
                disabled:opacity-60
              "
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-7 text-center">
            <p className="text-gray-200">
              Already have an account?
            </p>
            <Link
              to="/"
              className="
                inline-block
                mt-2
                text-blue-300
                hover:text-blue-200
                font-semibold
                transition
              "
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
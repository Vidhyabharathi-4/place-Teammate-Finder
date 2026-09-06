import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import backgroundImage from "../assets/RTC-1 PIC.webp";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessionExpired, setSessionExpired] = useState(
    searchParams.get("expired") === "1"
  );
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setSessionExpired(false);
    setLoading(true);
    setError("");

    try {
      const data = await login(email.trim(), password);

      await loginUser(data.access_token);

      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        setError(
          "Cannot connect to the backend server. Please make sure the FastAPI server is running on port 8000."
        );
      } else {
        setError(
          err.response?.data?.detail ||
          "Login failed. Please check your email and password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Section */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">

        <div
          className="
          w-full
          max-w-md
          rounded-3xl
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          shadow-2xl
          p-8
        "
        >
          {/* Logo / Title */}
          <div className="text-center mb-8">

            <h1 className="text-4xl font-extrabold text-white">
              TeamMate Finder
            </h1>

            <p className="text-gray-200 mt-2">
              Find the perfect teammates for your next hackathon.
            </p>

          </div>

          {/* Session Expired Notice */}
          {sessionExpired && (
            <div className="bg-amber-500/20 border border-amber-400 text-amber-100 rounded-xl p-3 mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>Your previous session has expired. Please sign in again.</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-100 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Email Address (Student or Staff)
              </label>

              <input
                type="email"
                placeholder="name@rathinam.in or your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (sessionExpired) setSessionExpired(false);
                }}
                className="
                  w-full
                  rounded-xl
                  bg-white/15
                  border
                  border-white/20
                  px-4
                  py-3
                  text-white
                  placeholder-white/50
                  outline-none
                  focus:ring-2
                  focus:ring-blue-400
                  transition
                "
                required
              />
              <p className="text-xs text-gray-300 mt-1.5">
                Students: @rathinam.in &bull; Staff: Any email acceptable
              </p>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (sessionExpired) setSessionExpired(false);
                  }}
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
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
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
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-7 text-center">

            <p className="text-gray-200">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="
                inline-block
                mt-2
                text-blue-300
                hover:text-blue-200
                font-semibold
                transition
              "
            >
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
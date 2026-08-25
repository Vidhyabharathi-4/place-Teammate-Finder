import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/RTC-1 PIC.webp";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);

      localStorage.setItem("access_token", data.access_token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Login failed."
      );
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

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-100 rounded-lg p-3 mb-5">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                College Email
              </label>

              <input
                type="email"
                placeholder="Enter your college email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <label className="text-white text-sm font-medium mb-2 block">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
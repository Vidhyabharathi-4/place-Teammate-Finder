import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import { changePassword } from "../services/authService";

function ChangePassword() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    if (form.new_password.length < 8) {
      alert("Password should contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword(form);

      alert(response.message);

      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

    } catch (err) {
      alert(
        err.response?.data?.detail ||
        "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordField = (
    label,
    name,
    value,
    show,
    toggle
  ) => (
    <div>
      <label className="mb-2 block font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 pr-12 text-slate-800 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
        >
          {show ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl p-8">

      <div className="rounded-3xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">

        <div className="rounded-t-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-white/20 p-4">

              <ShieldCheck size={34} />

            </div>

            <div>

              <h1 className="text-3xl font-bold">
                Change Password
              </h1>

              <p className="mt-2 text-blue-100">
                Keep your account secure by using a strong password.
              </p>

            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8"
        >

          {passwordField(
            "Current Password",
            "current_password",
            form.current_password,
            showCurrent,
            () => setShowCurrent(!showCurrent)
          )}

          {passwordField(
            "New Password",
            "new_password",
            form.new_password,
            showNew,
            () => setShowNew(!showNew)
          )}

          {passwordField(
            "Confirm Password",
            "confirm_password",
            form.confirm_password,
            showConfirm,
            () => setShowConfirm(!showConfirm)
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >

            <Lock size={20} />

            {loading
              ? "Updating..."
              : "Update Password"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default ChangePassword;
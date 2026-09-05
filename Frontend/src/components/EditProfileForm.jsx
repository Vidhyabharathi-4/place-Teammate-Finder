import { useState } from "react";

const SPECIALIZATION_OPTIONS = [
  "R-Smart",
  "R-Smart-Pro",
  "Intellect",
  "Intellect Engineering",
  "Arts / Others",
];

function EditProfileForm({ profile, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    department: profile?.department || "",
    year: profile?.year || "",
    specialization: profile?.specialization || "",
    about_me: profile?.about_me || "",
    skills: profile?.skills || "",
    github_url: profile?.github_url || "",
    linkedin_url: profile?.linkedin_url || "",
    portfolio_url: profile?.portfolio_url || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const cleanedData = {
        name: formData.name.trim(),
        department: formData.department.trim(),
        year: formData.year ? Number(formData.year) : null,
        specialization: formData.specialization.trim(),
        about_me: formData.about_me.trim(),
        skills: formData.skills.trim(),
        github_url: formData.github_url.trim(),
        linkedin_url: formData.linkedin_url.trim(),
        portfolio_url: formData.portfolio_url.trim(),
      };

      // Convert empty URL fields to null
      if (!cleanedData.github_url) {
        cleanedData.github_url = null;
      }

      if (!cleanedData.linkedin_url) {
        cleanedData.linkedin_url = null;
      }

      if (!cleanedData.portfolio_url) {
        cleanedData.portfolio_url = null;
      }

      // Convert empty optional text fields to null
      if (!cleanedData.department) {
        cleanedData.department = null;
      }

      if (!cleanedData.specialization) {
        cleanedData.specialization = null;
      }

      if (!cleanedData.about_me) {
        cleanedData.about_me = null;
      }

      if (!cleanedData.skills) {
        cleanedData.skills = null;
      }

      await onSave(cleanedData);

    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Name */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
          placeholder="Enter your name"
        />
      </div>

      {/* Department */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          Department
        </label>

        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
          placeholder="B.Sc CS with AI & DS"
        />
      </div>

      {/* Year */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          Year
        </label>

        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          min="1"
          max="6"
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
          placeholder="3"
        />
      </div>

      {/* Specialization */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          Specialization
        </label>

        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
        >
          <option value="" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">Select Specialization (Optional)</option>
          {SPECIALIZATION_OPTIONS.map((spec) => (
            <option key={spec} value={spec} className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">
              {spec}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-slate-400">
          Choose your official Rathinam specialization track.
        </p>
      </div>

      {/* About Me */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          About Me
        </label>

        <textarea
          name="about_me"
          value={formData.about_me}
          onChange={handleChange}
          rows={6}
          className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
          placeholder="Tell others about yourself, your interests, technical skills and the kind of teammates you're looking for."
        />

        <p className="mt-2 text-sm text-slate-400">
          Introduce yourself to other students.
        </p>
      </div>

      {/* Skills */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          Skills
        </label>

        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
          placeholder="Python, React, FastAPI, SQL"
        />

        <p className="mt-2 text-sm text-slate-400">
          Separate multiple skills using commas.
        </p>
      </div>

      {/* GitHub */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          GitHub URL
        </label>

        <input
          type="url"
          name="github_url"
          value={formData.github_url}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
          placeholder="https://github.com/username"
        />

        <p className="mt-2 text-sm text-slate-400">
          Optional
        </p>
      </div>

      {/* LinkedIn */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          LinkedIn URL
        </label>

        <input
          type="url"
          name="linkedin_url"
          value={formData.linkedin_url}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
          placeholder="https://linkedin.com/in/username"
        />

        <p className="mt-2 text-sm text-slate-400">
          Optional
        </p>
      </div>

      {/* Portfolio */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
          Portfolio URL
        </label>

        <input
          type="url"
          name="portfolio_url"
          value={formData.portfolio_url}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-800"
          placeholder="https://yourportfolio.com"
        />

        <p className="mt-2 text-sm text-slate-400">
          Optional
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 border-t border-slate-200 pt-6 dark:border-slate-700">

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl bg-slate-500 px-7 py-3 font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

      </div>

    </form>
  );
}

export default EditProfileForm;
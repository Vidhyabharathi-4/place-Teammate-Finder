import { useState } from "react";

function EditProfileForm({
  profile,
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: profile.name || "",
    department: profile.department || "",
    year: profile.year || "",
    about_me: profile.about_me || "",
    skills: profile.skills || "",
    github_url: profile.github_url || "",
    linkedin_url: profile.linkedin_url || "",
    portfolio_url: profile.portfolio_url || "",
  });

  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      // Convert empty URL fields to null
      const cleanedData = {
        ...formData,
      };

      ["github_url", "linkedin_url", "portfolio_url"].forEach((field) => {
        const value = cleanedData[field]?.trim();

        cleanedData[field] =
          !value || value.toLowerCase() === "nil"
            ? null
            : value;
      });

      await onSave(cleanedData);

    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="block font-semibold mb-2">
          Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Department
        </label>

        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="B.Sc CS with AI & DS"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Year
        </label>

        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          About Me
        </label>

        <textarea
          name="about_me"
          value={formData.about_me}
          onChange={handleChange}
          rows={5}
          className="w-full border rounded-lg p-3"
          placeholder="Tell others about yourself..."
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Skills
        </label>

        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="Python, React, FastAPI"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          GitHub URL
        </label>

        <input
          type="text"
          name="github_url"
          value={formData.github_url || ""}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="https://github.com/username (Optional)"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          LinkedIn URL
        </label>

        <input
          type="text"
          name="linkedin_url"
          value={formData.linkedin_url || ""}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="https://linkedin.com/in/username (Optional)"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Portfolio URL
        </label>

        <input
          type="text"
          name="portfolio_url"
          value={formData.portfolio_url || ""}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="https://yourportfolio.com (Optional)"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;
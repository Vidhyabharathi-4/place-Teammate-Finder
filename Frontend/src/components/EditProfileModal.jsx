import { useState } from "react";
import {
  X,
  User,
  GraduationCap,
  Code,
  Globe,
  Check,
  Save,
  Award,
} from "lucide-react";

const SPECIALIZATION_OPTIONS = [
  "R-Smart",
  "R-Smart-Pro",
  "Intellect",
  "Intellect Engineering",
  "Arts / Others",
];

function EditProfileModal({ profile, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("general"); // 'general', 'academic', 'skills', 'links'
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    department: profile?.department || "",
    year: profile?.year || "",
    specialization: profile?.specialization || "R-Smart",
    about_me: profile?.about_me || "",
    skills: profile?.skills || "",
    github_url: profile?.github_url || "",
    linkedin_url: profile?.linkedin_url || "",
    portfolio_url: profile?.portfolio_url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const cleanedData = {
        name: formData.name.trim(),
        department: formData.department.trim() || null,
        year: formData.year ? Number(formData.year) : null,
        specialization: formData.specialization?.trim() || null,
        about_me: formData.about_me?.trim() || null,
        skills: formData.skills?.trim() || null,
        github_url: formData.github_url?.trim() || null,
        linkedin_url: formData.linkedin_url?.trim() || null,
        portfolio_url: formData.portfolio_url?.trim() || null,
      };

      await onSave(cleanedData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const skillTags = formData.skills
    ? formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              Edit Candidate Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Update your public portfolio and technical qualifications
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 sm:px-8 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "general"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <User size={16} />
            <span>General</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("academic")}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "academic"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <GraduationCap size={16} />
            <span>Academic & Track</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("skills")}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "skills"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Code size={16} />
            <span>Skills</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("links")}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "links"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Globe size={16} />
            <span>Portfolios</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5">
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Professional Bio / About Me
                </label>
                <textarea
                  name="about_me"
                  rows={5}
                  value={formData.about_me}
                  onChange={handleChange}
                  placeholder="Introduce yourself, your tech interests, team goals, and experience..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. Computer Science & Eng."
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Academic Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Specialization Track
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:border-blue-500 focus:outline-hidden"
                >
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, Python, Docker, Tailwind CSS, Machine Learning"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              {skillTags.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">
                    Live Skill Chips Preview:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "links" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  placeholder="https://github.com/username"
                  value={formData.github_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Portfolio / Personal Website
                </label>
                <input
                  type="url"
                  name="portfolio_url"
                  placeholder="https://myportfolio.dev"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Sticky Modal Action Footer */}
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs sm:text-sm shadow-md transition"
            >
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;

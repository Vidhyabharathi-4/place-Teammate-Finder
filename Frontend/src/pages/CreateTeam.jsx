import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import teamService from "../services/teamService";

function CreateTeam() {
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [maxMembers, setMaxMembers] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await teamService.createTeam({
        team_name: teamName,
        description,
        required_skills: requiredSkills,
        max_members: Number(maxMembers),
      });

      navigate("/my-teams");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Failed to create team."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-4 sm:my-8 bg-white dark:bg-slate-800 shadow-lg rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-4 sm:mb-6"
      >
        <ArrowLeft size={18} />
        Back to Teams
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        Create New Team
      </h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 p-4 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Team Name
          </label>

          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Description
          </label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Required Skills
          </label>

          <input
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            placeholder="Example: React, FastAPI, SQL"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Maximum Members
          </label>

          <input
            type="number"
            min="2"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Creating Team..." : "Create Team"}
        </button>

      </form>

    </div>
  );
}

export default CreateTeam;
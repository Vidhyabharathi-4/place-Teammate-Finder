import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      alert("Team created successfully.");

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
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">

      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Create New Team
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-semibold mb-2">
            Team Name
          </label>

          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Description
          </label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Required Skills
          </label>

          <input
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            placeholder="Example: React, FastAPI, SQL"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Maximum Members
          </label>

          <input
            type="number"
            min="2"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating Team..." : "Create Team"}
        </button>

      </form>

    </div>
  );
}

export default CreateTeam;
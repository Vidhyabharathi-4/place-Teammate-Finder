import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  Code,
  Calendar,
  User,
  Send,
} from "lucide-react";

import teamService from "../services/teamService";
import applicationService from "../services/applicationService";

function TeamDetails() {
  const { id } = useParams();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await teamService.getTeamById(id);
      setTeam(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load team details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setError("");
    setSuccess("");

    try {
      await applicationService.applyToTeam(id, message);

      setSuccess("Application submitted successfully.");
      setMessage("");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to submit application.");
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl font-semibold">
        Loading Team...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Team not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-8 shadow-lg">

        <h1 className="text-4xl font-bold">
          {team.team_name}
        </h1>

        <p className="mt-4 text-blue-100">
          {team.description}
        </p>

      </div>

      {/* Alerts */}

      {error && (
        <div className="mt-6 rounded-xl bg-red-100 text-red-700 p-4">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-xl bg-green-100 text-green-700 p-4">
          {success}
        </div>
      )}

      {/* Team Information */}

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow border p-6">

          <h2 className="text-2xl font-bold mb-5">
            Team Information
          </h2>

          <div className="space-y-5">

            <div className="flex gap-3">
              <Code className="text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold">
                  Required Skills
                </h3>
                <p className="text-gray-600">
                  {team.required_skills || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Users className="text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">
                  Maximum Members
                </h3>
                <p className="text-gray-600">
                  {team.max_members}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <User className="text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold">
                  Team Owner
                </h3>
                <p className="text-gray-600">
                  {team.owner_id}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar className="text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold">
                  Created On
                </h3>
                <p className="text-gray-600">
                  {new Date(team.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Application Card */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <h2 className="text-2xl font-bold mb-5">
            Apply to Join
          </h2>

          <label className="font-medium">
            Why do you want to join this team?
          </label>

          <textarea
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your application..."
            className="w-full mt-3 rounded-xl border p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={handleApply}
            disabled={applying}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
          >
            <Send size={18} />

            {applying ? "Submitting..." : "Apply Now"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default TeamDetails;
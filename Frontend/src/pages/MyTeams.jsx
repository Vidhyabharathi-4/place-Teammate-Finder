import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

import teamService from "../services/teamService";

function MyTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const fetchMyTeams = async () => {
    try {
      const data = await teamService.getMyTeams();
      setTeams(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Failed to load your teams."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-slate-700 dark:text-slate-200">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-4 sm:mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 dark:text-white">
          My Teams
        </h1>
        <Link
          to="/teams/create"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-md self-start sm:self-auto"
        >
          <Plus size={18} />
          Create Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-300">
            You haven't created any teams yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {teams.map((team) => (

            <div
              key={team.id}
              className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {team.team_name}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {team.status || "Open"}
                  </span>
                </div>

                {team.category && (
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                    {team.category}
                  </p>
                )}

                <p className="mt-3 text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-white">Description:</strong><br />
                  {team.description}
                </p>

                <p className="mt-3 text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-white">Required Skills:</strong><br />
                  {team.required_skills}
                </p>

                <p className="mt-3 text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-white">Team Members:</strong>{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {team.current_members || 1} / {team.max_members}
                  </span>{" "}
                  ({team.members_needed !== undefined ? team.members_needed : Math.max(0, team.max_members - (team.current_members || 1))} spots open)
                </p>
              </div>

              <div className="flex gap-3 mt-6">

                <Link
                  to={`/teams/${team.id}/members`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  View Members
                </Link>

                <Link
                  to={`/applications/${team.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Applications
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default MyTeams;
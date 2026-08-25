import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import teamService from "../services/teamService";

function MyTeams() {
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
      <div className="p-8 text-center text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        My Teams
      </h1>

      {teams.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">
            You haven't created any teams yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {teams.map((team) => (

            <div
              key={team.id}
              className="bg-white shadow-lg rounded-xl p-6"
            >

              <h2 className="text-2xl font-bold text-blue-600">
                {team.team_name}
              </h2>

              <p className="mt-3">
                <strong>Description:</strong><br />
                {team.description}
              </p>

              <p className="mt-3">
                <strong>Required Skills:</strong><br />
                {team.required_skills}
              </p>

              <p className="mt-3">
                <strong>Maximum Members:</strong>{" "}
                {team.max_members}
              </p>

              <div className="flex gap-3 mt-6">

                <Link
                  to={`/teams/${team.id}/members`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Members
                </Link>

                <Link
                  to={`/applications/${team.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
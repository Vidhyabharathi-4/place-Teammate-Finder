import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import teamService from "../../services/teamService";

function RecentTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTeams = async () => {
      try {
        const allTeams = await teamService.getAllTeams();
        // Take the top 3 most recent teams
        setTeams(allTeams.slice(0, 3));
      } catch (err) {
        console.error("Failed to load recent teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTeams();
  }, []);

  return (
    <Card className="shadow-sm">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Recent Teams
        </h2>

        <Link
          to="/teams"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
          Loading teams...
        </div>
      ) : teams.length === 0 ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
          <p>No teams created yet.</p>
          <Link
            to="/teams/create"
            className="mt-3 inline-block font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create the first team &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-blue-300 dark:hover:border-slate-600 transition block"
            >
              <div>

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  {team.team_name}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 line-clamp-1">
                  {team.required_skills || team.category || "General Collaboration"}
                </p>

              </div>

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium shrink-0 ml-4">

                <Users size={18} className="text-blue-600 dark:text-blue-400" />

                <span>
                  {team.current_members || 1} / {team.max_members}
                </span>

              </div>
            </Link>
          ))}
        </div>
      )}

    </Card>
  );
}

export default RecentTeams;
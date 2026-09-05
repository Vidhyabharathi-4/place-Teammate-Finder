import { Link } from "react-router-dom";
import { Users, Code, ArrowRight } from "lucide-react";

function TeamCard({ team }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between">

      {/* Team Name & Info */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {team.team_name}
          </h2>
          {team.category && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shrink-0">
              {team.category}
            </span>
          )}
        </div>

        {team.owner_name && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Led by <span className="font-medium text-slate-600 dark:text-slate-300">{team.owner_name}</span>
            {team.owner_department ? ` (${team.owner_department})` : ""}
          </p>
        )}

        <p className="text-gray-500 dark:text-slate-400 mt-3 line-clamp-3 text-sm leading-relaxed">
          {team.description}
        </p>

        {/* Skills */}
        <div className="flex items-start gap-2 mt-5">
          <Code size={18} className="text-blue-600 dark:text-blue-400 mt-1 shrink-0" />

          <div>
            <p className="font-semibold text-gray-700 dark:text-slate-300 text-sm">
              Required Skills
            </p>

            <p className="text-gray-600 dark:text-slate-400 text-sm mt-0.5 line-clamp-2">
              {team.required_skills || "Not specified"}
            </p>
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 mt-4">
          <Users size={18} className="text-green-600 dark:text-green-400 shrink-0" />

          <span className="text-gray-700 dark:text-slate-300 text-sm">
            Members:
            <span className="font-semibold">
              {" "}
              {team.current_members !== undefined && team.current_members !== null
                ? `${team.current_members} / ${team.max_members} (${team.members_needed ?? Math.max(0, team.max_members - team.current_members)} needed)`
                : `${team.max_members} max`}
            </span>
          </span>
        </div>
      </div>

      {/* Button */}
      <Link
        to={`/teams/${team.id}`}
        className="mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-sm"
      >
        View Details
        <ArrowRight size={18} />
      </Link>

    </div>
  );
}

export default TeamCard;
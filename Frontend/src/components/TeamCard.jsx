import { Link } from "react-router-dom";
import { Users, Code, ArrowRight } from "lucide-react";

function TeamCard({ team }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between">

      {/* Team Name */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {team.team_name}
        </h2>

        <p className="text-gray-500 mt-3 line-clamp-3">
          {team.description}
        </p>

        {/* Skills */}
        <div className="flex items-start gap-2 mt-5">
          <Code size={18} className="text-blue-600 mt-1" />

          <div>
            <p className="font-semibold text-gray-700">
              Required Skills
            </p>

            <p className="text-gray-600">
              {team.required_skills || "Not specified"}
            </p>
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 mt-4">
          <Users size={18} className="text-green-600" />

          <span className="text-gray-700">
            Members Needed:
            <span className="font-semibold">
              {" "}
              {team.members_needed}
            </span>
          </span>
        </div>
      </div>

      {/* Button */}
      <Link
        to={`/teams/${team.id}`}
        className="mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
      >
        View Details
        <ArrowRight size={18} />
      </Link>

    </div>
  );
}

export default TeamCard;
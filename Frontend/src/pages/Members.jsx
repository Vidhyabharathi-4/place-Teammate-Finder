import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, Mail, GraduationCap, Code, Calendar } from "lucide-react";

import teamService from "../services/teamService";

function Members() {
  const { teamId } = useParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const fetchMembers = async () => {
    try {
      const data = await teamService.getTeamMembers(teamId);
      setMembers(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Failed to load members."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-lg">
        Loading Team Members...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        Team Members
      </h1>

      <p className="text-gray-500 mb-8">
        Meet the members of your team.
      </p>

      {members.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          No members have joined this team yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {members.map((member) => (

            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition"
            >

              <div className="flex items-center gap-4">

                {member.profile_picture ? (
                  <img
                    src={member.profile_picture}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold">
                    {member.name}
                  </h2>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                      member.role === "Owner"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {member.role === "Owner"
                      ? "👑 Team Owner"
                      : "🟢 Member"}
                  </span>
                </div>

              </div>

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  <span>{member.college_email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-600" />
                  <span>
                    {member.department || "Not Added"}
                    {member.year && ` • Year ${member.year}`}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Code size={18} className="text-blue-600 mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {member.skills ? (
                      member.skills.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                        >
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">
                        No skills added
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  <span>
                    Joined on{" "}
                    {new Date(member.joined_at).toLocaleDateString()}
                  </span>
                </div>

              </div>

            </div>

          ))}

        </div>
      )}
    </div>
  );
}

export default Members;
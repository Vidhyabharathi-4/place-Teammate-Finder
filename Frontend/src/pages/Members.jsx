import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mail,
  GraduationCap,
  Code,
  Calendar,
  Award,
  ArrowLeft,
  MessageSquare,
  User,
} from "lucide-react";

import teamService from "../services/teamService";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUrl";

function Members() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { user: currentUser } = useAuth();

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
      <div className="text-center p-8 text-lg text-slate-700 dark:text-slate-300">
        Loading Team Members...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-4 sm:mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        Team Members
      </h1>

      <p className="text-gray-500 dark:text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
        Meet the members of your team.
      </p>

      {members.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-700 dark:text-slate-300">
          No members have joined this team yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => {
            const isSelf = currentUser && member.user_id === currentUser.id;

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate(`/profile/${member.user_id}`)}
                      className="cursor-pointer group relative shrink-0"
                    >
                      {member.profile_picture ? (
                        <img
                          src={getImageUrl(member.profile_picture)}
                          alt={member.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-600 group-hover:border-blue-500 transition"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold group-hover:shadow-md transition">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => navigate(`/profile/${member.user_id}`)}
                        className="text-lg font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition truncate text-left block w-full"
                      >
                        {member.name}
                      </button>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            member.role === "Owner"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          }`}
                        >
                          {member.role === "Owner" ? "👑 Owner" : "🟢 Member"}
                        </span>

                        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          #RTC-{String(member.user_id).padStart(4, "0")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="break-all">{member.college_email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <GraduationCap size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>
                        {member.department || "Department Not Added"}
                        {member.year && ` • Year ${member.year}`}
                      </span>
                    </div>

                    {member.specialization && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Award size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
                          {member.specialization}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <Code size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills ? (
                          member.skills.split(",").map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-md text-xs"
                            >
                              {skill.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">
                            No skills added
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs pt-1">
                      <Calendar size={14} className="shrink-0" />
                      <span>
                        Joined on{" "}
                        {new Date(member.joined_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Member Card Actions */}
                {!isSelf && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/chat?user=${member.user_id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs"
                    >
                      <MessageSquare size={15} />
                      <span>Message</span>
                    </button>
                    <button
                      onClick={() => navigate(`/profile/${member.user_id}`)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                      title="View Profile"
                    >
                      <User size={15} />
                      <span>Profile</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Members;
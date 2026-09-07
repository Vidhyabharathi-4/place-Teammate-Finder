import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Code,
  Calendar,
  User,
  Send,
  ArrowLeft,
  MessageSquare,
  ClipboardList,
} from "lucide-react";

import teamService from "../services/teamService";
import applicationService from "../services/applicationService";
import { useAuth } from "../context/AuthContext";

function TeamDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, [id]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const [teamData, membersData] = await Promise.all([
        teamService.getTeamById(id),
        teamService.getTeamMembers(id).catch(() => []),
      ]);
      setTeam(teamData);
      setMembers(membersData || []);
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
      <div className="flex justify-center items-center h-96 text-xl font-semibold text-slate-700 dark:text-slate-200">
        Loading Team...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex justify-center items-center h-96 text-xl text-slate-700 dark:text-slate-200">
        Team not found.
      </div>
    );
  }

  const isOwner = Boolean(user && user.id === team.owner_id);
  const isMember = Boolean(
    isOwner || (user && members.some((m) => m.user_id === user.id))
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-4 sm:mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-5 sm:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-4xl font-bold">
            {team.team_name}
          </h1>

          <div className="flex items-center gap-2">
            {team.category && (
              <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-sm font-medium">
                {team.category}
              </span>
            )}
            <span className="bg-green-500/80 px-3.5 py-1 rounded-full text-sm font-semibold">
              {team.status || "Open"}
            </span>
          </div>
        </div>

        <p className="mt-4 text-blue-100 max-w-2xl leading-relaxed">
          {team.description}
        </p>
      </div>

      {/* Team Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mt-6">
        <button
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow-xs"
        >
          Overview
        </button>

        <button
          onClick={() => navigate(`/teams/${team.id}/members`)}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
        >
          <Users size={15} />
          <span>Members ({members.length})</span>
        </button>

        {isOwner && (
          <button
            onClick={() => navigate(`/applications/${team.id}`)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
          >
            <ClipboardList size={15} />
            <span>Applications</span>
          </button>
        )}

        {isMember && (
          <button
            onClick={() => navigate(`/chat?team=${team.id}`)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center gap-1.5 shadow-2xs"
          >
            <MessageSquare size={15} />
            <span>Team Chat</span>
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="mt-6 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-4 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 p-4 border border-green-200 dark:border-green-800">
          {success}
        </div>
      )}

      {/* Team Information & Action Card */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-2xl font-bold mb-5 text-slate-800 dark:text-white">
            Team Information
          </h2>

          <div className="space-y-5">
            <div className="flex gap-3">
              <Code className="text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Required Skills
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {team.required_skills || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Users className="text-green-600 dark:text-green-400 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Team Capacity
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {team.current_members || 1} / {team.max_members} members (
                  {team.members_needed !== undefined
                    ? team.members_needed
                    : Math.max(0, team.max_members - (team.current_members || 1))}{" "}
                  needed)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <User className="text-purple-600 dark:text-purple-400 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Team Owner
                </h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {team.owner_name || `User #${team.owner_id}`}
                </p>
                {team.owner_department && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {team.owner_department}{" "}
                    {team.owner_specialization ? `• ${team.owner_specialization}` : ""}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar className="text-orange-600 dark:text-orange-400 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Created On
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {new Date(team.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Column: Owner Card / Member Card / Apply Card */}
        {isOwner ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-center items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300 flex items-center justify-center mb-4 text-2xl font-bold">
              👑
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">
              You own this team
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
              Manage incoming join requests, track teammates, and communicate in your team group chat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={() => navigate(`/chat?team=${team.id}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <MessageSquare size={16} />
                <span>Open Team Chat</span>
              </button>
              <button
                onClick={() => navigate(`/applications/${team.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                Applications
              </button>
            </div>
          </div>
        ) : isMember ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-center items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center justify-center mb-4 text-2xl font-bold">
              🟢
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">
              You are a Team Member
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
              You are collaborating with this team. Join the team chat to discuss tasks, plan meetings, and share progress.
            </p>
            <button
              onClick={() => navigate(`/chat?team=${team.id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <MessageSquare size={17} />
              <span>Open Team Group Chat</span>
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-5 text-slate-800 dark:text-white">
              Apply to Join
            </h2>

            <label className="block font-medium text-slate-700 dark:text-slate-200 text-sm">
              Why do you want to join this team?
            </label>

            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the team leader about your experience, skills, and why you'd like to collaborate..."
              className="w-full mt-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />

            <button
              onClick={handleApply}
              disabled={applying || !message.trim()}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-slate-600 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition shadow-sm text-sm sm:text-base cursor-pointer disabled:cursor-not-allowed"
            >
              <Send size={18} />
              <span>{applying ? "Submitting Application..." : "Submit Application"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamDetails;
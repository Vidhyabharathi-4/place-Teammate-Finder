import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  GraduationCap,
  Award,
  Code,
  Globe,
  ExternalLink,
  Users,
  FolderKanban,
  FileText,
  Mail,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

import profileService from "../services/profileService";
import teamService from "../services/teamService";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user: currentUser } = useAuth();

  const targetUserId = id || searchParams.get("user");
  const isSelfSpecified = !targetUserId || targetUserId === "me" || (currentUser && String(targetUserId) === String(currentUser.id));

  const [profile, setProfile] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'skills', 'teams', 'social'
  const [copiedField, setCopiedField] = useState(null);

  const isOtherUser = Boolean(
    profile && currentUser && profile.id !== currentUser.id
  );

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSelfSpecified) {
        const data = await profileService.getUserProfile(targetUserId);
        setProfile(data);
      } else {
        const data = await profileService.getProfile();
        setProfile(data);
        // Also fetch user's created/joined teams for the Teams tab
        const myTeams = await teamService.getMyTeams().catch(() => []);
        setUserTeams(myTeams || []);
      }
    } catch (err) {
      console.error("Profile load error:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again to view your profile.");
      } else {
        setError(
          err.response?.data?.detail ||
            "Could not load candidate profile. Please make sure the student exists."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [isSelfSpecified, targetUserId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (formData) => {
    try {
      await profileService.updateProfile(formData);
      await loadProfile();
      alert("Candidate profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update profile.");
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-base sm:text-lg font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading Candidate Profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-lg mt-20 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center text-2xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Candidate Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
          {error || "We couldn't retrieve the specified candidate profile."}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={loadProfile}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const skillsList = profile?.skills
    ? profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const candidateId = `RTC-${String(profile?.id || 1).padStart(4, "0")}`;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* Hero Header */}
      <ProfileHeader
        profile={profile}
        onEdit={() => setEditing(true)}
        onProfileUpdated={setProfile}
        isOtherUser={isOtherUser}
      />

      {/* Key Metric SaaS Bar */}
      <ProfileStats profile={profile} />

      {/* Modern SaaS Navigation Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2 sm:gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <UserRound size={17} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "skills"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Code size={17} />
          <span>Skills & Expertise ({skillsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("teams")}
          className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "teams"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Users size={17} />
          <span>Teams & Activity</span>
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "social"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Globe size={17} />
          <span>Portfolios & Links</span>
        </button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Bio & Track */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* About Me Card */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    About Candidate
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Professional summary and project goals
                  </p>
                </div>
              </div>

              {profile.about_me ? (
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {profile.about_me}
                </p>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                    No personal bio added yet.
                  </p>
                  {!isOtherUser && (
                    <button
                      onClick={() => setEditing(true)}
                      className="mt-3 text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Sparkles size={14} />
                      <span>Add bio to boost profile score</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Specialization Track Spotlight */}
            <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/50 bg-linear-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Rathinam Specialization Track
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Curriculum specialization & technical alignment
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white shadow-2xs">
                  {profile.specialization || "General Track"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Candidates in the{" "}
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {profile.specialization || "selected"}
                </strong>{" "}
                track collaborate on high-impact projects, hackathons, and placement initiatives tailored for industry readiness.
              </p>
            </div>
          </div>

          {/* Right Column: Institutional & Credentials Card */}
          <div className="space-y-6 sm:space-y-8">
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                Institutional Details
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Candidate ID</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-bold text-slate-800 dark:text-white">
                      {candidateId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(candidateId, "candidateId")}
                      className="text-slate-400 hover:text-blue-600 transition"
                      title="Copy ID"
                    >
                      {copiedField === "candidateId" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Register Number</span>
                  <p className="font-mono font-bold text-slate-800 dark:text-white mt-1">
                    {profile.register_number || "Not specified"}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Department</span>
                  <p className="font-semibold text-slate-800 dark:text-white mt-1">
                    {profile.department || "Department Not Added"}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Academic Year</span>
                  <p className="font-semibold text-slate-800 dark:text-white mt-1">
                    {profile.year ? `Year ${profile.year}` : "Not Added"}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Official Email</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium break-all">
                      {profile.college_email}
                    </span>
                    <button
                      onClick={() => copyToClipboard(profile.college_email, "email")}
                      className="text-slate-400 hover:text-blue-600 transition ml-2 shrink-0"
                      title="Copy Email"
                    >
                      {copiedField === "email" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Skills & Expertise */}
      {activeTab === "skills" && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Code size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Technical Skills & Competencies
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Programming languages, frameworks, and developer tools
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {skillsList.length} Verified Skills
            </span>
          </div>

          {skillsList.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {skillsList.map((skill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:border-blue-500 transition shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <Code size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No skills listed yet.</p>
              {!isOtherUser && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                >
                  Add your primary skills now
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Teams & Activity */}
      {activeTab === "teams" && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderKanban size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Team Affiliations & Projects
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Teams created and joined on Rathinam TeamMate Finder
              </p>
            </div>
          </div>

          {!isOtherUser && userTeams.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {userTeams.map((team) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                        {team.team_name}
                      </h4>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {team.role || "Member"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {team.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span>{team.current_members || 1} members</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Team <ChevronRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <Users size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">
                {profile.teams_created || 0} teams created • {profile.teams_joined || 0} teams joined
              </p>
              <button
                onClick={() => navigate("/teams")}
                className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Browse Student Teams
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Portfolios & Social */}
      {activeTab === "social" && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Professional Online Presence
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                External portfolios, code repositories, and social handles
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* GitHub Card */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">GitHub</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 truncate">
                  {profile.github_url || "Not linked"}
                </p>
              </div>
              {profile.github_url ? (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Visit GitHub Profile</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="mt-4 text-xs text-slate-400 italic">No link provided</span>
              )}
            </div>

            {/* LinkedIn Card */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">LinkedIn</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 truncate">
                  {profile.linkedin_url || "Not linked"}
                </p>
              </div>
              {profile.linkedin_url ? (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Visit LinkedIn Profile</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="mt-4 text-xs text-slate-400 italic">No link provided</span>
              )}
            </div>

            {/* Portfolio Card */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portfolio</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 truncate">
                  {profile.portfolio_url || "Not linked"}
                </p>
              </div>
              {profile.portfolio_url ? (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Visit Website</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="mt-4 text-xs text-slate-400 italic">No link provided</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editing && (
        <EditProfileModal
          profile={profile}
          onSave={handleSave}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
};

export default Profile;
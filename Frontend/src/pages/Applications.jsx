import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft, Inbox, Send, Check, X, User, MessageSquare, ExternalLink } from "lucide-react";
import applicationService from "../services/applicationService";

function Applications() {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [activeTab, setActiveTab] = useState("received"); // "received" or "sent"
  const [receivedApps, setReceivedApps] = useState([]);
  const [sentApps, setSentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAllApplications();
  }, [teamId]);

  const fetchAllApplications = async () => {
    try {
      setLoading(true);

      if (teamId) {
        // Specific team view
        const data = await applicationService.getTeamApplications(teamId);
        setReceivedApps(data || []);
        setActiveTab("received");
      } else {
        // Overview of both received and sent
        const [received, sent] = await Promise.all([
          applicationService.getReceivedApplications().catch(() => []),
          applicationService.getMyApplications().catch(() => []),
        ]);

        setReceivedApps(received || []);
        setSentApps(sent || []);

        // Default to received if any exist, else sent
        if ((received || []).length > 0) {
          setActiveTab("received");
        } else if ((sent || []).length > 0) {
          setActiveTab("sent");
        }
      }
    } catch (err) {
      console.error("Applications Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      await applicationService.updateApplicationStatus(applicationId, status);
      await fetchAllApplications();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update application.");
    } finally {
      setUpdatingId(null);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800";
      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-slate-700 dark:text-slate-200 font-medium">
        Loading applications...
      </div>
    );
  }

  const currentList = activeTab === "received" ? receivedApps : sentApps;

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 dark:text-white">
            {teamId ? "Team Applications" : "Applications & Requests"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
            {teamId
              ? "Manage candidate applications for your team."
              : "Review incoming join requests and track submitted applications."}
          </p>
        </div>

        {/* Tab Toggle for Overview */}
        {!teamId && (
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 self-start sm:self-auto border border-slate-300/60 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("received")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === "received"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Inbox size={16} />
              <span>Received Requests</span>
              {receivedApps.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  {receivedApps.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("sent")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === "sent"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Send size={15} />
              <span>Sent by Me</span>
              {sentApps.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                  {sentApps.length}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Applications List */}
      {currentList.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center">
          <Clock className="mx-auto mb-4 text-slate-400 dark:text-slate-500 opacity-60" size={48} />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {activeTab === "received" ? "No Received Applications" : "No Sent Applications"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-md mx-auto">
            {activeTab === "received"
              ? "When other students apply to join your teams, their requests and qualifications will appear here for you to accept or decline."
              : "You haven't applied to any teams yet. Explore available teams and find your next project collaboration!"}
          </p>
          {activeTab === "sent" && (
            <button
              onClick={() => navigate("/teams")}
              className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20"
            >
              Browse Teams
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {currentList.map((application) => {
            const isReceived = activeTab === "received" || !!teamId;

            return (
              <div
                key={application.id}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sm:p-7 transition hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {isReceived ? (
                        <button
                          onClick={() => navigate(`/profile/${application.applicant_id}`)}
                          className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition inline-flex items-center gap-2 text-left group"
                        >
                          <span>{application.applicant_name || `Applicant #${application.applicant_id}`}</span>
                          <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                        </button>
                      ) : (
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                          {application.team_name || `Team #${application.team_id}`}
                        </h2>
                      )}

                      {isReceived && (
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          #RTC-{String(application.applicant_id).padStart(4, "0")}
                        </span>
                      )}

                      {application.team_name && isReceived && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          Team: {application.team_name}
                        </span>
                      )}
                    </div>

                    {isReceived ? (
                      <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        {application.applicant_email && (
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {application.applicant_email}
                          </p>
                        )}
                        {(application.applicant_department || application.applicant_specialization) && (
                          <p>
                            {application.applicant_department || "Department Not Added"}
                            {application.applicant_year && ` • Year ${application.applicant_year}`}
                            {application.applicant_specialization && ` • ${application.applicant_specialization}`}
                          </p>
                        )}
                        {application.applicant_skills && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <strong className="text-slate-700 dark:text-slate-300">Skills:</strong>{" "}
                            {application.applicant_skills}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                          Received on {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Applied on {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    )}

                    {/* Message Box */}
                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Application Message
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                        {application.message || "No message provided."}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="self-start">
                    <span
                      className={`px-3.5 py-1.5 rounded-full font-bold text-xs shrink-0 inline-block shadow-2xs ${badgeColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>

                {/* Candidate Action Buttons for Received Applications */}
                {isReceived && (
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigate(`/profile/${application.applicant_id}`)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                      >
                        <User size={14} />
                        <span>View Full Profile</span>
                      </button>

                      <button
                        onClick={() => navigate(`/chat?user=${application.applicant_id}`)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition"
                      >
                        <MessageSquare size={14} />
                        <span>Direct Message</span>
                      </button>
                    </div>

                    {application.status === "Pending" && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => updateStatus(application.id, "Accepted")}
                          disabled={updatingId === application.id}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-2 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
                        >
                          <Check size={15} />
                          <span>{updatingId === application.id ? "Processing..." : "Accept Member"}</span>
                        </button>

                        <button
                          onClick={() => updateStatus(application.id, "Rejected")}
                          disabled={updatingId === application.id}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
                        >
                          <X size={15} />
                          <span>{updatingId === application.id ? "Processing..." : "Decline"}</span>
                        </button>
                      </div>
                    )}
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

export default Applications;
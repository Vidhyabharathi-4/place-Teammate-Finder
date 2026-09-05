import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import applicationService from "../services/applicationService";

function Applications() {
  const { teamId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [teamId]);

  const fetchApplications = async () => {
    try {
      console.log("Team ID:", teamId);

      let data;

      if (teamId) {
        data = await applicationService.getTeamApplications(teamId);
      } else {
        data = await applicationService.getMyApplications();
      }

      console.log("Applications API Response:", data);

      setApplications(data);
    } catch (err) {
      console.error("Applications Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await applicationService.updateApplicationStatus(
        applicationId,
        status
      );

      alert(`Application ${status} successfully!`);

      fetchApplications();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail ||
          "Failed to update application."
      );
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";

      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";

      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-slate-700 dark:text-slate-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2 text-slate-800 dark:text-white">
        {teamId ? "Team Applications" : "My Applications"}
      </h1>

      <p className="text-slate-500 dark:text-slate-400 mb-8">
        {teamId
          ? "Applications received for your team."
          : "Track your submitted applications."}
      </p>

      {applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Clock
            className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
            size={50}
          />

          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
            No Applications Yet
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {teamId
                      ? (application.applicant_name || `Applicant #${application.applicant_id}`)
                      : (application.team_name || `Team #${application.team_id}`)}
                  </h2>

                  {teamId ? (
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
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          <strong>Skills:</strong> {application.applicant_skills}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Applied on {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  )}

                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Application Message
                    </p>
                    <p className="text-slate-700 dark:text-slate-200 text-sm">
                      {application.message || "No message provided."}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full font-semibold text-xs shrink-0 ${badgeColor(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>

              {teamId && application.status === "Pending" && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() =>
                      updateStatus(
                        application.id,
                        "Accepted"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        application.id,
                        "Rejected"
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;
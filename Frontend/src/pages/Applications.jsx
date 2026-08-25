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
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">
        {teamId ? "Team Applications" : "My Applications"}
      </h1>

      <p className="text-gray-500 mb-8">
        {teamId
          ? "Applications received for your team."
          : "Track your submitted applications."}
      </p>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow border p-12 text-center">
          <Clock
            className="mx-auto mb-4 text-gray-400"
            size={50}
          />

          <h2 className="text-2xl font-semibold">
            No Applications Yet
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-2xl shadow border p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">
                    Team #{application.team_id}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    <strong>Applicant ID:</strong>{" "}
                    {application.applicant_id}
                  </p>

                  <p className="mt-2 text-gray-600">
                    <strong>Message:</strong>
                  </p>

                  <p className="text-gray-700">
                    {application.message}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full font-medium ${badgeColor(
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
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
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
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
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
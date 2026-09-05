import { useEffect, useState } from "react";
import {
  Users,
  FolderKanban,
  ClipboardList,
  UserCheck,
} from "lucide-react";

import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "../components/dashboard/StatCard";
import RecentTeams from "../components/dashboard/RecentTeams";
import NotificationPanel from "../components/dashboard/NotificationPanel";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import QuickActions from "../components/dashboard/QuickActions";
import dashboardService from "../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState({
    total_teams: 0,
    teams_created: 0,
    teams_joined: 0,
    pending_applications: 0,
    accepted_applications: 0,
    profile_completion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">

      <WelcomeBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

        <StatCard
          title="Available Teams"
          value={loading ? "..." : stats.total_teams}
          icon={Users}
          color="bg-blue-600"
        />

        <StatCard
          title="My Teams Created"
          value={loading ? "..." : stats.teams_created}
          icon={FolderKanban}
          color="bg-purple-600"
        />

        <StatCard
          title="Teams Joined"
          value={loading ? "..." : stats.teams_joined}
          icon={UserCheck}
          color="bg-green-600"
        />

        <StatCard
          title="Pending Applications"
          value={loading ? "..." : stats.pending_applications}
          icon={ClipboardList}
          color="bg-orange-500"
        />

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <RecentTeams />
        </div>

        <NotificationPanel />

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <UpcomingEvents />

        <QuickActions />

      </div>

    </div>
  );
}

export default Dashboard;
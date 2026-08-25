import {
  Users,
  FolderKanban,
  ClipboardList,
  Trophy,
} from "lucide-react";

import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "../components/dashboard/StatCard";
import RecentTeams from "../components/dashboard/RecentTeams";
import NotificationPanel from "../components/dashboard/NotificationPanel";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
  return (
    <div className="space-y-8">

      <WelcomeBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Teams"
          value="12"
          icon={Users}
          color="bg-blue-600"
        />

        <StatCard
          title="Applications"
          value="7"
          icon={ClipboardList}
          color="bg-green-600"
        />

        <StatCard
          title="Projects"
          value="4"
          icon={FolderKanban}
          color="bg-purple-600"
        />

        <StatCard
          title="Achievements"
          value="3"
          icon={Trophy}
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
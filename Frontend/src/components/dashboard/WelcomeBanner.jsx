import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function WelcomeBanner() {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(" ")[0] : "Student";

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-10 shadow-lg">

      <p className="text-base sm:text-lg">
        Welcome Back, {userName} 👋
      </p>

      <h1 className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">
        TeamMate Finder
      </h1>

      <p className="mt-4 text-blue-100 max-w-xl">
        Find teammates, build amazing projects,
        participate in hackathons and collaborate
        with students across your college.
      </p>

      <Link to="/teams/create">

        <Button className="mt-8 bg-white text-blue-700 hover:bg-slate-100">

          <Plus />

          Create Team

        </Button>

      </Link>

    </div>
  );
}

export default WelcomeBanner;
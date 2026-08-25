import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

const teams = [
  {
    id: 1,
    name: "AI Research Team",
    members: 4,
    tech: "Python • TensorFlow",
  },
  {
    id: 2,
    name: "Web Development",
    members: 5,
    tech: "React • FastAPI",
  },
  {
    id: 3,
    name: "Data Analytics",
    members: 3,
    tech: "Python • Power BI",
  },
];

function RecentTeams() {
  return (
    <Card className="shadow-sm">

      <h2 className="text-xl font-bold mb-6">
        Recent Teams
      </h2>

      <div className="space-y-4">

        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between border rounded-xl p-4 hover:bg-slate-50 transition"
          >
            <div>

              <h3 className="font-semibold">
                {team.name}
              </h3>

              <p className="text-slate-500 text-sm">
                {team.tech}
              </p>

            </div>

            <div className="flex items-center gap-2 text-slate-500">

              <Users size={18} />

              {team.members}

            </div>

          </div>
        ))}

      </div>

    </Card>
  );
}

export default RecentTeams;
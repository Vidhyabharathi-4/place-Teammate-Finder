import { Bell, CheckCircle, Users, UserPlus } from "lucide-react";

const notifications = [
  {
    id: 1,
    icon: <UserPlus className="text-blue-600" size={22} />,
    title: "New Team Invitation",
    message: "AI Research Team invited you to join.",
    time: "5 mins ago",
  },
  {
    id: 2,
    icon: <CheckCircle className="text-green-600" size={22} />,
    title: "Application Accepted",
    message: "Your application has been accepted.",
    time: "20 mins ago",
  },
  {
    id: 3,
    icon: <Users className="text-purple-600" size={22} />,
    title: "Member Joined",
    message: "A new member joined your team.",
    time: "1 hour ago",
  },
];

function Notifications() {
  return (
    <div className="p-8">

      <div className="flex items-center gap-3 mb-8">

        <Bell size={34} />

        <h1 className="text-4xl font-bold">
          Notifications
        </h1>

      </div>

      <div className="space-y-5">

        {notifications.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition"
          >

            <div className="flex justify-between">

              <div className="flex gap-4">

                <div>
                  {item.icon}
                </div>

                <div>

                  <h2 className="font-semibold text-lg">
                    {item.title}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    {item.message}
                  </p>

                </div>

              </div>

              <span className="text-sm text-slate-400">
                {item.time}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Notifications;
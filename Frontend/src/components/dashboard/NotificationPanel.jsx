import { Card } from "@/components/ui/card";

const notifications = [
  {
    title: "Application Accepted",
    time: "5 mins ago",
  },
  {
    title: "New Team Created",
    time: "20 mins ago",
  },
  {
    title: "Profile Updated",
    time: "1 hour ago",
  },
];

function NotificationPanel() {
  return (
    <Card>

      <h2 className="text-xl font-bold mb-6">
        Notifications
      </h2>

      <div className="space-y-4">

        {notifications.map((item, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-600 pl-4"
          >
            <h3 className="font-semibold">
              {item.title}
            </h3>

            <p className="text-sm text-slate-500">
              {item.time}
            </p>

          </div>
        ))}

      </div>

    </Card>
  );
}

export default NotificationPanel;
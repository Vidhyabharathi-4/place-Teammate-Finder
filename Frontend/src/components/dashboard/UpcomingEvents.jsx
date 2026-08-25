import { Card } from "@/components/ui/card";

const events = [
  {
    title: "Hackathon 2026",
    date: "25 July",
  },
  {
    title: "AI Workshop",
    date: "30 July",
  },
  {
    title: "Project Expo",
    date: "10 August",
  },
];

function UpcomingEvents() {
  return (
    <Card>

      <h2 className="text-xl font-bold mb-6">
        Upcoming Events
      </h2>

      <div className="space-y-4">

        {events.map((event, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-3"
          >
            <h3>{event.title}</h3>

            <span className="text-blue-600 font-semibold">
              {event.date}
            </span>

          </div>
        ))}

      </div>

    </Card>
  );
}

export default UpcomingEvents;
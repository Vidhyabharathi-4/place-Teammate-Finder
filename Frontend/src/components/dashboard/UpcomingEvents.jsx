import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardService from "../../services/dashboardService";

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await dashboardService.getUpcomingEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load upcoming events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Card>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Upcoming Events & Hackathons
        </h2>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          Campus
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
          <Calendar size={28} className="mx-auto mb-2 text-slate-400 opacity-60" />
          <p className="text-sm">No upcoming events scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0 flex-1 mr-4">
                <h3 className="font-medium text-slate-800 dark:text-white truncate">
                  {event.title}
                </h3>

                {event.category && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Tag size={12} className="text-blue-600 dark:text-blue-400" />
                    {event.category}
                  </p>
                )}
              </div>

              <div className="shrink-0 text-right">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm block">
                  {event.date}
                </span>

                {event.team_id ? (
                  <Link
                    to={`/teams/${event.team_id}`}
                    className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 underline"
                  >
                    View Team
                  </Link>
                ) : (
                  <Link
                    to="/teams"
                    className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 underline"
                  >
                    Find Team
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </Card>
  );
}

export default UpcomingEvents;
import {
  Users,
  FolderKanban,
  Award,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function ProfileStats({ profile }) {
  const completion = profile?.profile_completion ?? 20;

  const stats = [
    {
      title: "Profile Strength",
      value: `${completion}%`,
      subtitle: completion >= 80 ? "All-Star Profile" : "Add skills & bio to boost",
      icon: Sparkles,
      iconColor: "text-amber-500 dark:text-amber-400",
      iconBg: "bg-amber-100/80 dark:bg-amber-950/50",
      borderColor: "border-amber-200/80 dark:border-amber-900/40",
      badge: completion >= 80 ? "Strong" : "In Progress",
      badgeColor:
        completion >= 80
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    },
    {
      title: "Teams Created",
      value: profile?.teams_created ?? 0,
      subtitle: "Teams founded as leader",
      icon: FolderKanban,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100/80 dark:bg-blue-950/50",
      borderColor: "border-blue-200/80 dark:border-blue-900/40",
      link: "/my-teams",
    },
    {
      title: "Teams Joined",
      value: profile?.teams_joined ?? 0,
      subtitle: "Active collaborations",
      icon: Users,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100/80 dark:bg-emerald-950/50",
      borderColor: "border-emerald-200/80 dark:border-emerald-900/40",
      link: "/my-teams",
    },
    {
      title: "Specialization Track",
      value: profile?.specialization || "General",
      subtitle: profile?.department || "Rathinam College",
      icon: Award,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-100/80 dark:bg-indigo-950/50",
      borderColor: "border-indigo-200/80 dark:border-indigo-900/40",
      badge: "Track",
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
      {stats.map((item) => {
        const Icon = item.icon;

        const Content = (
          <div
            className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white dark:bg-slate-900 border ${item.borderColor} shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between`}
          >
            {/* Top Row: Icon + Badge/Arrow */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${item.iconBg}`}
              >
                <Icon size={20} className={item.iconColor} />
              </div>

              {item.badge ? (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              ) : item.link ? (
                <ArrowUpRight
                  size={16}
                  className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              ) : null}
            </div>

            {/* Value & Title */}
            <div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                {item.value}
              </div>

              <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {item.title}
              </div>

              <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                {item.subtitle}
              </p>
            </div>
          </div>
        );

        return item.link ? (
          <Link key={item.title} to={item.link}>
            {Content}
          </Link>
        ) : (
          <div key={item.title}>{Content}</div>
        );
      })}
    </div>
  );
}

export default ProfileStats;
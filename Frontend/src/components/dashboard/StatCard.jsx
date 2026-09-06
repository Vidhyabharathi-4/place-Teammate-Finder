import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      className={`shadow-xs hover:shadow-lg transition-all duration-200 border border-slate-200/90 dark:border-slate-700/80 p-5 sm:p-6 ${
        onClick
          ? "cursor-pointer hover:-translate-y-1 active:translate-y-0 group hover:border-blue-500/50"
          : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium truncate">
            {title}
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-800 dark:text-white tracking-tight">
            {value}
          </h2>

          {onClick && (
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3 group-hover:translate-x-1 transition-transform">
              <span>View details</span>
              <ArrowRight size={13} />
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${color}`}
        >
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
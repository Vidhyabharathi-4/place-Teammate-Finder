import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";

function CompletionCard({ profile }) {
  const items = [
    {
      label: "Basic Information",
      completed: !!profile?.name,
    },
    {
      label: "Department",
      completed: !!profile?.department,
    },
    {
      label: "Specialization",
      completed: !!profile?.specialization,
    },
    {
      label: "About Me",
      completed: !!profile?.about_me,
    },
    {
      label: "Skills",
      completed: !!profile?.skills,
    },
    {
      label: "GitHub",
      completed: !!profile?.github_url,
    },
    {
      label: "LinkedIn",
      completed: !!profile?.linkedin_url,
    },
    {
      label: "Portfolio",
      completed: !!profile?.portfolio_url,
    },
  ];

  const completedCount = items.filter(
    (item) => item.completed
  ).length;

  const percentage = Math.round(
    (completedCount / items.length) * 100
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-700">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40">
          <ShieldCheck
            className="text-blue-600 dark:text-blue-400"
            size={24}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Profile Completion
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Keep your profile complete
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
          {percentage}%
        </span>
      </div>

      {/* Progress */}
      <div className="px-6 pt-6">
        <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 p-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-700/50"
          >
            <span className="text-slate-700 dark:text-slate-200">
              {item.label}
            </span>

            {item.completed ? (
              <span className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                <CheckCircle2 size={18} />
                Complete
              </span>
            ) : (
              <span className="flex items-center gap-2 font-semibold text-red-500 dark:text-red-400">
                <XCircle size={18} />
                Missing
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default CompletionCard;
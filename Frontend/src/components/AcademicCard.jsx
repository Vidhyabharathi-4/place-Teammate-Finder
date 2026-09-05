import {
  GraduationCap,
  Hash,
  Mail,
  Building2,
  CalendarDays,
  Award,
} from "lucide-react";

function AcademicCard({ profile }) {
  const details = [
    {
      label: "Register Number",
      value: profile?.register_number || "-",
      icon: Hash,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
      label: "College Email",
      value: profile?.college_email || "-",
      icon: Mail,
      color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    },
    {
      label: "Department",
      value: profile?.department || "-",
      icon: Building2,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    },
    {
      label: "Year",
      value: profile?.year ? `${profile.year} Year` : "-",
      icon: CalendarDays,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    },
    {
      label: "Specialization",
      value: profile?.specialization || "Not Set",
      icon: Award,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-700">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
          <GraduationCap
            className="text-indigo-600 dark:text-indigo-400"
            size={24}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Academic Information
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            College and education details
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        {details.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={22} />
                </div>

                {/* Text: break-all whitespace-normal without truncation */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>

                  <p
                    className="mt-1 break-all whitespace-normal font-semibold text-slate-800 dark:text-white"
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default AcademicCard;
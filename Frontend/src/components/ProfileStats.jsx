import {
  Users,
  UserCheck,
  Rocket,
  Star
} from "lucide-react";

function ProfileStats({ profile }) {

  const score = calculateScore(profile);

  const stats = [
    {
      title: "Teams Created",
      value: profile?.teams_created || 0,
      icon: Users,
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-slate-700"
    },
    {
      title: "Teams Joined",
      value: profile?.teams_joined || 0,
      icon: UserCheck,
      iconBg: "bg-green-100 dark:bg-green-900/40",
      iconColor: "text-green-600 dark:text-green-400",
      border: "border-green-100 dark:border-slate-700"
    },
    {
      title: "Projects",
      value: profile?.projects || 0,
      icon: Rocket,
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-slate-700"
    },
    {
      title: "Profile Score",
      value: `${score}%`,
      icon: Star,
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      iconColor: "text-orange-600 dark:text-orange-400",
      border: "border-orange-100 dark:border-slate-700"
    }
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`
              group
              rounded-3xl
              border
              ${item.border}
              bg-white
              dark:bg-slate-800
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-slate-800 dark:text-white">
                  {item.value}
                </h2>
              </div>

              <div
                className={`
                  ${item.iconBg}
                  ${item.iconColor}
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  transition
                  group-hover:scale-110
                `}
              >
                <Icon size={30} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function calculateScore(profile) {
  if (!profile) return 0;

  let score = 0;

  if (profile.name) score += 10;
  if (profile.department) score += 10;
  if (profile.year) score += 10;
  if (profile.specialization) score += 10;
  if (profile.about_me) score += 20;
  if (profile.skills) score += 20;
  if (profile.github_url) score += 10;
  if (profile.linkedin_url) score += 5;
  if (profile.portfolio_url) score += 5;

  return score;
}

export default ProfileStats;
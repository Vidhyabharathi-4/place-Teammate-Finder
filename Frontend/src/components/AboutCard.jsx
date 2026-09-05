import { UserRound } from "lucide-react";

const AboutCard = ({ profile }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-700">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
          <UserRound size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            About Me
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Personal introduction
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {profile?.about_me ? (
          <p className="text-[16px] leading-8 text-slate-600 dark:text-slate-300 text-justify">
            {profile.about_me}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <UserRound
                size={40}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>

            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No Bio Available
            </h3>

            <p className="mt-2 max-w-md text-center text-slate-500 dark:text-slate-400">
              Tell other students about yourself,
              your interests, technical skills and
              the kind of teammates you're looking for.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AboutCard;
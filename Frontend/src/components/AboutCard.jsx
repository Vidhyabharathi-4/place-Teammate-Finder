import { UserRound } from "lucide-react";

const AboutCard = ({ profile }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Header */}

      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">

          <UserRound size={24} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            About Me
          </h2>

          <p className="text-sm text-slate-500">
            Personal introduction
          </p>

        </div>

      </div>

      {/* Content */}

      <div className="px-6 py-6">

        {profile?.about ? (

          <p className="text-[16px] leading-8 text-slate-600 text-justify">

            {profile.about}

          </p>

        ) : (

          <div className="flex flex-col items-center justify-center py-10">

            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">

              <UserRound
                size={40}
                className="text-slate-400"
              />

            </div>

            <h3 className="text-lg font-semibold text-slate-700">

              No Bio Available

            </h3>

            <p className="mt-2 max-w-md text-center text-slate-500">

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
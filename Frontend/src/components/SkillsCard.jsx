import { Code2, Sparkles } from "lucide-react";

const badgeColors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
];

const SkillsCard = ({ profile }) => {
  const skills =
    profile?.skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) || [];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">

      {/* Header */}

      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">

          <Code2 className="h-6 w-6 text-blue-600" />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Technical Skills
          </h2>

          <p className="text-sm text-slate-500">
            Technologies and programming languages
          </p>

        </div>

      </div>

      {/* Body */}

      <div className="px-6 py-6">

        {skills.length > 0 ? (

          <div className="flex flex-wrap gap-3">

            {skills.map((skill, index) => (

              <span
                key={index}
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  transition
                  hover:scale-105
                  ${badgeColors[index % badgeColors.length]}
                `}
              >

                <Sparkles size={14} />

                {skill}

              </span>

            ))}

          </div>

        ) : (

          <div className="flex flex-col items-center justify-center py-10">

            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">

              <Code2
                size={40}
                className="text-slate-400"
              />

            </div>

            <h3 className="text-lg font-semibold text-slate-700">
              No Skills Added
            </h3>

            <p className="mt-2 max-w-md text-center text-slate-500">
              Add your programming languages, frameworks,
              databases, and tools to help teammates find you.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default SkillsCard;
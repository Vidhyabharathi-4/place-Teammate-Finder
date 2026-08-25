import { Globe, Link } from "lucide-react";

function LinksCard({ profile }) {
  const links = [
    {
      title: "GitHub",
      value: profile.github_url,
      icon: Link,
      color: "bg-slate-100 text-slate-700",
    },
    {
      title: "LinkedIn",
      value: profile.linkedin_url,
      icon: Link,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Portfolio",
      value: profile.portfolio_url,
      icon: Globe,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
          <Globe className="text-indigo-600" size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Professional Links
          </h2>

          <p className="text-sm text-slate-500">
            Showcase your online presence
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-4 p-6">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <div
              key={link.title}
              className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${link.color}`}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {link.title}
                  </p>

                  {link.value ? (
                    <a
                      href={link.value}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sm text-blue-600 hover:underline"
                    >
                      {link.value}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-400">
                      Not Added
                    </p>
                  )}
                </div>
              </div>

              {link.value && (
                <a
                  href={link.value}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-slate-100 p-2 transition hover:bg-blue-100"
                >
                  <Link size={18} className="text-slate-600" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LinksCard;
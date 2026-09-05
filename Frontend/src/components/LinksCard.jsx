import { Globe, Link as LinkIcon, ExternalLink } from "lucide-react";

function LinksCard({ profile }) {
  const links = [
    {
      title: "GitHub",
      value: profile?.github_url,
      icon: LinkIcon,
      color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    },
    {
      title: "LinkedIn",
      value: profile?.linkedin_url,
      icon: LinkIcon,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
      title: "Portfolio",
      value: profile?.portfolio_url,
      icon: Globe,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-700">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
          <Globe
            className="text-indigo-600 dark:text-indigo-400"
            size={24}
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Professional Links
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
              className="flex min-w-0 items-start justify-between gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-700/50 dark:hover:border-slate-600"
            >
              {/* Left Section */}
              <div className="flex min-w-0 flex-1 items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${link.color}`}
                >
                  <Icon size={22} />
                </div>

                {/* Link Information - wrap long URLs without truncation */}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {link.title}
                  </p>

                  {link.value ? (
                    <a
                      href={link.value}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all whitespace-normal text-sm text-blue-600 hover:underline dark:text-blue-400"
                      title={link.value}
                    >
                      {link.value}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      Not Added
                    </p>
                  )}
                </div>
              </div>

              {/* Open Link Button */}
              {link.value && (
                <a
                  href={link.value}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  title={`Open ${link.title}`}
                >
                  <ExternalLink size={18} />
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
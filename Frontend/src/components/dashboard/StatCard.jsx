import { Card } from "@/components/ui/card";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <Card className="shadow-sm hover:shadow-xl transition-all">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2 text-slate-800 dark:text-white">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="text-white" size={26} />
        </div>

      </div>

    </Card>
  );
}

export default StatCard;
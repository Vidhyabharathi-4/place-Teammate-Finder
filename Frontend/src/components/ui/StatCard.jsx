import Card from "./card";

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <Card>

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-500">
            {title}
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {value}
          </h1>

        </div>

        <div
          className={`
          w-14
          h-14
          rounded-xl
          flex
          items-center
          justify-center
          text-2xl
          ${color}
          `}
        >
          {icon}
        </div>

      </div>

    </Card>
  );
}

export default StatCard;
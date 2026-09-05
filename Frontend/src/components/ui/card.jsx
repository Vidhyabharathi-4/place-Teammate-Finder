function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        dark:border-slate-700
        dark:bg-slate-800
        dark:text-white
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-semibold text-slate-800 dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function CardFooter({ children, className = "" }) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
};
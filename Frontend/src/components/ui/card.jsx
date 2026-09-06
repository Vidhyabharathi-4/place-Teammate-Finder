function Card({ children, className = "", ...props }) {
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
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "", ...props }) {
  return <div className={`mb-4 ${className}`} {...props}>{children}</div>;
}

function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-slate-800 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}

function CardContent({ children, className = "", ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

function CardFooter({ children, className = "", ...props }) {
  return <div className={`mt-4 ${className}`} {...props}>{children}</div>;
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
};
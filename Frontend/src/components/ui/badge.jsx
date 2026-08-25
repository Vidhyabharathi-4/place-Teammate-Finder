function Badge({ children }) {
  return (
    <span
      className="
      bg-blue-100
      text-blue-700
      px-4
      py-2
      rounded-full
      font-medium
      text-sm
      "
    >
      {children}
    </span>
  );
}

export default Badge;
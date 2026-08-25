function Avatar({ name }) {
  const letter = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      className="
      w-32
      h-32
      rounded-full
      bg-gradient-to-r
      from-blue-600
      to-indigo-600
      text-white
      text-5xl
      font-bold
      flex
      items-center
      justify-center
      border-4
      border-white
      shadow-xl
      "
    >
      {letter}
    </div>
  );
}

export default Avatar;
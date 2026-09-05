export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base =
    import.meta.env.VITE_API_URL !== undefined
      ? import.meta.env.VITE_API_URL
      : import.meta.env.PROD
      ? ""
      : "http://localhost:8000";

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

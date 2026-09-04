export function getAbsoluteQrUrl(path: string, customHost?: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (customHost && customHost.trim()) {
    const cleanCustomHost = customHost.trim().replace(/\/$/, "");
    return `${cleanCustomHost}${cleanPath}`;
  }
  if (typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null") {
    return `${window.location.origin.replace(/\/$/, "")}${cleanPath}`;
  }
  return `https://smart-campus-navigation-six.vercel.app${cleanPath}`;
}

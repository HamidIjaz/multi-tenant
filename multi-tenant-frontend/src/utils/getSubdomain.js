export const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  if (parts.length < 2) {
    return null;
  }

  if (parts[0] !== "localhost" && parts[0] !== "www") {
    return parts[0];
  }

  return null;
};

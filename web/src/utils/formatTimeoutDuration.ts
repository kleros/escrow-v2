export const formatTimeoutDuration = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let result = "";
  if (days > 0) result += `${days}d `;
  if (days > 0 || hours > 0) result += `${hours}h `;
  if (days > 0 || hours > 0 || minutes > 0) result += `${minutes}m `;
  result += `${secs}s`;

  return result.trim();
};

export const formatDistanceToNow = (date: Date, options: { addSuffix?: boolean } = {}) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return options.addSuffix ? 'just now' : 'now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ${options.addSuffix ? 'ago' : ''}`.trim();
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ${options.addSuffix ? 'ago' : ''}`.trim();
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ${options.addSuffix ? 'ago' : ''}`.trim();
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ${options.addSuffix ? 'ago' : ''}`.trim();
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ${options.addSuffix ? 'ago' : ''}`.trim();
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ${options.addSuffix ? 'ago' : ''}`.trim();
};
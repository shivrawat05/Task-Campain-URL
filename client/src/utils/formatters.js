export function formatDate(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function truncateUrl(url, maxLength = 35) {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

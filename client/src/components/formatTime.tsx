export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    weekday: 'short', // "Mon"
    year: 'numeric', // "2025"
    month: 'short', // "Jan"
    day: 'numeric', // "8"
    hour: 'numeric', // "8"
    minute: 'numeric', // "48"
    second: 'numeric', // "7"
    hour12: true // AM/PM
  })
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

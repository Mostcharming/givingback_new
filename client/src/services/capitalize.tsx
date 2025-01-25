export const capitalizeFirstLetter = (string: string) => {
  if (typeof string !== 'string') {
    return string // Return the value as is if it's not a string
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

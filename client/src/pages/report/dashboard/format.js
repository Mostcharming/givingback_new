import numeral from 'numeral'
import { format, getTime, formatDistanceToNow } from 'date-fns'

// ----------------------------------------------------------------------

export function fDate (date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy'

  return date ? format(new Date(date), fm) : ''
}
export function fNumber (number) {
  return numeral(number).format()
}

export function fDateTime (date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p'

  return date ? format(new Date(date), fm) : ''
}

export function fTimestamp (date) {
  return date ? getTime(new Date(date)) : ''
}

export function fToNow (date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true
      })
    : ''
}

function result (format, key = '.00') {
  const isInteger = format.includes(key)

  return isInteger ? format.replace(key, '') : format
}

export function fShortenNumber (number) {
  const format = number ? numeral(number).format('0.00a') : ''
  return result(format, '.00')
}

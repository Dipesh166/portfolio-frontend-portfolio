const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return value
  const [, year, month] = match
  const monthIndex = Number(month) - 1
  if (monthIndex < 0 || monthIndex >= 12) return value
  return `${MONTHS[monthIndex]} ${year}`
}

export function formatDateRange(
  start: string,
  end: string | null,
  isCurrent: boolean,
): string {
  if (isCurrent || !end) return `${formatDate(start)} - Present`
  return `${formatDate(start)} - ${formatDate(end)}`
}
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export const getFirstName = (nameOrEmail?: string | null) => {
  if (!nameOrEmail) return 'there'
  if (nameOrEmail.includes('@')) {
    const [local] = nameOrEmail.split('@')
    return local || 'there'
  }
  return nameOrEmail.split(' ')[0] || 'there'
}

const normalizeDate = (date: Date | string) => {
  const parsed = new Date(date)
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
}

const getWeekRangeMonday = (baseDate: Date = new Date()) => {
  const start = normalizeDate(baseDate)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export const countDueThisWeekMonday = (items: Array<{ date: Date | string }>) => {
  const today = normalizeDate(new Date())
  const { start, end } = getWeekRangeMonday()

  return items.filter((item) => {
    const dueDate = normalizeDate(item.date)
    return dueDate >= today && dueDate >= start && dueDate <= end
  }).length
}

export const priceRangeLabel = (range: number | null): string => {
  if (!range) return ''
  return '€'.repeat(range)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const starsArray = (rating: number): string => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

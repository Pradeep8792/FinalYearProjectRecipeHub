export const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/800x500/f8f3ec/f97316?text=RecipeHub'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_UPLOADS_BASE_URL}${path}`
}

export const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

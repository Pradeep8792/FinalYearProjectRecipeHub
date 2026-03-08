import { useEffect } from 'react'

// Simple page title hook
// Usage: usePageTitle('Recipes') -> document.title = 'Recipes — RecipeHub'
export default function usePageTitle(title, suffix = 'RecipeHub') {
	useEffect(() => {
		// keep a safe default title to avoid blank title pages
		const base = suffix || 'RecipeHub'
		document.title = title ? `${title} — ${base}` : base
	}, [title, suffix])
}

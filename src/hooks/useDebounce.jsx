import { useEffect, useState } from 'react'

// Simple debounce hook
// Usage: const debounced = useDebounce(value, 300)
// Returns the value but only after it has not changed for `delay` ms.
export default function useDebounce(value, delay = 300) {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay)
		// cancel on value or delay change
		return () => clearTimeout(handler)
	}, [value, delay])

	return debouncedValue
}

import { createContext, useContext, useCallback, useEffect, useMemo } from 'react'
import type { Theme, ThemeContextProps, ThemeProviderProps } from '../lib/definitions.ts'
import { useLocalStorage } from '../hook/useLocalStorage.tsx'

// Only consulted on the very first visit: once a choice is stored,
// useLocalStorage's lazy initializer never calls this again.
function getSystemTheme(): Theme {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const ThemeContext = createContext<ThemeContextProps | null>(null)

export default function ThemeProvider({ children }: ThemeProviderProps) {
	const [theme, setTheme] = useLocalStorage<Theme>('theme', getSystemTheme())

	const toggleTheme = useCallback(() => {
		setTheme(prev => prev === 'light' ? 'dark' : 'light')
	}, [setTheme])

	// The <html> attribute is the single source of truth the CSS variables
	// key off; color-scheme keeps native controls and scrollbars in sync.
	useEffect(() => {
		document.documentElement.dataset.theme = theme
		document.documentElement.style.colorScheme = theme
	}, [theme])

	const value = useMemo<ThemeContextProps>(() => ({
		theme,
		setTheme,
		toggleTheme,
	}), [theme, setTheme, toggleTheme])

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme(): ThemeContextProps {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

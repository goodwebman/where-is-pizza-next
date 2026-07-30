import { createContext } from 'react'
import { lightTheme } from '../index'
import { ThemeContextType, ThemeNameEnum } from '../types'

export const ThemeContext = createContext<ThemeContextType>({
	theme: lightTheme,
	currentTheme: ThemeNameEnum.LIGHT,
	selectTheme: (_value: ThemeNameEnum) => {},
	toggleTheme: () => {},
})

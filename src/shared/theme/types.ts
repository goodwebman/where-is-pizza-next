export enum ThemeNameEnum {
    LIGHT = 'light',
    DARK = 'dark'
}

export type ThemeType = {
    name: ThemeNameEnum
    styles: Record<string, string>
}

export type ThemeContextType = {
    theme: ThemeType
    currentTheme: ThemeNameEnum
    selectTheme: (value: ThemeNameEnum) => void
    toggleTheme: () => void
}
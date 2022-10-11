import * as React from 'react'



const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('color-theme');
        if (typeof storedPrefs === 'string') {
            return (storedPrefs as unknown as 'dark' | 'light');
        }

        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) {
            return 'dark';
        }
    }

    return 'dark' // light theme as the default;
};

export const ThemeContext = React.createContext(({} as { colorTheme: 'light' | 'dark', setColorTheme: React.Dispatch<React.SetStateAction<string>> }));

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [colorTheme, setColorTheme] = React.useState(getInitialTheme);


    const rawSetTheme = (rawTheme: string) => {
        const root = document.getElementById('background_wrapper');
        const isDark = rawTheme === 'dark';

        root?.classList.remove(isDark ? 'white' : 'dark');
        root?.classList.add(rawTheme);

        localStorage.setItem('color-theme', rawTheme);
    };



    React.useEffect(() => {
        rawSetTheme(colorTheme);
    }, [colorTheme]);



    return (
        <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider


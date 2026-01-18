"use client"
import React, { useState, useEffect } from 'react';
import ThemeContext from './themeContext';

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [isMounted, setIsMounted] = useState(false);

    // Initialize theme from localStorage on mount
    useEffect(() => {
        // Get stored theme or system preference
        const storedTheme = localStorage.getItem('savebook-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
        
        setTheme(initialTheme);
        applyTheme(initialTheme);
        setIsMounted(true);
    }, []);

    const applyTheme = (newTheme) => {
        const html = document.documentElement;
        
        if (newTheme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        
        // Store preference
        localStorage.setItem('savebook-theme', newTheme);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    const setThemeMode = (newTheme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    // Render immediately with theme applied
    if (!isMounted) {
        return (
            <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {}, setThemeMode: () => {} }}>
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;

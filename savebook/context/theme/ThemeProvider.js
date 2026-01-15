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
        const body = document.body;
        
        if (newTheme === 'dark') {
            // Dark mode colors - optimized for visibility
            html.classList.add('dark');
            html.style.backgroundColor = '#0f172a'; // slate-900
            body.style.backgroundColor = '#0f172a';
            body.style.color = '#e2e8f0'; // slate-200 - better contrast
            document.documentElement.style.colorScheme = 'dark';
        } else {
            // Light mode colors - optimized for readability
            html.classList.remove('dark');
            html.style.backgroundColor = '#ffffff'; // white
            body.style.backgroundColor = '#ffffff';
            body.style.color = '#1f2937'; // gray-800 - darker for better readability
            document.documentElement.style.colorScheme = 'light';
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

"use client"
import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/context/theme/themeContext';
import { useEffect, useState } from 'react';

export default function ToasterProvider() {
    const { theme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    // Theme-aware toast colors
    const toastColors = {
        light: {
            background: '#ffffff',
            text: '#1f2937',
            border: '#e5e7eb',
            success: '#10b981',
            error: '#ef4444',
            loading: '#3b82f6',
        },
        dark: {
            background: '#1e293b',
            text: '#e2e8f0',
            border: '#334155',
            success: '#10b981',
            error: '#ef4444',
            loading: '#3b82f6',
        }
    };

    const colors = theme === 'dark' ? toastColors.dark : toastColors.light;

    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                duration: 3000,
                style: {
                    background: colors.background,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '0.5rem',
                    boxShadow: theme === 'dark' 
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                },
                success: {
                    style: {
                        background: colors.success,
                        color: '#ffffff',
                        border: 'none',
                    },
                    iconTheme: {
                        primary: '#ffffff',
                        secondary: colors.success,
                    }
                },
                error: {
                    style: {
                        background: colors.error,
                        color: '#ffffff',
                        border: 'none',
                    },
                    iconTheme: {
                        primary: '#ffffff',
                        secondary: colors.error,
                    }
                },
                loading: {
                    style: {
                        background: colors.loading,
                        color: '#ffffff',
                        border: 'none',
                    },
                    iconTheme: {
                        primary: '#ffffff',
                        secondary: colors.loading,
                    }
                },
            }}
        />
    );
}

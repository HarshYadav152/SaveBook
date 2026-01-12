"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({ children, ...props }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
            {children}
        </NextThemesProvider>
    );
}

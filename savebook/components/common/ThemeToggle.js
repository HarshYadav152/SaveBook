"use client"
import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Theme"
        >
            {resolvedTheme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="w-5 h-5 text-blue-600" />
            )}
        </button>
    )
}

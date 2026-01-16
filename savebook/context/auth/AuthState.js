"use client"
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from './authContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Check if user is authenticated on component mount
    useEffect(() => {
        checkUserAuthentication();
    }, []);

    // Function to check if user is authenticated
    const checkUserAuthentication = async () => {
        try {
            setLoading(true);
            // This endpoint will use the HttpOnly cookie automatically
            const response = await fetch('/api/auth/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important: sends cookies with request
            });
            
            const data = await response.json();
            
            if (data.success) {
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Authentication check failed:", error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (username, password, rememberMe) => {
    try {
        setLoading(true);
        const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
        credentials: "include", // keep cookie
        });

        const data = await response.json();

        if (response.ok && data.success) {
        // Only set authenticated on success
        setUser(data.data.user);
        setIsAuthenticated(true);
        return { success: true, message: data.message };
        } else {
        // Do not set isAuthenticated here
        setIsAuthenticated(false);
        setUser(null);
        setIsAuthenticated(false);
        return {
            success: false,
            message: data.message || "Invalid credentials",
        };
        }
    } catch (error) {
        console.error("Login error:", error);
        setIsAuthenticated(false);
        return {
          success: false,
          message: "An error occurred during login",
        };
    } finally {
        setLoading(false);
    }
    };

    // Register function
    const register = async (username, password) => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username,password}),
                credentials: 'include'
            });

            const data = await response.json();
            
            if (data.success) {
                return {
                    success:true,
                    message:data.message
                }
            } else {
                return { 
                    success: false, 
                    message: data.message || "Registration failed" 
                };
            }
        } catch (error) {
            console.error("Registration error:", error);
            return { 
                success: false, 
                message: "An error occurred during registration" 
            };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            // Call logout API to clear the cookie server-side
            await fetch('/api/auth/logout', {
                method: 'GET',
                credentials: 'include'
            });
            
            setUser(null);
            setIsAuthenticated(false);
            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    //function created for providing path for updateProfile
    const updateProfile = async (updates) => {
    const response = await fetch('/api/auth/updateProfile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include'
    });
    const data = await response.json();
    if (data.success) setUser(data.user);
    return data;
    };

    // Create the context value
    const contextValue = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkUserAuthentication
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
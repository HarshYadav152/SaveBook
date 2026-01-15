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

    // Encryption State
    const [masterKey, setMasterKey] = useState(null);

    // Login function
    const login = async (username, password) => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // Important: to store the cookie
            });

            const data = await response.json();

            if (data.success) {
                const userData = data.data.user;
                setUser(userData);
                setIsAuthenticated(true);

                // Derive and Unwrap Master Key
                if (userData.encryptedMasterKey && userData.keySalt && userData.keyIv) {
                    try {
                        const { deriveKeyFromPassword, unwrapKey, hexToBuffer } = await import('../../lib/utils/crypto');
                        const salt = hexToBuffer(userData.keySalt);
                        const kek = await deriveKeyFromPassword(password, salt);
                        const umk = await unwrapKey(userData.encryptedMasterKey, userData.keyIv, kek);
                        setMasterKey(umk);
                        // Optional: Session persistence logic could go here
                        console.log("Master Key successfully derived");
                    } catch (e) {
                        console.error("Failed to derive master key:", e);
                    }
                }

                return { success: true, message: data.message };
            } else {
                return {
                    success: false,
                    message: data.message || "Login failed"
                };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: "An error occurred during login"
            };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (username, password) => {
        try {
            setLoading(true);

            // Generate Keys
            const { generateSalt, bufferToHex, deriveKeyFromPassword, generateSymmetricKey, wrapKey } = await import('../../lib/utils/crypto');

            const salt = generateSalt();
            const saltHex = bufferToHex(salt);
            const kek = await deriveKeyFromPassword(password, salt);
            const umk = await generateSymmetricKey();
            const wrapped = await wrapKey(umk, kek);

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    encryptedMasterKey: wrapped.encryptedKey,
                    keySalt: saltHex,
                    keyIv: wrapped.iv
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                return {
                    success: true,
                    message: data.message
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
            setMasterKey(null);
            setIsAuthenticated(false);
            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Create the context value
    const contextValue = {
        user,
        masterKey,
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
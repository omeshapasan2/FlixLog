import React, { useState, useEffect, use } from 'react';
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { auth } from '../api/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { IoMdLogOut } from "react-icons/io";
import { useAuth } from '../context/AuthContext';

function NavBar() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check local storage for mode preference, default to dark mode
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            return savedMode === 'true';
        }
        return false;
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Effect to handle dark mode class on html element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // ---------------------------------------
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    if (loading) return null;
    // ---------------------------------------

    // Handle sign out
    // This function is called when the user clicks the "Sign Out" button
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast.success("Successfully signed out");
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error("Failed to sign out");
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 transition-all duration-300">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="navbar-brand">
                        <a 
                            href="/" 
                            className="text-2xl md:text-3xl lg:text-4xl font-bold 
                                transition-transform duration-300 hover:scale-105
                                bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"
                        >
                            FlixLog
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button 
                        className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>

                    <div className={`navbar-links md:flex items-center space-y-4 md:space-y-0 md:space-x-6 
                        absolute md:static left-0 w-full md:w-auto
                        bg-white dark:bg-gray-900 md:bg-transparent
                        shadow-md md:shadow-none
                        transition-all duration-300 ease-in-out
                        p-4 md:p-0
                        ${isMenuOpen ? 'top-full opacity-100 visible' : 'top-[-400px] md:top-0 opacity-0 md:opacity-100 invisible md:visible'}
                        z-40`}>

                        {/* <NavLink href="/" label="Home" />
                        <NavLink href="/favorites" label="Favorites" />
                        <NavLink href="/watch-list" label="WatchList" />
                        <NavLink href="/ongoing" label="Ongoing" />
                        <NavLink href="/login" label="Login" />
                        <NavLink href="/register" label="Register" /> */}

                        

                        {/* {loading ? null : (
                            user ? (
                                <>
                                    <NavLink href="/favorites" label="Favorites" />
                                    <NavLink href="/watch-list" label="WatchList" />
                                    <NavLink href="/ongoing" label="Ongoing" />
                                    <button 
                                        onClick={handleSignOut}
                                        className="block md:inline-block px-3 py-2 rounded-md
                                                text-base md:text-lg font-medium
                                                text-gray-700 dark:text-gray-300 
                                                hover:text-gray-900 dark:hover:text-white 
                                                hover:bg-gray-100 dark:hover:bg-gray-800
                                                transition-colors duration-300"
                                    >
                                        <IoMdLogOut className="inline mr-2" />
                                        Sign Out
                                    </button>

                                </>
                            ) : (
                                <>
                                    <NavLink href="/login" label="Login" />
                                    <NavLink href="/register" label="Register" />
                                </>
                            )
                        )} */}

                        {/* Always show Home link */}
                        <NavLink href="/" label="Home" />

                        {user ? (
                            <>
                                <NavLink href="/favorites" label="Favorites" />
                                <NavLink href="/watch-list" label="WatchList" />
                                <NavLink href="/ongoing" label="Ongoing" />
                                <button 
                                onClick={handleSignOut}
                                className="block md:inline-block px-3 py-2 rounded-md
                                    text-base md:text-lg font-medium
                                    text-gray-700 dark:text-gray-300 
                                    hover:text-gray-900 dark:hover:text-white 
                                    hover:bg-gray-100 dark:hover:bg-gray-800
                                    transition-colors duration-300"
                                >
                                <IoMdLogOut className="inline mr-2" />
                                Sign Out
                                </button>
                            </>
                            ) : (
                            <>
                                <NavLink href="/login" label="Login" />
                                <NavLink href="/register" label="Register" />
                            </>
                        )}

                        {/* Dark mode toggle */}
                        
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                                {isDarkMode ? (
                                    <Moon className="text-gray-500 dark:text-gray-300 mr-2" size={20} />
                                ) : (
                                    <Sun className="text-yellow-600 mr-2" size={20} />
                                )}
                                <Switch 
                                    checked={isDarkMode}
                                    onCheckedChange={toggleDarkMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="pt-16 md:pt-20"></div>
        </>
    );
}

// NavLink component with the underline animation effect
function NavLink({ href, label }) {
    return (
        <a 
            href={href} 
            className="block md:inline-block relative px-3 py-2 rounded-md
                text-base md:text-lg font-medium
                text-gray-700 dark:text-gray-300 
                hover:text-gray-900 dark:hover:text-white 
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-300
                group"
        >
            {label}
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400 
                group-hover:w-4/5 transition-all duration-300 transform -translate-x-1/2"></span>
        </a>
    );
}

export default NavBar;
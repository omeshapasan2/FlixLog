import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { auth } from '../api/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { IoMdLogOut } from "react-icons/io";

function NavBar() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Effect to handle dark mode class on html element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Handle sign out
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast.success("Successfully signed out");
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error("Failed to sign out");
        }
    };

    if (loading) return null;

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 transition-all duration-300">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="navbar-brand">
                        <Link 
                            to="/" 
                            className="text-2xl md:text-3xl lg:text-4xl font-bold 
                                transition-transform duration-300 hover:scale-105
                                bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"
                        >
                            FlixLog
                        </Link>
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

                        {/* Always show Home link */}
                        <NavLink to="/" label="Home" />

                        {user ? (
                            <>
                                <NavLink to="/favorites" label="Favorites" />
                                <NavLink to="/watch-list" label="WatchList" />
                                <NavLink to="/ongoing" label="Ongoing" />
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
                                <NavLink to="/login" label="Login" />
                                <NavLink to="/register" label="Register" />
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
function NavLink({ to, label }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <Link 
            to={to} 
            className={`block md:inline-block relative px-3 py-2 rounded-md
                text-base md:text-lg font-medium
                text-gray-700 dark:text-gray-300 
                hover:text-gray-900 dark:hover:text-white 
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-300
                group ${isActive ? 'text-gray-900 dark:text-white' : ''}`}
        >
            {label}
            <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400 
                transition-all duration-300 transform -translate-x-1/2
                ${isActive ? 'w-4/5' : 'w-0 group-hover:w-4/5'}`}></span>
        </Link>
    );
}

export default NavBar;
import React, { useState, useEffect } from 'react';
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

function NavBar() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Effect to handle dark mode class on html element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-transparent z-50 transition-colors duration-300">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="navbar-brand">
                        <a 
                            href="/" 
                            className="text-2xl font-bold 
                                text-gray-800 
                                dark:text-gray-200 
                                transition-colors duration-300 
                                hover:text-gray-600 
                                dark:hover:text-white"
                        >
                            Logo
                        </a>
                    </div>
                    <div className="navbar-links flex items-center space-x-4">
                        <a 
                            href="/" 
                            className="nav-link 
                                text-gray-700 
                                dark:text-gray-300 
                                hover:text-gray-900 
                                dark:hover:text-white 
                                transition-colors duration-300"
                        >
                            Home
                        </a>
                        <a 
                            href="/favorites" 
                            className="nav-link 
                                text-gray-700 
                                dark:text-gray-300 
                                hover:text-gray-900 
                                dark:hover:text-white 
                                transition-colors duration-300"
                        >
                            Favorites
                        </a>
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
            <br/>
            <br/>
        </>
    );
}

export default NavBar;
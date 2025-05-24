import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { 
    Home, 
    Heart, 
    Bookmark, 
    Play, 
    LogIn, 
    UserPlus, 
    Moon, 
    Sun,
    ChevronRight,
    ChevronLeft,
    LogOut
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { auth } from '../api/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";

function NavBar() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
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

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
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
            {/* Sidebar */}
            <nav className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50 
                transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700
                ${isExpanded ? 'w-64' : 'w-16'}`}>
                
                {/* Brand */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <Link 
                        to="/" 
                        className={`flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-400 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        {isExpanded && (
                            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                                FlixLog
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col py-4 space-y-2">
                    <NavItem 
                        to="/" 
                        icon={<Home size={20} />} 
                        label="Home" 
                        isExpanded={isExpanded}
                        isActive={location.pathname === '/'}
                    />

                    {user ? (
                        <>
                            <NavItem 
                                to="/favorites" 
                                icon={<Heart size={20} />} 
                                label="Favorites" 
                                isExpanded={isExpanded}
                                isActive={location.pathname === '/favorites'}
                            />
                            <NavItem 
                                to="/watch-list" 
                                icon={<Bookmark size={20} />} 
                                label="WatchList" 
                                isExpanded={isExpanded}
                                isActive={location.pathname === '/watch-list'}
                            />
                            <NavItem 
                                to="/ongoing" 
                                icon={<Play size={20} />} 
                                label="Ongoing" 
                                isExpanded={isExpanded}
                                isActive={location.pathname === '/ongoing'}
                            />
                            
                            {/* Sign Out Button */}
                            <button 
                                onClick={handleSignOut}
                                className={`flex items-center px-4 py-3 mx-2 rounded-lg
                                    text-gray-700 dark:text-gray-300 
                                    hover:text-red-600 dark:hover:text-red-400
                                    hover:bg-red-50 dark:hover:bg-red-900/20
                                    transition-all duration-200 group
                                    ${isExpanded ? 'justify-start' : 'justify-center'}`}
                                title={!isExpanded ? "Sign Out" : ""}
                            >
                                <LogOut size={20} className="flex-shrink-0" />
                                {isExpanded && (
                                    <span className="ml-3 font-medium">Sign Out</span>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <NavItem 
                                to="/login" 
                                icon={<LogIn size={20} />} 
                                label="Login" 
                                isExpanded={isExpanded}
                                isActive={location.pathname === '/login'}
                            />
                            <NavItem 
                                to="/register" 
                                icon={<UserPlus size={20} />} 
                                label="Register" 
                                isExpanded={isExpanded}
                                isActive={location.pathname === '/register'}
                            />
                        </>
                    )}
                </div>

                {/* Dark Mode Toggle */}
                <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-auto
                    ${isExpanded ? '' : 'px-2'}`}>
                    <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                        {isExpanded && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Dark Mode
                            </span>
                        )}
                        <div className="flex items-center space-x-2">
                            {!isExpanded && (
                                <div className="p-2">
                                    {isDarkMode ? (
                                        <Moon className="text-gray-500 dark:text-gray-300" size={16} />
                                    ) : (
                                        <Sun className="text-yellow-600" size={16} />
                                    )}
                                </div>
                            )}
                            {isExpanded && (
                                <>
                                    {isDarkMode ? (
                                        <Moon className="text-gray-500 dark:text-gray-300" size={16} />
                                    ) : (
                                        <Sun className="text-yellow-600" size={16} />
                                    )}
                                    <Switch 
                                        checked={isDarkMode}
                                        onCheckedChange={toggleDarkMode}
                                        className="scale-75"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-600 rounded-full
                        flex items-center justify-center shadow-md
                        hover:bg-gray-50 dark:hover:bg-gray-700
                        transition-colors duration-200"
                >
                    {isExpanded ? (
                        <ChevronLeft size={14} className="text-gray-600 dark:text-gray-400" />
                    ) : (
                        <ChevronRight size={14} className="text-gray-600 dark:text-gray-400" />
                    )}
                </button>
            </nav>

            {/* Main Content Offset */}
            <div className={`transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-16'}`}>
                {/* Your main content goes here */}
            </div>
        </>
    );
}

// Individual Navigation Item Component
function NavItem({ to, icon, label, isExpanded, isActive }) {
    return (
        <Link 
            to={to}
            className={`flex items-center px-4 py-3 mx-2 rounded-lg
                transition-all duration-200 group relative
                ${isActive 
                    ? 'bg-gradient-to-r from-red-500 to-yellow-400 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
                ${isExpanded ? 'justify-start' : 'justify-center'}`}
            title={!isExpanded ? label : ""}
        >
            <div className="flex-shrink-0">
                {icon}
            </div>
            {isExpanded && (
                <span className="ml-3 font-medium transition-opacity duration-200">
                    {label}
                </span>
            )}
            
            {/* Active indicator when collapsed */}
            {/* {!isExpanded && isActive && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-red-500 to-yellow-400 rounded-l-full"></div>
            )} */}
        </Link>
    );
}

export default NavBar;
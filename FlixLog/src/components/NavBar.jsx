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
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { auth, signOut } from '../api/firebase'; // Import directly

function NavBar() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, loading } = useAuth();
    const location = useLocation();

    // Effect to handle dark mode class on html element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Close mobile menu when screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Handle sign out - Fixed version
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("Signed out successfully");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    // Don't render anything while loading
    if (loading) {
        return (
            <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 shadow-lg z-50 border-b border-gray-200 dark:border-gray-700 md:w-16 md:h-full md:right-auto">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 shadow-lg z-50 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between h-full px-4">
                    {/* Brand */}
                    <Link to="/" className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-400 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="ml-3 text-xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                            FlixLog
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} className="text-gray-600 dark:text-gray-400" />
                        ) : (
                            <Menu size={24} className="text-gray-600 dark:text-gray-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Mobile Menu */}
            <div className={`md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-40 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}>
                <div className="py-4 space-y-2">
                    <MobileNavItem 
                        to="/" 
                        icon={<Home size={20} />} 
                        label="Home" 
                        isActive={location.pathname === '/'}
                    />

                    {user ? (
                        <>
                            <MobileNavItem 
                                to="/favorites" 
                                icon={<Heart size={20} />} 
                                label="Favorites" 
                                isActive={location.pathname === '/favorites'}
                            />
                            <MobileNavItem 
                                to="/watch-list" 
                                icon={<Bookmark size={20} />} 
                                label="WatchList" 
                                isActive={location.pathname === '/watch-list'}
                            />
                            <MobileNavItem 
                                to="/ongoing" 
                                icon={<Play size={20} />} 
                                label="Ongoing" 
                                isActive={location.pathname === '/ongoing'}
                            />
                            
                            {/* Mobile Sign Out Button */}
                            <button 
                                onClick={handleSignOut}
                                className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                            >
                                <LogOut size={20} />
                                <span className="ml-3 font-medium">Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <MobileNavItem 
                                to="/login" 
                                icon={<LogIn size={20} />} 
                                label="Login" 
                                isActive={location.pathname === '/login'}
                            />
                            <MobileNavItem 
                                to="/register" 
                                icon={<UserPlus size={20} />} 
                                label="Register" 
                                isActive={location.pathname === '/register'}
                            />
                        </>
                    )}

                    {/* Mobile Dark Mode Toggle */}
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {isDarkMode ? (
                                    <Moon className="text-gray-500 dark:text-gray-300" size={20} />
                                ) : (
                                    <Sun className="text-yellow-600" size={20} />
                                )}
                                <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                                    Dark Mode
                                </span>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <nav className={`hidden md:flex fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50 
                transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700
                ${isExpanded ? 'w-64' : 'w-16'} flex-col`}>
                
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
                <div className="flex flex-col py-4 space-y-2 flex-1">
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
                <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700
                    ${isExpanded ? '' : 'px-2'}`}>
                    <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                        {isExpanded && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Dark Mode
                            </span>
                        )}
                        <div className="flex items-center space-x-2">
                            {!isExpanded && (
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                    title="Toggle Dark Mode"
                                >
                                    {isDarkMode ? (
                                        <Moon className="text-gray-500 dark:text-gray-300" size={16} />
                                    ) : (
                                        <Sun className="text-yellow-600" size={16} />
                                    )}
                                </button>
                            )}
                            {isExpanded && (
                                <>
                                    {isDarkMode ? (
                                        <Moon className="text-gray-500 dark:text-gray-300" size={16} />
                                    ) : (
                                        <Sun className="text-yellow-600" size={16} />
                                    )}
                                    <button
                                        onClick={toggleDarkMode}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                            isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                isDarkMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
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
        </>
    );
}

// Desktop Navigation Item Component
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
        </Link>
    );
}

// Mobile Navigation Item Component
function MobileNavItem({ to, icon, label, isActive }) {
    return (
        <Link 
            to={to}
            className={`flex items-center px-4 py-3 transition-all duration-200
                ${isActive 
                    ? 'bg-gradient-to-r from-red-500 to-yellow-400 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
        >
            <div className="flex-shrink-0">
                {icon}
            </div>
            <span className="ml-3 font-medium">
                {label}
            </span>
        </Link>
    );
}

export default NavBar;
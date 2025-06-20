import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOngoingSeries } from '../api/api';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';
import { Calendar, Clock, Play, Star } from 'lucide-react';

function OngoingCard() {
    const [ongoingData, setOngoingData] = useState([]);
    const [countdowns, setCountdowns] = useState({});
    const { watchlist } = useMoviesSeriesContext();

    // Countdown calculation
    const calculateTimeLeft = (airdate) => {
        const now = new Date().getTime();
        const airTime = new Date(airdate).getTime();
        const difference = airTime - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds, isExpired: false };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    };

    useEffect(() => {
        const fetchAllOngoing = async () => {
            try {
                const results = await Promise.all(
                    watchlist.map(item => getOngoingSeries(item.id))
                );
                const validResults = results.filter(Boolean);
                setOngoingData(validResults);

                // Initialize countdowns
                const initialCountdowns = {};
                validResults.forEach(item => {
                    initialCountdowns[item.id] = calculateTimeLeft(item.airdate);
                });
                setCountdowns(initialCountdowns);
            } catch (error) {
                console.error('Error fetching ongoing series:', error);
            }
        };

        if (watchlist.length > 0) {
            fetchAllOngoing();
        }
    }, [watchlist]);

    // Update countdowns every second
    useEffect(() => {
        if (ongoingData.length === 0) return;

        const timer = setInterval(() => {
            const updatedCountdowns = {};
            ongoingData.forEach(item => {
                updatedCountdowns[item.id] = calculateTimeLeft(item.airdate);
            });
            setCountdowns(updatedCountdowns);
        }, 1000);

        return () => clearInterval(timer);
    }, [ongoingData]);

    if (ongoingData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
            {ongoingData.map((item, index) => {
                const countdown = countdowns[item.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
                // Determine media type (assuming TV series for ongoing shows)
                const mediaType = item.media_type || 'tv';
                
                return (
                    <div 
                        key={item.id}
                        className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl sm:shadow-2xl transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 hover:shadow-purple-500/20"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'slideInUp 0.8s ease-out forwards'
                        }}
                    >
                        {/* Backdrop Image */}
                        <div className="absolute inset-0 opacity-20 sm:opacity-30 group-hover:opacity-30 sm:group-hover:opacity-40 transition-opacity duration-500">
                            <img 
                                src={item.backdrop || item.image} 
                                alt={`${item.name} backdrop`}
                                className="w-full h-full object-cover blur-sm"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 sm:from-black/80 sm:via-black/60 sm:to-transparent"></div>
                        </div>

                        {/* Animated Background Elements */}
                        <div className="absolute inset-0 opacity-5 sm:opacity-10">
                            <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-purple-500 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-pink-500 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-700"></div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="relative flex flex-col sm:hidden p-4">
                            {/* Mobile Header with Poster and Title */}
                            <div className="flex items-start space-x-4 mb-4">
                                {/* Compact Poster */}
                                <div className="relative group/poster flex-shrink-0">
                                    <div className="relative overflow-hidden rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                                        <img 
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-28 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300">
                                            <Play className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Title and Info */}
                                <div className="flex-1 min-w-0">
                                    <Link 
                                        to={`/details/${item.id}/${mediaType}`}
                                        className="no-underline"
                                    >
                                        <h2 className="text-lg font-bold text-white mb-2 leading-tight hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all duration-500">
                                            {item.name}
                                        </h2>
                                    </Link>
                                    
                                    {/* Episode Info - Stacked */}
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                                            <Star className="w-3 h-3 text-yellow-400" />
                                            <span className="text-white font-medium text-sm">
                                                S{String(item.season).padStart(2, '0')} E{String(item.episode).padStart(2, '0')}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                                            <Calendar className="w-3 h-3 text-blue-400" />
                                            <span className="text-white/80 text-xs">
                                                {new Date(item.airdate).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Air Date */}
                            <p className="text-gray-300 text-sm mb-4 px-1">
                                Next episode: {new Date(item.airdate).toLocaleDateString('en-US', { 
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>

                            {/* Mobile Countdown Timer */}
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-3 shadow-lg backdrop-blur-sm border border-white/20">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <Clock className="w-4 h-4 text-white" />
                                    <span className="text-white font-semibold text-sm">Next Episode</span>
                                </div>
                                
                                {countdown.isExpired ? (
                                    <div className="text-center">
                                        <span className="text-green-300 font-bold text-lg animate-pulse">LIVE NOW!</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        <div className="bg-white/20 rounded-lg p-2">
                                            <div className="text-white font-bold text-sm leading-none">
                                                {countdown.days}
                                            </div>
                                            <div className="text-white/70 text-xs">Days</div>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-2">
                                            <div className="text-white font-bold text-sm leading-none">
                                                {countdown.hours}
                                            </div>
                                            <div className="text-white/70 text-xs">Hrs</div>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-2">
                                            <div className="text-white font-bold text-sm leading-none">
                                                {countdown.minutes}
                                            </div>
                                            <div className="text-white/70 text-xs">Min</div>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-2">
                                            <div className="text-white font-bold text-sm leading-none animate-pulse">
                                                {countdown.seconds}
                                            </div>
                                            <div className="text-white/70 text-xs">Sec</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop/Tablet Layout */}
                        <div className="relative hidden sm:flex flex-col md:flex-row items-center p-6 md:p-8">
                            {/* Poster Image */}
                            <div className="relative group/poster mb-6 md:mb-0 md:mr-8">
                                <div className="relative overflow-hidden rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                                    <img 
                                        src={item.image}
                                        alt={item.name}
                                        className="w-32 h-48 md:w-40 md:h-60 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300">
                                        <Play className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                
                                {/* Glow Effect */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover/poster:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                {/* Title */}
                                <Link 
                                    to={`/details/${item.id}/${mediaType}`}
                                    className="no-underline"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all duration-500">
                                        {item.name}
                                    </h2>
                                </Link>

                                {/* Episode Info */}
                                <div className="flex items-center justify-center md:justify-start space-x-4 mb-4 flex-wrap gap-2">
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        <span className="text-white font-medium">
                                            S{String(item.season).padStart(2, '0')} E{String(item.episode).padStart(2, '0')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                        <span className="text-white/80 text-sm">
                                            {new Date(item.airdate).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Air Date */}
                                <p className="text-gray-300 mb-6 text-sm sm:text-base">
                                    Next episode airs on {new Date(item.airdate).toLocaleDateString('en-US', { 
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            {/* Desktop Countdown Timer */}
                            <div className="w-full sm:w-auto sm:absolute sm:top-6 sm:right-6 md:relative md:top-0 md:right-0">
                                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl backdrop-blur-sm border border-white/20">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Clock className="w-5 h-5 text-white" />
                                        <span className="text-white font-semibold text-sm">Next Episode</span>
                                    </div>
                                    
                                    {countdown.isExpired ? (
                                        <div className="text-center">
                                            <span className="text-green-300 font-bold text-lg animate-pulse">LIVE NOW!</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 text-center min-w-[140px]">
                                            <div className="bg-white/20 rounded-lg p-2">
                                                <div className="text-white font-bold text-lg leading-none">
                                                    {countdown.days}
                                                </div>
                                                <div className="text-white/70 text-xs">Days</div>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-2">
                                                <div className="text-white font-bold text-lg leading-none">
                                                    {countdown.hours}
                                                </div>
                                                <div className="text-white/70 text-xs">Hours</div>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-2">
                                                <div className="text-white font-bold text-lg leading-none">
                                                    {countdown.minutes}
                                                </div>
                                                <div className="text-white/70 text-xs">Mins</div>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-2">
                                                <div className="text-white font-bold text-lg leading-none animate-pulse">
                                                    {countdown.seconds}
                                                </div>
                                                <div className="text-white/70 text-xs">Secs</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Gradient Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                );
            })}

            <style jsx>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

export default OngoingCard;
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function Header({ itemCount, connected, currentUser, serverTime }) {
    const [liveServerTime, setLiveServerTime] = useState(null);

    useEffect(() => {
        if (!serverTime) return;

        // initialize from server
        setLiveServerTime(serverTime);

        const interval = setInterval(() => {
            setLiveServerTime(prev => prev + 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, [serverTime]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-slate-800 via-purple-800 to-slate-900 rounded-3xl shadow-2xl p-8 md:p-10 mb-10 border border-purple-700/30 backdrop-blur-sm"
        >
            <div className="flex items-center justify-between flex-wrap gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3"
                    >
                        ⚡ Live Auction Platform
                    </motion.h1>

                    <div className="flex items-center gap-6 flex-wrap">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur"
                        >
                            <span className="text-2xl">📦</span>
                            <p className="text-gray-200 font-medium">
                                {itemCount} active auctions
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur"
                        >
                            <span
                                className={`inline-block w-3 h-3 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                                    }`}
                            />
                            <span
                                className={`font-semibold ${connected ? 'text-emerald-300' : 'text-red-300'
                                    }`}
                            >
                                {connected ? 'Connected' : 'Disconnected'}
                            </span>
                        </motion.div>

                        {liveServerTime && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm text-gray-300 bg-white/10 px-4 py-2 rounded-lg backdrop-blur"
                            >
                                🕒 {new Date(liveServerTime).toLocaleTimeString()}
                            </motion.p>
                        )}
                    </div>
                </div>

                {currentUser && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="bg-gradient-to-br from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl shadow-2xl border border-cyan-300/30"
                    >
                        <p className="text-sm text-cyan-100 font-medium">👤 Bidding as</p>
                        <p className="text-2xl font-bold text-white">
                            {currentUser.name}
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default Header;

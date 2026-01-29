import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function CountdownTimer({ endTime, serverTimeOffset = 0 }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = Date.now() + serverTimeOffset;
            const remaining = Math.max(0, endTime - now);
            setTimeLeft(remaining);
        };

        calculateTimeLeft();

        const interval = setInterval(calculateTimeLeft, 100);

        return () => clearInterval(interval);
    }, [endTime, serverTimeOffset]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    };

    const getColorClass = () => {
        const seconds = Math.floor(timeLeft / 1000);
        if (seconds <= 0) return 'text-gray-500';
        if (seconds <= 30) return 'text-red-500 font-bold animate-pulse';
        if (seconds <= 60) return 'text-orange-500 font-semibold';
        return 'text-emerald-600 font-semibold';
    };

    const getBackgroundClass = () => {
        const seconds = Math.floor(timeLeft / 1000);
        if (seconds <= 0) return 'bg-gray-100';
        if (seconds <= 30) return 'bg-red-100/50';
        if (seconds <= 60) return 'bg-orange-100/50';
        return 'bg-emerald-100/50';
    };

    if (timeLeft <= 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${getColorClass()} ${getBackgroundClass()} px-3 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition-all duration-300`}
            >
                ✓ Ended
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${getColorClass()} ${getBackgroundClass()} px-3 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition-all duration-300`}
        >
            <span className="text-lg">⏱️</span>
            <span>{formatTime(timeLeft)}</span>
        </motion.div>
    );
}

export default CountdownTimer;
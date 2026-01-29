import { motion } from 'framer-motion';

function StatusBadge({ status }) {
    const badges = {
        winning: {
            text: '🏆 Winning',
            className: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg',
            animation: { scale: [1, 1.1, 1], transition: { duration: 1, repeat: Infinity } },
        },
        outbid: {
            text: '❌ Outbid',
            className: 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg',
            animation: { x: [0, -3, 3, 0], transition: { duration: 0.4, repeat: Infinity } },
        },
        active: {
            text: '🔴 Live',
            className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg',
            animation: { opacity: [1, 0.7, 1], transition: { duration: 1, repeat: Infinity } },
        },
    };

    const badge = badges[status] || badges.active;

    return (
        <motion.span
            animate={badge.animation}
            className={`px-4 py-2 rounded-full text-xs font-bold ${badge.className}`}
        >
            {badge.text}
        </motion.span>
    );
}

export default StatusBadge;
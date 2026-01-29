import { motion } from 'framer-motion';

function UserSelector({ users, currentUser, onSelectUser }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 mb-10 border border-slate-700/50"
        >
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6"
            >
                👤 Select Your Bidding Identity
            </motion.h2>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                {users.map((user) => (
                    <motion.button
                        key={user.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onSelectUser(user)}
                        className={`p-4 rounded-xl font-bold transition-all duration-300 border-2 ${currentUser?.id === user.id
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg border-blue-400'
                                : 'bg-slate-700 text-gray-200 hover:bg-slate-600 border-slate-600 hover:border-blue-500'
                            }`}
                    >
                        <span className="text-lg">👤</span> {user.name}
                    </motion.button>
                ))}
            </motion.div>
        </motion.div>
    );
}

export default UserSelector;
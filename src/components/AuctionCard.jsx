import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';
import StatusBadge from './StatusBadge';

function AuctionCard({ item, status, onBid, isFlashing, serverTimeOffset }) {
    const handleBidClick = () => {
        const bidAmount = item.currentBid + 10;
        onBid(item.id, bidAmount);
    };

    const flashClass = isFlashing === 'green' ? 'flash-green' :
        isFlashing === 'red' ? 'flash-red' : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4 }}
            className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 ${flashClass}`}
        >
            {/* Image Section */}
            <div className="relative h-56 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden group">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1 line-clamp-2 hover:text-blue-600 transition-colors">
                        {item.title}
                    </h3>
                    <StatusBadge status={status} />
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                    {item.description}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-5 mb-5">
                    {/* Current Bid */}
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Current Bid</p>
                        <motion.div
                            key={item.currentBid}
                            initial={{ scale: 1.15, color: '#10b981' }}
                            animate={{ scale: 1, color: '#059669' }}
                            transition={{ duration: 0.4 }}
                            className="flex items-baseline gap-2"
                        >
                            <span className="text-4xl font-black text-emerald-600">
                                ${item.currentBid}
                            </span>
                            <span className="text-xs text-gray-500">USD</span>
                        </motion.div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2 mb-3">
                        <CountdownTimer
                            endTime={item.auctionEndTime}
                            serverTimeOffset={serverTimeOffset}
                        />
                    </div>

                    {/* Leading Bidder */}
                    {item.currentBidder && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg mt-3"
                        >
                            👤 <span className="font-semibold text-gray-800">{item.currentBidder}</span> is leading
                        </motion.p>
                    )}
                </div>

                {/* Bid Button */}
                <motion.button
                    whileHover={item.status === 'active' ? { scale: 1.03 } : {}}
                    whileTap={item.status === 'active' ? { scale: 0.97 } : {}}
                    onClick={handleBidClick}
                    disabled={item.status !== 'active'}
                    className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${item.status === 'active'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {item.status === 'active' ? (
                        <>
                            <span>💰</span>
                            Bid ${item.currentBid + 10}
                        </>
                    ) : (
                        <>
                            <span>✓</span>
                            Auction Ended
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
}

export default AuctionCard;
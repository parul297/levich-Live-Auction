import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getItems, getUsers, getServerTime } from './services/api';
import socketService from './services/socket';
import useAuctionStore from './store/auctionStore';
import useSocket from './hooks/useSocket';
import AuctionCard from './components/AuctionCard';
import UserSelector from './components/UserSelector';
import Header from './components/Header';

function App() {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const {
    items,
    currentUser,
    serverTimeOffset,
    connected,
    loading,
    myBids,
    flashingItems,
    setItems,
    setCurrentUser,
    setServerTimeOffset,
    setConnected,
    setLoading,
    updateItem,
    addMyBid,
    flashItem,
    getItemStatus,
  } = useAuctionStore();

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  useSocket(currentUser?.id, {
    onWelcome: (data) => {
      console.log('✅ Connected to auction platform');
      setConnected(true);
      if (data.availableUsers) {
        setUsers(data.availableUsers);
      }
    },

    onUserRegistered: (data) => {
      console.log('✅ User registered:', data.userId);
      addNotification(`Logged in as ${currentUser?.name}`, 'success');
    },

    onServerTime: (data) => {
      const offset = data.serverTime - Date.now();
      setServerTimeOffset(offset);
      console.log('⏰ Server time synced. Offset:', offset, 'ms');
    },

    onInitialData: (data) => {
      if (data.items) {
        setItems(data.items);
      }
    },

    onUpdateBid: (data) => {
      console.log('📢 Bid update:', data);

      updateItem(data.itemId, {
        currentBid: data.item.currentBid,
        currentBidder: data.item.currentBidder,
        timeRemaining: data.item.timeRemaining,
      });

      if (data.item.currentBidder === currentUser?.id) {
        flashItem(data.itemId, 'green');
        addNotification(`You're winning ${data.item.title}!`, 'success');
      } else {
        flashItem(data.itemId, 'red');
      }
    },

    onBidAccepted: (data) => {
      console.log('✅ Bid accepted:', data);
      addNotification('Bid placed successfully!', 'success');
      addMyBid(data.itemId, data.amount);
    },

    onBidError: (data) => {
      console.log('❌ Bid error:', data.error);
      addNotification(data.error, 'error');
    },

    onOutbid: (data) => {
      console.log('😞 Outbid on:', data.itemTitle);
      addNotification(`You were outbid on ${data.itemTitle}!`, 'warning');
      flashItem(data.itemId, 'red');
    },

    onAuctionEnded: (data) => {
      console.log('⏰ Auction ended:', data);
      const item = items.find((i) => i.id === data.itemId);
      if (item) {
        updateItem(data.itemId, {
          status: 'ended',
          currentBidder: data.winner,
          currentBid: data.finalPrice,
        });
        
        if (data.winner === currentUser?.id) {
          addNotification(`🎉 You won ${item.title}!`, 'success');
        }
      }
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [itemsData, usersData, timeData] = await Promise.all([
          getItems(),
          getUsers(),
          getServerTime(),
        ]);

        setItems(itemsData.data || []);
        setUsers(usersData.data || []);

        const offset = timeData.serverTime - Date.now();
        setServerTimeOffset(offset);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectUser = (user) => {
    setCurrentUser(user);
    if (socketService.isConnected()) {
      socketService.registerUser(user.id);
    }
  };

  const handleBid = (itemId, amount) => {
    if (!currentUser) {
      addNotification('Please select a user first!', 'warning');
      return;
    }

    console.log(`Placing bid: $${amount} on item ${itemId}`);
    socketService.placeBid(itemId, amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-purple-600/30 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="h-20 w-20 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Loading Auctions...</h2>
          <p className="text-gray-400 mt-2">Connecting to live auction platform</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header
          itemCount={items.length}
          connected={connected}
          currentUser={currentUser}
          serverTime={Date.now() + serverTimeOffset}
        />

        {!currentUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <UserSelector
              users={users}
              currentUser={currentUser}
              onSelectUser={handleSelectUser}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AuctionCard
                item={item}
                status={getItemStatus(item.id)}
                onBid={handleBid}
                isFlashing={flashingItems[item.id]}
                serverTimeOffset={serverTimeOffset}
              />
            </motion.div>
          ))}
        </div>

        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-16 text-center border border-purple-600/30 backdrop-blur-sm"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">No Active Auctions</p>
            <p className="text-gray-400 mt-2">Check back soon for exciting new items!</p>
          </motion.div>
        )}
      </div>

      {/* Notification Toast Area */}
      <div className="fixed bottom-20 right-4 space-y-3 z-50 max-w-sm">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 400, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border ${notification.type === 'success'
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-400/30'
              : notification.type === 'error'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400/30'
                : notification.type === 'warning'
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white border-yellow-400/30'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-400/30'
              }`}
          >
            <p className="font-semibold">{notification.message}</p>
          </motion.div>
        ))}
      </div>

      {/* Connection Status Indicator (Bottom Left)*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <div className={`flex items-center gap-3 backdrop-blur-md px-5 py-3 rounded-full shadow-2xl border ${connected ? 'bg-emerald-900/80 border-emerald-400/30' : 'bg-red-900/80 border-red-400/30'}`}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`}
          />
          <span className={`text-sm font-semibold ${connected ? 'text-emerald-300' : 'text-red-300'}`}>
            {connected ? '🟢 Live' : '🔴 Offline'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
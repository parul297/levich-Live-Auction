import { create } from 'zustand';

const useAuctionStore = create((set, get) => ({
    items: [],
    currentUser: null,
    serverTimeOffset: 0,
    connected: false,
    loading: true,
    error: null,
    myBids: {},
    flashingItems: {},

    setItems: (items) => set({ items, loading: false }),

    updateItem: (itemId, updates) => set((state) => ({
        items: state.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
        ),
    })),

    setCurrentUser: (user) => set({ currentUser: user }),

    setServerTimeOffset: (offset) => set({ serverTimeOffset: offset }),

    setConnected: (connected) => set({ connected }),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    addMyBid: (itemId, amount) => set((state) => ({
        myBids: { ...state.myBids, [itemId]: amount },
    })),

    flashItem: (itemId, type) => {
        set((state) => ({
            flashingItems: { ...state.flashingItems, [itemId]: type },
        }));

        setTimeout(() => {
            set((state) => {
                const newFlashing = { ...state.flashingItems };
                delete newFlashing[itemId];
                return { flashingItems: newFlashing };
            });
        }, 600);
    },

    getItemStatus: (itemId) => {
        const state = get();
        const item = state.items.find((i) => i.id === itemId);
        if (!item) return 'active';

        const myBid = state.myBids[itemId];
        if (!myBid) return 'active';

        if (item.currentBidder === state.currentUser?.id) {
            return 'winning';
        }

        if (myBid && item.currentBid > myBid) {
            return 'outbid';
        }

        return 'active';
    },

    getServerTime: () => {
        const offset = get().serverTimeOffset;
        return Date.now() + offset;
    },
}));

export default useAuctionStore;
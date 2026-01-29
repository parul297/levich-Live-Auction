const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

class SocketService {
    constructor() {
        this.ws = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return this.ws;
        }

        try {
            this.ws = new WebSocket(WS_URL);

            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.reconnectAttempts = 0;
                this.emit('connect');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 Received:', data.type, data);
                    this.emit(data.type, data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('❌ WebSocket disconnected');
                this.emit('disconnect');
                this.handleReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.emit('error', error);
            };

            return this.ws;
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            return null;
        }
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach((callback) => {
                callback(data);
            });
        }
    }

    send(type, data = {}) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type, ...data });
            this.ws.send(message);
            console.log('📤 Sent:', type, data);
        } else {
            console.warn('WebSocket not connected. Message not sent:', type);
        }
    }

    registerUser(userId) {
        this.send('REGISTER_USER', { userId });
    }

    placeBid(itemId, amount) {
        this.send('BID_PLACED', { itemId, amount });
    }

    getItems() {
        this.send('GET_ITEMS');
    }

    getServerTime() {
        this.send('GET_SERVER_TIME');
    }

    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

const socketService = new SocketService();

export default socketService;
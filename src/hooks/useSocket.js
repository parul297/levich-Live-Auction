import { useEffect, useRef } from 'react';
import socketService from '../services/socket';

function useSocket(userId, callbacks = {}) {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = socketService.connect();

        if (userId) {
            socketService.registerUser(userId);
        }

        if (callbacks.onUpdateBid) {
            socketService.on('UPDATE_BID', callbacks.onUpdateBid);
        }

        if (callbacks.onBidAccepted) {
            socketService.on('BID_ACCEPTED', callbacks.onBidAccepted);
        }

        if (callbacks.onBidError) {
            socketService.on('BID_ERROR', callbacks.onBidError);
        }

        if (callbacks.onOutbid) {
            socketService.on('OUTBID', callbacks.onOutbid);
        }

        if (callbacks.onServerTime) {
            socketService.on('SERVER_TIME', callbacks.onServerTime);
        }

        if (callbacks.onInitialData) {
            socketService.on('INITIAL_DATA', callbacks.onInitialData);
        }

        if (callbacks.onWelcome) {
            socketService.on('WELCOME', callbacks.onWelcome);
        }

        if (callbacks.onUserRegistered) {
            socketService.on('USER_REGISTERED', callbacks.onUserRegistered);
        }

        socketService.getServerTime();

        return () => {
            if (callbacks.onUpdateBid) {
                socketService.off('UPDATE_BID', callbacks.onUpdateBid);
            }
            if (callbacks.onBidAccepted) {
                socketService.off('BID_ACCEPTED', callbacks.onBidAccepted);
            }
            if (callbacks.onBidError) {
                socketService.off('BID_ERROR', callbacks.onBidError);
            }
            if (callbacks.onOutbid) {
                socketService.off('OUTBID', callbacks.onOutbid);
            }
            if (callbacks.onServerTime) {
                socketService.off('SERVER_TIME', callbacks.onServerTime);
            }
            if (callbacks.onInitialData) {
                socketService.off('INITIAL_DATA', callbacks.onInitialData);
            }
            if (callbacks.onWelcome) {
                socketService.off('WELCOME', callbacks.onWelcome);
            }
            if (callbacks.onUserRegistered) {
                socketService.off('USER_REGISTERED', callbacks.onUserRegistered);
            }
        };
    }, [userId]);

    return socketRef;
}

export default useSocket;

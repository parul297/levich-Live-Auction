import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getItems = async () => {
    try {
        const response = await api.get('/api/items');
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

export const getItem = async (itemId) => {
    try {
        const response = await api.get(`/api/items/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching item:', error);
        throw error;
    }
};

export const getServerTime = async () => {
    try {
        const response = await api.get('/api/time');
        return response.data;
    } catch (error) {
        console.error('Error fetching server time:', error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get('/api/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export default api;
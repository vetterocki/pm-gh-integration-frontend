import api from './api';

const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('currentUser', JSON.stringify(response.data.teamMember)); // <-- FIXED
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    getCurrentUser: () => {
        try {
            const user = sessionStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error('Invalid JSON in sessionStorage for currentUser:', e);
            sessionStorage.removeItem('currentUser');
            return null;
        }
    },


    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('currentUser');
    }
};

export default authService;

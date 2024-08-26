// store/modules/auth.js
import axios from 'axios';
import axiosClient from '../axios';

const authData = {
    namespaced: true,
    state() {
        return {
            user: null,
            userRole: localStorage.getItem('userRole') || '',
            token: localStorage.getItem('token') || '',
            tokenExpire: localStorage.getItem('tokenExpire') || '',
            status: '',
            errors: {}
        };
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        authRole: (state) => state.userRole,
        AuthStatus: (state) => state.status,
        authErrors: (state) => state.errors
    },

    actions: {
        async login({ commit }, user) {
            try {
                const response = await axiosClient.post('/login', user);
                const { data } = response;

                commit('setToken', data.token);
                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

                commit('setUserRole', data.role);
                commit('setUser', data.user);
                commit('setStatus', 'success');
            } catch (error) {
                commit('setStatus', 'error');
                commit('setErrors', error.response.data.error);
            }
        },

        async register({ commit }, formData) {
            try {
                const response = await axiosClient.post('/register', formData);
                const { data } = response;

                commit('setToken', data.token);
                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

                commit('setUserRole', data.role);
                commit('setUser', data.user);
                commit('setStatus', 'success');
                
            } catch (error) {
                commit('setStatus', 'error');
                commit('setErrors', error.response.data.error);
            }
        },

        logout({ commit }) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('tokenExpire');
            delete axios.defaults.headers.common['Authorization'];
            commit('setUser', null);
            commit('setUserRole', null);
            commit('setStatus', '');
        }
    },

    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);

            const expirationTime = Date.now() + 30 * 60 * 1000; // 10 minutes in milliseconds
            localStorage.setItem('tokenExpire', expirationTime);
        },
        setUser(state, user) {
            state.user = user;
        },
        setUserRole(state, role) {
            state.userRole = role;
            localStorage.setItem('userRole', role);
        },
        setStatus(state, status) {
            state.status = status;
        },
        setErrors(state, errors) {
            state.errors = errors;
        }
    }
};

export default authData;

// store/modules/auth.js
import axios from 'axios';
import axiosClient from '../axios';

const product = {
    namespaced: true,
    state() {
        return {
            products: [],
            pagination: {},
            loading: false,
            errors: null
        };
    },

    getters: {
        products: (state) => state.products,
        pagination: (state) => state.pagination,
        loading: (state) => state.loading,
        errors: (state) => state.errors
    },

    actions: {
        async fetchProducts({ commit }, page) {
            commit('SET_LOADING', true);

            try {
                const response = await axiosClient.get(`/admin/products?page=${page}`);
                commit('SET_PRODUCTS', response.data.payload);
            } catch (error) {
                console.error(error);
                commit('SET_ERRORS', error);
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async saveProduct({ commit }, formData) {
            try {
         
                const response = await axiosClient.post('/admin/products/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                commit('SET_PRODUCTS', response.data.payload);
                return response.data;

            } catch (error) {
                commit('SET_ERRORS', error);
                console.error('Error saving product:', error);
                throw error; // Rethrow error to handle in the component
            }
        },

        async updateProduct({ commit }, formData) {
            try {
              
                const response = await axiosClient.post('/admin/products/update', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                commit('SET_PRODUCTS', response.data.payload);
                return response.data;

            } catch (error) {

                commit('SET_ERRORS', error);
                console.error('Error updating product:', error);
                throw error;
            }
        },

        async deleteProduct({ commit }, productId) {
            try {
              
                const response = await axiosClient.delete(`/admin/products/delete/${productId}`);

                commit('SET_PRODUCTS', response.data.payload);
                return response.data;

            } catch (error) {

                commit('SET_ERRORS', error);
                console.error('Error updating product:', error);
                throw error;
            }
        },
    },

    mutations: {
        SET_PRODUCTS(state, payload) {
            state.products = payload.data;
            state.pagination = {
                current_page: payload.current_page,
                last_page: payload.last_page,
                per_page: payload.per_page,
                total: payload.total,
                next_page_url: payload.next_page_url,
                prev_page_url: payload.prev_page_url
            };
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERRORS(state, errors) {
            state.errors = errors;
        }
    }
};

export default product;

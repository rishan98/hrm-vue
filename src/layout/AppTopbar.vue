<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo"> </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="logoutUser">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useLayout } from '@/layout/composables/layout';
import { mapActions } from 'vuex';

const { onMenuToggle } = useLayout();

export default {
    methods: {
        ...mapActions('authData', ['logout']), // Maps the logout action to this.logout method

        logoutUser() {
            this.logout(); // Calls the logout action
            this.$router.push('/auth/login'); // Redirects to the login page after logout
        }
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <div v-if="authErrors && authErrors.length > 0" class="text-red-500 mb-4">
                        <ul v-if="Array.isArray(authErrors)">
                            <li v-for="(error, index) in authErrors" :key="index">{{ error }}</li>
                        </ul>
                        <p v-else>{{ authErrors }}</p>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <Button label="Sign In" class="w-full" @click="login()"></Button>

                        <div>
                            <router-link to="/auth/register">
                                <button class="btn btn-success">Regsiter now......</button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';

export default {
    data() {
        return {
            email: '',
            password: '',
            errors: [],
            isSubmitting: false
        };
    },
    computed: {
        ...mapGetters('authData', ['authErrors'])
    },
    methods: {
        async login() {
            if (this.isSubmitting) return; // Prevent multiple submissions

            this.isSubmitting = true;
            this.errors = [];

            try {
                await this.$store.dispatch('authData/login', { email: this.email, password: this.password });

                const isAuthenticated = this.$store.getters['authData/isAuthenticated'];

                if (isAuthenticated) {

                    if(this.$store.getters['authData/authRole'] == "admin") {
                        this.$router.push('/');
                    } else {
                        this.$router.push('/user/dashboard');
                    }
                    
                }
            } catch (error) {
                this.errors = this.$store.getters['authData/authErrors'];
            } finally {
                this.isSubmitting = false;
            }
        }
    }
};
</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>

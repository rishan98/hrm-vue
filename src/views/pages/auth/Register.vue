<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <span class="text-muted-color font-medium">Register to continue</span>
                    </div>

                    <div v-if="authErrors && authErrors.length > 0" class="text-red-500 mb-4">
                        <ul v-if="Array.isArray(authErrors)">
                            <li v-for="(error, index) in authErrors" :key="index">{{ error }}</li>
                        </ul>
                        <p v-else>{{ authErrors }}</p>
                    </div>

                    <div>
                        <!-- Name Field -->
                        <label for="name1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Name</label>
                        <InputText id="name1" type="text" placeholder="Your Name" class="w-full md:w-[30rem] mb-8" v-model="name" />

                        <!-- Email Field -->
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <!-- Phone Field -->
                        <label for="phone1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Phone</label>
                        <InputText id="phone1" type="text" placeholder="Phone number" class="w-full md:w-[30rem] mb-8" v-model="phone" />

                        <!-- Password Field -->
                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-8" fluid :feedback="false"></Password>

                        <Button label="Register" class="w-full" @click="register()"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            email: '',
            password: '',
            phone: '',
            name: '',
            errors: [],
            isSubmitting: false
        };
    },
    computed: {
        ...mapGetters('authData', ['authErrors'])
    },
    methods: {
        async register() {
            if (this.isSubmitting) return;

            this.isSubmitting = true;
            this.errors = [];

            const formData = new FormData();
            formData.append('name', this.name);
            formData.append('email', this.email);
            formData.append('phone', this.phone);
            formData.append('password', this.password);
            formData.append('role_id', 2);

            try {
                await this.$store.dispatch('authData/register', formData);

                const isAuthenticated = this.$store.getters['authData/isAuthenticated'];

                if (isAuthenticated) {
                    this.$router.push('/');
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

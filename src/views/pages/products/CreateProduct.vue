<template>
    <div class="product-create">
        <h2>Create Product</h2>
        <form @submit.prevent="submitForm">
            <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

            <div>
                <label for="product_name">Product Name</label>
                <input v-model="product_name" type="text" id="product_name" required />
            </div>

            <div>
                <label for="description">Description</label>
                <textarea v-model="description" id="description" required></textarea>
            </div>

            <div>
                <label for="price">Price</label>
                <input v-model="price" type="number" id="price" required />
            </div>

            <div>
                <label for="category">Category</label>
                <select v-model="category" id="category" required>
                    <option value="1">Available</option>
                    <option value="0">Upcoming</option>
                </select>
            </div>

            <div>
                <label for="status">Status</label>
                <select v-model="status" id="status" required>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>
            </div>

            <div>
                <label for="image">Product Image</label>
                <input @change="handleFileUpload" type="file" id="image" accept="image/*" required />
            </div>

            <button type="submit">Create Product</button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
// import { Swal } from 'sweetalert2';

export default {
    data() {
        return {
            product_name: '',
            description: '',
            price: '',
            category: '',
            status: '1',
            image: null,
            errorMessage: ''
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.image = file;
            }
        },

        ...mapActions('product', ['saveProduct']),
        async submitForm() {
            const formData = new FormData();
            formData.append('product_name', this.product_name);
            formData.append('description', this.description);
            formData.append('price', this.price);
            formData.append('category', this.category);
            formData.append('status', this.status);
            if (this.image) {
                formData.append('image', this.image);
            }

            try {
                await this.saveProduct(formData);

                this.productName = '';
                this.description = '';
                this.price = '';
                this.category = '';
                this.status = '1';

                this.$router.push('/products');

            } catch (error) {

                this.errorMessage = 'Failed to save product. Please try again.';
            }
        }
    }
};
</script>

<style scoped>
.error {
    color: red;
}

.product-create {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.product-create h2 {
    text-align: center;
    margin-bottom: 20px;
}

.product-create form div {
    margin-bottom: 15px;
}

.product-create label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.product-create input,
.product-create select,
.product-create textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.product-create button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.product-create button:hover {
    background-color: #0056b3;
}
</style>

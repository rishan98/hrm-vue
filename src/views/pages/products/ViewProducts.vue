<template>
    <div class="product-list">
        <div v-if="errors" class="text-red-500">{{ errors }}</div>

        <div>
            <router-link to="/create-product">
                <button class="btn">Create Product</button>
            </router-link>
        </div>

        <DataTable
            :value="products"
            :paginator="false"
            :loading="loading"
            v-model:filters="filters1"
            filterDisplay="menu"
            :globalFilterFields="['product_name', 'description', 'price', 'category', 'status']"
            showGridlines
            :rows="pagination.per_page"
            @page="onPageChange"
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters1.global.value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>

            <!-- Image Column -->
            <Column header="Image">
                <template #body="{ data }">
                    <img :src="imageUrl(data.image)" alt="Product Image" class="w-16 h-16 object-cover rounded" />
                </template>
            </Column>

            <Column field="product_name" header="Product Name"></Column>

            <Column field="description" header="Description"></Column>
            <Column field="price" header="Price"></Column>

            <!-- Category Column with Tag -->
            <Column header="Category">
                <template #body="{ data }">
                    <Tag :value="data.category === 1 ? 'Available' : 'Upcoming'" :severity="data.category === 1 ? 'success' : 'danger'" />
                </template>
            </Column>

            <!-- Status Column with Tag -->
            <Column header="Status">
                <template #body="{ data }">
                    <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="data.status === 1 ? 'success' : 'danger'" />
                </template>
            </Column>

            <!-- Edit Button Column -->
            <Column header="Actions">
                <template #body="{ data }">
                    <button @click="editProduct(data)" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Edit</button>

                    <button @click="deleteProductBtn(data)" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </template>
            </Column>
        </DataTable>

        <div class="pagination-controls flex items-center justify-between mt-4">
            <button :disabled="!pagination.prev_page_url" @click="fetchProducts(pagination.current_page - 1)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">Previous</button>
            <span class="text-gray-700 font-semibold"> Page {{ pagination.current_page }} of {{ pagination.last_page }} </span>
            <button :disabled="!pagination.next_page_url" @click="fetchProducts(pagination.current_page + 1)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">Next</button>
        </div>

        <!-- Edit Product Modal -->
        <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h3 class="text-xl font-semibold mb-4">Edit Product</h3>
                <form @submit.prevent="submitEditForm">
                    <input type="hidden" v-model="editForm.id" />

                    <!-- Product Name -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Product Name</label>
                        <input v-model="editForm.product_name" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>

                    <!-- Description -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea v-model="editForm.description" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></textarea>
                    </div>

                    <!-- Price -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Price</label>
                        <input v-model="editForm.price" type="number" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>

                    <!-- Category (Select Input) -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Category</label>
                        <select v-model="editForm.category" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                            <option value="" disabled>Select Category</option>
                            <option value="1">Available</option>
                            <option value="0">Upcomming</option>
                        </select>
                    </div>

                    <!-- Status (Select Input) -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <select v-model="editForm.status" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                            <option value="" disabled>Select Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end space-x-2">
                        <button @click="showEditModal = false" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Product Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h3 class="text-xl font-semibold mb-4">Edit Product</h3>
                <form @submit.prevent="submitDeleteForm">
                    <input type="hidden" v-model="deleteForm.id" />

                    <!-- Buttons -->
                    <div class="flex justify-end space-x-2">
                        <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Tag from 'primevue/tag';

export default {
    data() {
        return {
            filters1: {
                global: { value: '' } 
            },
            showEditModal: false,
            showDeleteModal: false,
            editForm: {
                id: null,
                product_name: '',
                description: '',
                price: '',
                category: '', 
                status: '',
                imageFile: null
            },
            deleteForm: {
                id: null,
            }
        };
    },
    components: {
        Tag
    },
    computed: {
        ...mapGetters('product', ['products', 'pagination', 'loading', 'errors'])
    },
    methods: {
        ...mapActions('product', ['fetchProducts']),

        editProduct(product) {
            this.editForm = { ...product };
            this.showEditModal = true;
        },
        deleteProductBtn(product) {
            this.deleteForm = { ...product };
            this.showDeleteModal = true;
        },
        clearFilter() {
            this.filters1 = {
                global: { value: '' }
            };
        },
        onPageChange(event) {
            this.fetchProducts(event.page + 1);
        },
        imageUrl(imagePath) {
            const baseUrl = 'http://127.0.0.1:8000/';
            return `${baseUrl}${imagePath}`;
        },

        ...mapActions('product', ['updateProduct', 'deleteProduct']),
        async submitEditForm() {
            const formData = new FormData();
            formData.append('product_id', this.editForm.id);
            formData.append('product_name', this.editForm.product_name);
            formData.append('description', this.editForm.description);
            formData.append('price', this.editForm.price);
            formData.append('category', this.editForm.category);
            formData.append('status', this.editForm.status);

            try {
                await this.updateProduct(formData);

                this.editForm.productName = '';
                this.editForm.description = '';
                this.editForm.price = '';
                this.editForm.category = '';
                this.editForm.status = '1';

                (this.showEditModal = false), this.$router.push('/products');
            } catch (error) {
                this.errorMessage = 'Failed to update product. Please try again.';
            }
        },

        async submitDeleteForm() {

            try {

                const productId = this.deleteForm.id;

                await this.deleteProduct(productId);

                (this.showDeleteModal = false), this.$router.push('/products');

            } catch (error) {

                this.errorMessage = 'Failed to update product. Please try again.';
            }
        }
    },
    mounted() {
        this.fetchProducts();
    }
};
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

.btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
}
.btn:hover {
    background-color: #0056b3;
}
</style>

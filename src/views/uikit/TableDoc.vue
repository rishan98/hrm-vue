<!-- <script setup>
import { CustomerService } from '@/service/CustomerService';
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, reactive, ref } from 'vue';

const customers1 = ref(null);
const customers2 = ref(null);
const customers3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const balanceFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = reactive([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

function getOrderSeverity(order) {
    switch (order.status) {
        case 'DELIVERED':
            return 'success';

        case 'CANCELLED':
            return 'danger';

        case 'PENDING':
            return 'warn';

        case 'RETURNED':
            return 'info';

        default:
            return null;
    }
}

function getSeverity(status) {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        case 'renewal':
            return null;
    }
}

function getStockSeverity(product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}

onBeforeMount(() => {
    ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    CustomerService.getCustomersLarge().then((data) => {
        customers1.value = data;
        loading1.value = false;
        customers1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    CustomerService.getCustomersLarge().then((data) => (customers2.value = data));
    CustomerService.getCustomersMedium().then((data) => (customers3.value = data));

    initFilters1();
});

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
}

function expandAll() {
    expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = null;
}

function formatCurrency(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(value) {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function calculateCustomerTotal(name) {
    let total = 0;
    if (customers3.value) {
        for (let customer of customers3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
}
</script> -->

<template>
    <div class="product-list">
        <div v-if="errors" class="text-red-500">{{ errors }}</div>

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
        </DataTable>

        <div class="pagination-controls flex items-center justify-between mt-4">
            <button :disabled="!pagination.prev_page_url" @click="fetchProducts(pagination.current_page - 1)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">Previous</button>
            <span class="text-gray-700 font-semibold"> Page {{ pagination.current_page }} of {{ pagination.last_page }} </span>
            <button :disabled="!pagination.next_page_url" @click="fetchProducts(pagination.current_page + 1)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">Next</button>
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
                global: { value: '' } // Correct structure for global filter
            }
        };
    },
    components: {
        Tag // Register the Tag component
    },
    computed: {
        ...mapGetters('product', ['products', 'pagination', 'loading', 'errors'])
    },
    methods: {
        ...mapActions('product', ['fetchProducts']),
        clearFilter() {
            this.filters1 = {
                global: { value: '' }
            }; // Reset local filters
        },
        onPageChange(event) {
            this.fetchProducts(event.page + 1); // Fetch the next set of products
        },
        imageUrl(imagePath) {
            const baseUrl = 'http://127.0.0.1:8000/';
            return `${baseUrl}${imagePath}`;
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
</style>

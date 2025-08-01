<template>
    <Toolbar class="mb-6">
        <template #start>
            <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew({})" />
        </template>

        <template #end>
            <Button icon="pi pi-refresh" rounded raised @click="reloadData" />
        </template>
    </Toolbar>
    
    <div class="card">
        <DataTable v-model:filters="filters" :value="dataList" paginator lazy :rows="10" dataKey="id"
            filterDisplay="row" :globalFilterFields="['name', 'status', 'description']"
            :rowsPerPageOptions="[10, 25, 50]" :totalRecords="totalRecords">
            <template #empty> No school years found. </template>
            <template #loading> Loading school years data. Please wait. </template>
            
            <Column field="year" header="School Year" filterField="year" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <a href="javascript:void(0)" v-on:click="openNew(data)">{{ data.year }}</a>
                    </div>
                </template>
            </Column>
            
            <Column field="opening" header="Start Date" style="min-width: 10rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ formatDate(data.opening) }}
                </template>
            </Column>
            
            <Column field="closing" header="End Date" style="min-width: 10rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ formatDate(data.closing) }}
                </template>
            </Column>
            
            <Column field="current" header="Status" filterField="current" style="min-width: 10rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <Tag :value="data.current ? 'Active' : 'Inactive'" :severity="getStatusSeverity(data.current)" />
                    </div>
                </template>
            </Column>

            <Column field="createdDate" header="Created At" filterField="createdDate" style="min-width: 15rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <DateTimeComponent :data="data.createdDate"/>
                </template>
            </Column>

            <Column field="updatedDate" header="Updated At" filterField="updatedDate" style="min-width: 15rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <DateTimeComponent :data="data.updatedDate"/>
                </template>
            </Column>
            
            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-cog" severity="info" @click="initializedModal(data)" size="small" />
                        <Button icon="pi pi-pencil" severity="info" @click="openNew(data)" size="small" />
                        <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data)" size="small" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="dialog" :style="{ width: '500px' }" header="School Year Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">School Year Name *</label>
                    <InputText id="name" v-model.trim="schoolYear.year" required="true" autofocus
                        :invalid="submitted && !schoolYear.year" fluid
                        placeholder="e.g., 2024" />
                    <small v-if="submitted && !schoolYear.year" class="text-red-500">School Year is required.</small>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="startDate" class="block font-bold mb-3">Start Date *</label>
                        <DatePicker id="startDate" v-model="schoolYear.opening" dateFormat="yy-mm-dd"
                            :invalid="submitted && !schoolYear.opening" fluid />
                        <small v-if="submitted && !schoolYear.opening" class="text-red-500">Start Date is required.</small>
                    </div>
                    
                    <div>
                        <label for="endDate" class="block font-bold mb-3">End Date *</label>
                        <DatePicker id="endDate" v-model="schoolYear.closing" dateFormat="yy-mm-dd"
                            :invalid="submitted && !schoolYear.closing" fluid />
                        <small v-if="submitted && !schoolYear.closing" class="text-red-500">End Date is required.</small>
                    </div>
                </div>
                
            </div>
            
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="hideDialog" severity="secondary" />
                <Button label="Save" icon="pi pi-check" @click="submit" />
            </template>
        </Dialog>
        
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl text-red-500" />
                <span v-if="schoolYear">Are you sure you want to delete the school year <b>{{ schoolYear.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="deleteDialog = false" severity="secondary" />
                <Button label="Yes" icon="pi pi-check" @click="deleteSchoolYear" severity="danger" />
            </template>
        </Dialog>

        <Dialog v-model:visible="initialized" :style="{ width: '500px' }" header="Initialize School Year" :modal="true">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-4 mb-4">
                    <i class="pi pi-exclamation-triangle text-3xl text-orange-500" />
                    <span v-if="initializedForm">Initialize the school year <b>{{ initializedForm.schoolYearId }}</b></span>
                </div>
                
                <div>
                    <label for="graduationDate" class="block font-bold mb-3">Graduation Date *</label>
                    <DatePicker id="graduationDate" v-model="initializedForm.graduationDate" dateFormat="yy-mm-dd"
                        :invalid="initializedSubmitted && !initializedForm.graduationDate" fluid 
                        placeholder="Select graduation date" />
                    <small v-if="initializedSubmitted && !initializedForm.graduationDate" class="text-red-500">Graduation Date is required.</small>
                </div>
                
                <div>
                    <label for="batch" class="block font-bold mb-3">Batch *</label>
                    <InputText id="batch" v-model.trim="initializedForm.batch" required="true"
                        :invalid="initializedSubmitted && !initializedForm.batch" fluid
                        placeholder="e.g., Batch 2024" />
                    <small v-if="initializedSubmitted && !initializedForm.batch" class="text-red-500">Batch is required.</small>
                </div>
            </div>
            
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="cancelInitialize" severity="secondary" />
                <Button label="Initialize" icon="pi pi-check" @click="initializedSchoolYear" severity="warning" />
            </template>
        </Dialog>
        <Toast group="tl" position="top-right" />
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';
import { useToast } from "primevue/usetoast";
import { useGlobalStore } from '@/stores/global';
import SchoolYearResponse from '@/types/school_year';
import DateTimeComponent from '@/components/DateTimeComponent.vue';

const toast = useToast();
const globalStore = useGlobalStore();

const dataList = ref([]);
const filters = ref({
    'year': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'current': { value: null, matchMode: FilterMatchMode.EQUALS },
    'description': { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const fTmp = JSON.parse(JSON.stringify(filters.value));
const loadLazyTimeout = ref(null);
const totalRecords = ref(0);
const dialog = ref(false);
const deleteDialog = ref(false);
const schoolYear = ref({});
const submitted = ref(false);
const initialized = ref(false);
const initializedForm = ref({});
const initializedSubmitted = ref(false);

const statusOptions = ref([
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
]);

onMounted(() => {
    loadData({ filters: filters.value });
});

const loadData = (filter) => {
    let model = new SchoolYearResponse();
    model.getData(filter,
        (data) => {
            dataList.value = data.data;
            totalRecords.value = data.page.totalCount;
        },
        (err) => {
            console.log(err);
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to load school years', 
                group: 'tl', 
                life: 3000 
            });
        }
    );
};

function openNew(data) {
    schoolYear.value = JSON.parse(JSON.stringify(data));
    // Convert date strings to Date objects for DatePicker
    if (schoolYear.value.opening) {
        schoolYear.value.opening = new Date(schoolYear.value.opening);
    }
    if (schoolYear.value.closing) {
        schoolYear.value.closing = new Date(schoolYear.value.closing);
    }
    submitted.value = false;
    dialog.value = true;
}

function hideDialog() {
    dialog.value = false;
    submitted.value = false;
}

function confirmDelete(data) {
    schoolYear.value = data;
    deleteDialog.value = true;
}

function deleteSchoolYear() {
    let model = new SchoolYearResponse();
    model.deleteData(schoolYear.value.id,
        (data) => {
            if (data.status == "SUCCESS") {
                toast.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: data.message, 
                    group: 'tl', 
                    life: 3000 
                });
                deleteDialog.value = false;
                schoolYear.value = {};
                loadData({ filters: filters.value });
            } else {
                toast.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: data.message, 
                    group: 'tl', 
                    life: 3000 
                });
            }
        },
        (err) => {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: err.response?.data?.message || 'Failed to delete school year', 
                group: 'tl', 
                life: 3000 
            });
        }
    );
}

const submit = () => {
    submitted.value = true;
    
    if (!schoolYear.value.year || !schoolYear.value.opening || !schoolYear.value.closing || schoolYear.value.current === undefined) {
        return;
    }
    
    // Convert Date objects to ISO strings for API
    const payload = {
        ...schoolYear.value,
        opening: schoolYear.value.opening instanceof Date ? 
            schoolYear.value.opening.toISOString().split('T')[0] : 
            schoolYear.value.opening,
        closing: schoolYear.value.closing instanceof Date ? 
            schoolYear.value.closing.toISOString().split('T')[0] : 
            schoolYear.value.closing
    };
    
    console.log('Submitting school year:', payload);

    let model = new SchoolYearResponse();
    model.sendData(payload,
        (data) => {
            if (data.status == "SUCCESS") {
                toast.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: data.message, 
                    group: 'tl', 
                    life: 3000 
                });
                hideDialog();
            } else {
                toast.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: data.message, 
                    group: 'tl', 
                    life: 3000 
                });
            }
            loadData({ filters: filters.value });
            // Refresh global school years data
            globalStore.schoolYearsLoaded = false;
            globalStore.fetchSchoolYears();
        },
        (err) => {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: err.response?.data?.message || 'Failed to save school year', 
                group: 'tl', 
                life: 3000 
            });
        }
    );
};

const reloadData = () => {
    filters.value = JSON.parse(JSON.stringify(fTmp));
    loadData({ filters: filters.value });
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};

const getStatusSeverity = (status) => {
    if (status === true) {
        return 'success';
    } else if (status === false) {
        return 'danger';
    }
    return 'secondary';
};

const initializedModal = (data) => {
    initializedForm.value = {
        schoolYearId: data.year,
        graduationDate: null,
        batch: data.year + 1
    };
    initializedSubmitted.value = false;
    initialized.value = true;
};
const cancelInitialize = () => {
    initialized.value = false;
    initializedSubmitted.value = false;
    initializedForm.value = {};
};

const initializedSchoolYear = () => {
    initializedSubmitted.value = true;
    
    // Validate required fields
    if (!initializedForm.value.graduationDate || !initializedForm.value.batch) {
        return;
    }
    
    // Prepare payload with date conversion
    const payload = {
        ...initializedForm.value,
        graduationDate: initializedForm.value.graduationDate instanceof Date ? 
            initializedForm.value.graduationDate.toISOString().split('T')[0] : 
            initializedForm.value.graduationDate
    };
    
    let model = new SchoolYearResponse();
    model.initializeSchoolYear(payload, 
        (data) => {
            if (data.status == "SUCCESS") {
                toast.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: data.message, 
                    group: 'tl', 
                    life: 3000 
                });
                cancelInitialize(); // Close the dialog and reset form on success
            } else {
                toast.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: data.message, 
                    group: 'tl', 
                    life: 3000 
                });
            }
            loadData({ filters: filters.value });
            // Refresh global school years data
            globalStore.schoolYearsLoaded = false;
            globalStore.fetchSchoolYears();
        },
        (err) => {
            console.log(err);
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: err.response?.data?.message || 'Failed to initialize school year', 
                group: 'tl', 
                life: 3000 
            });
        }
    );
};
</script>

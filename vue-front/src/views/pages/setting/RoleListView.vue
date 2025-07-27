<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import RoleResponse from './types/roles';

onMounted(() => {
    loadRoles();
});

const dialog = ref(false);

const toast = useToast();
const dt = ref();
const roles = ref();

const role = ref({});
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew(value) {
    role.value = value;
    submitted.value = false;
    dialog.value = true;
}

function hideDialog() {
    dialog.value = false;
    submitted.value = false;
}

function exportCSV() {
    dt.value.exportCSV();
}

const loadRoles = () => {
    let model = new RoleResponse();
    model.getData(filters,
        (data) => {
            roles.value = data.data
        },
        (err) => {
            console.log(err)
        })
}

const submitForm = (e) => {
    let model = new RoleResponse();
    model.saveData(role.value,
        (data) => {
            toast.add({ severity: data.status.toLowerCase(), summary: 'Successful', detail: data.message, life: 3000 });
            loadRoles();
            if (data.status == "SUCCESS") {
                hideDialog()
            }
        },
        (err) => {
            console.log(err)
            toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
            loadRoles()
        })

}

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew({})" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>
            <DataTable ref="dt" :value="roles" dataKey="id" :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Roles</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>
                <Column field="name" header="Name" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <a href="javascript:void(0)"
                            @click="() => { openNew(JSON.parse(JSON.stringify(slotProps.data))) }">{{
                                slotProps.data.name }}</a>
                    </template>
                </Column>

                <Column field="description" header="Description" sortable style="min-width: 8rem">

                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="dialog" :style="{ width: '450px' }" header="Account Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="role.name" required="true" autofocus fluid />
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <InputText id="description" v-model.trim="role.description" required="true" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="submitForm" />
            </template>
        </Dialog>

    </div>
</template>

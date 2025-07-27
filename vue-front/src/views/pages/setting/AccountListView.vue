<script setup>
import TeacherResponse from '@/types/teacher';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import AccountResponse from './types/accounts';
import RoleResponse from './types/roles';

onMounted(() => {
    loadAccounts()
    loadRoles();
});

const accounts = ref([])
const accountInfo = ref({});
const dialog = ref(false);
const teachers = ref([])

const toast = useToast();
const dt = ref();
const products = ref();
const product = ref({});
const selectedProducts = ref();
const roles = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew(value) {
    accountInfo.value = value;
    submitted.value = false;
    dialog.value = true;

    loadTeachers();
}

function hideDialog() {
    dialog.value = false;
    submitted.value = false;
}


function exportCSV() {
    dt.value.exportCSV();
}

const loadAccounts = () => {
    let model = new AccountResponse();
    model.getData(filters,
        (data) => {
            accounts.value = data.data
        },
        (err) => {

        })
}

const loadRoles = () => {
    let model = new RoleResponse();
    model.getData(filters,
        (data) => {
            console.log(data.data)
            roles.value = data.data

            roles.value = data.data.map(cls => cls.name);
        },
        (err) => {
            console.log(err)
        })
}


const loadTeachers = () => {
    if (teachers.value.length == 0) {
        let model = new TeacherResponse();
        model.getTeachers({},
            (data) => {
                console.log(data.data)
                teachers.value = data.data
            },
            (err) => {
                console.log(err)
            })
    }
}

const submitForm = (e) => {
    let model = new AccountResponse();
    model.saveData(accountInfo.value,
        (data) => {
            console.log(data.data)
            toast.add({ severity: data.status.toLowerCase(), summary: 'Successful', detail: data.message, life: 3000 });
            loadAccounts();
            if (data.status == "SUCCESS") {
                hideDialog()
            }
        },
        (err) => {
            console.log(err)
            toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
            loadAccounts()
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

            <DataTable ref="dt" v-model:selection="selectedProducts" :value="accounts" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Accounts</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>
                <Column field="username" header="Username" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <a href="javascript:void(0)"
                            @click="() => { openNew(JSON.parse(JSON.stringify(slotProps.data))) }">{{
                                slotProps.data.username }}</a>
                    </template>
                </Column>
                <Column field="email" header="Email" sortable style="min-width: 16rem"></Column>

                <Column field="roles" header="Roles" style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ slotProps.data.roles.join(", ") }}
                    </template>
                </Column>
                <Column field="createdAt" header="Created At" sortable style="min-width: 8rem"></Column>
                <Column field="updatedAt" header="Updated At" sortable style="min-width: 10rem"></Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="dialog" :style="{ width: '450px' }" header="Account Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="username" class="block font-bold mb-3">Username</label>
                    <InputText id="username" v-model.trim="accountInfo.username" required="true" autofocus fluid />
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model.trim="accountInfo.email" required="true"
                        :invalid="submitted && !accountInfo.email" fluid />
                </div>
                <div v-if="accountInfo.id == undefined">
                    <label for="password" class="block font-bold mb-3">Password</label>
                    <InputText id="password" type="password" v-model.trim="accountInfo.password" required="true"
                        fluid />
                </div>
                <div>
                    <label for="roleId" class="block font-bold mb-3">Roles</label>

                    <MultiSelect v-model="accountInfo.roles" :options="roles" placeholder="Select Countries"
                        :filter="true">
                        <template #value="slotProps">
                            <div class="inline-flex items-center py-1 px-2 bg-primary text-primary-contrast rounded-border mr-2"
                                v-for="option of slotProps.value" :key="option.code">
                                <span :class="'mr-2 flag flag-' + option" style="width: 18px; height: 12px" />
                                <div>{{ option }}</div>
                            </div>
                            <template v-if="!slotProps.value || slotProps.value.length === 0">
                                <div class="p-1">Select Countries</div>
                            </template>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <span :class="'mr-2 flag flag-' + slotProps.option" style="width: 18px; height: 12px" />
                                <div>{{ slotProps.option }}</div>
                            </div>
                        </template>
                    </MultiSelect>
                </div>

                <div v-if="accountInfo.roles && accountInfo.roles.find(d => d == 'Teacher')">
                    <label for="accountRef" class="block font-bold mb-3">Teacher</label>
                    <Select id="accountRef" v-model="accountInfo.accountRef" :options="teachers" optionLabel="fullName"
                        optionValue="id" placeholder="Select a teacher" fluid></Select>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="submitForm" />
            </template>
        </Dialog>

    </div>
</template>

<script setup>
import TeacherResponse from '@/types/teacher';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import AccountResponse from './types/accounts';
import RoleResponse from './types/roles';

<script setup>
import TeacherResponse from '@/types/teacher';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import AccountResponse from './types/accounts';
import RoleResponse from './types/roles';

const accounts = ref([]);
const accountInfo = ref({});
const dialog = ref(false);
const deleteDialog = ref(false);
const teachers = ref([]);
const roles = ref([]);
const submitted = ref(false);
const toast = useToast();

const fTmp = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    roles: { value: null, matchMode: FilterMatchMode.IN },
    createdAt: { value: null, matchMode: FilterMatchMode.DATE_IS },
    updatedAt: { value: null, matchMode: FilterMatchMode.DATE_IS }
};

const filters = ref(fTmp);

onMounted(() => {
    loadAccounts();
    loadRoles();
});

function openNew(data) {
    accountInfo.value = data ? JSON.parse(JSON.stringify(data)) : {
        username: '',
        email: '',
        password: '',
        roles: [],
        accountRef: null
    };
    submitted.value = false;
    dialog.value = true;
    loadTeachers();
}

function confirmDelete(data) {
    accountInfo.value = data;
    deleteDialog.value = true;
}

function deleteAccount() {
    let model = new AccountResponse();
    model.deleteData(accountInfo.value.id,
        (data) => {
            toast.add({ 
                severity: 'success', 
                summary: 'Successful', 
                detail: 'Account deleted successfully', 
                life: 3000 
            });
            deleteDialog.value = false;
            accountInfo.value = {};
            loadAccounts();
        },
        (err) => {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: err.message || 'Failed to delete account', 
                life: 3000 
            });
        })
}

function hideDialog() {
    dialog.value = false;
    submitted.value = false;
    accountInfo.value = {};
}

const reloadData = () => {
    filters.value = fTmp;
    loadAccounts();
}

function exportCSV() {
    // Implement CSV export functionality
    console.log('Export CSV functionality');
}

const loadAccounts = () => {
    let model = new AccountResponse();
    model.getData(filters,
        (data) => {
            accounts.value = data.data
        },
        (err) => {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to load accounts', 
                life: 3000 
            });
        })
}

const loadRoles = () => {
    let model = new RoleResponse();
    model.getData(filters,
        (data) => {
            console.log(data.data)
            roles.value = data.data.map(cls => cls.name);
        },
        (err) => {
            console.log(err)
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to load roles', 
                life: 3000 
            });
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
                toast.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to load teachers', 
                    life: 3000 
                });
            })
    }
}

const validateForm = () => {
    submitted.value = true;
    
    if (!accountInfo.value.username || !accountInfo.value.email) {
        toast.add({ 
            severity: 'warn', 
            summary: 'Validation Error', 
            detail: 'Please fill in required fields', 
            life: 3000 
        });
        return false;
    }
    
    if (!accountInfo.value.id && !accountInfo.value.password) {
        toast.add({ 
            severity: 'warn', 
            summary: 'Validation Error', 
            detail: 'Password is required for new accounts', 
            life: 3000 
        });
        return false;
    }
    
    if (!accountInfo.value.roles || accountInfo.value.roles.length === 0) {
        toast.add({ 
            severity: 'warn', 
            summary: 'Validation Error', 
            detail: 'Please select at least one role', 
            life: 3000 
        });
        return false;
    }
    
    return true;
}

const submitForm = () => {
    if (!validateForm()) {
        return;
    }

    let model = new AccountResponse();
    model.saveData(accountInfo.value,
        (data) => {
            console.log(data.data)
            toast.add({ 
                severity: data.status.toLowerCase(), 
                summary: 'Successful', 
                detail: data.message, 
                life: 3000 
            });
            loadAccounts();
            if (data.status == "SUCCESS") {
                hideDialog()
            }
        },
        (err) => {
            console.log(err)
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: err.message || 'Failed to save account', 
                life: 3000 
            });
        })
}

</script>

<template>
    <div>
        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew({})" />
            </template>

            <template #end>
                <Button icon="pi pi-refresh" class="mr-2" rounded raised @click="reloadData" />
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <div class="card">
            <DataTable v-model:filters="filters" :value="accounts" paginator lazy :rows="10" dataKey="id"
                filterDisplay="row" :totalRecords="accounts.length" 
                :rowsPerPageOptions="[10, 25, 50]">
                <template #empty> No accounts found. </template>
                <template #loading> Loading accounts data. Please wait. </template>
                
                <Column field="username" header="Username" filterField="username" :showFilterMenu="false" :sortable="true">
                    <template #body="{ data }">
                        <a href="javascript:void(0)" @click="openNew(data)">{{ data.username }}</a>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                            placeholder="Search by username" />
                    </template>
                </Column>
                
                <Column field="email" header="Email" filterField="email" :showFilterMenu="false" :sortable="true">
                    <template #body="{ data }">
                        <div class="flex items-center gap-2">
                            <span>{{ data.email }}</span>
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                            placeholder="Search by email" />
                    </template>
                </Column>

                <Column field="roles" header="Roles" filterField="roles" :showFilterMenu="false" :sortable="true">
                    <template #body="{ data }">
                        <div class="flex gap-1 flex-wrap">
                            <Tag v-for="role in data.roles" :key="role" :value="role" severity="info" />
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <MultiSelect v-model="filterModel.value" :options="roles" 
                            placeholder="Select Roles" @change="filterCallback()" :showClear="true" 
                            style="max-width: 12rem" />
                    </template>
                </Column>

                <Column field="createdAt" header="Created At" filterField="createdAt" :showFilterMenu="false" :sortable="true">
                    <template #body="{ data }">
                        <span>{{ formatDate(data.createdAt) }}</span>
                    </template>
                </Column>

                <Column field="updatedAt" header="Updated At" filterField="updatedAt" :showFilterMenu="false" :sortable="true">
                    <template #body="{ data }">
                        <span>{{ formatDate(data.updatedAt) }}</span>
                    </template>
                </Column>

                <Column header="Actions" :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <Button icon="pi pi-pencil" severity="info" rounded @click="openNew(data)" />
                            <Button icon="pi pi-trash" severity="danger" rounded @click="confirmDelete(data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Account Form Dialog -->
        <Dialog v-model:visible="dialog" :style="{ width: '500px' }" header="Account Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="username" class="block font-bold mb-3">Username *</label>
                    <InputText 
                        id="username" 
                        v-model.trim="accountInfo.username" 
                        required 
                        autofocus 
                        fluid 
                        :invalid="submitted && !accountInfo.username"
                    />
                    <small v-if="submitted && !accountInfo.username" class="text-red-500">Username is required.</small>
                </div>
                
                <div>
                    <label for="email" class="block font-bold mb-3">Email *</label>
                    <InputText 
                        id="email" 
                        type="email"
                        v-model.trim="accountInfo.email" 
                        required
                        fluid 
                        :invalid="submitted && !accountInfo.email"
                    />
                    <small v-if="submitted && !accountInfo.email" class="text-red-500">Email is required.</small>
                </div>
                
                <div v-if="!accountInfo.id">
                    <label for="password" class="block font-bold mb-3">Password *</label>
                    <Password 
                        id="password" 
                        v-model="accountInfo.password" 
                        :feedback="false"
                        fluid 
                        :invalid="submitted && !accountInfo.password"
                    />
                    <small v-if="submitted && !accountInfo.password" class="text-red-500">Password is required.</small>
                </div>
                
                <div>
                    <label for="roles" class="block font-bold mb-3">Roles *</label>
                    <MultiSelect 
                        id="roles"
                        v-model="accountInfo.roles" 
                        :options="roles" 
                        placeholder="Select Roles"
                        :filter="true"
                        fluid
                        :invalid="submitted && (!accountInfo.roles || accountInfo.roles.length === 0)"
                    >
                        <template #value="slotProps">
                            <div class="flex gap-1 flex-wrap" v-if="slotProps.value && slotProps.value.length">
                                <Tag v-for="role of slotProps.value" :key="role" :value="role" severity="info" />
                            </div>
                            <span v-else class="text-muted-color">Select Roles</span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <i class="pi pi-users mr-2"></i>
                                <span>{{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                    <small v-if="submitted && (!accountInfo.roles || accountInfo.roles.length === 0)" class="text-red-500">
                        Please select at least one role.
                    </small>
                </div>

                <div v-if="accountInfo.roles && accountInfo.roles.includes('Teacher')">
                    <label for="accountRef" class="block font-bold mb-3">Teacher Reference</label>
                    <Select 
                        id="accountRef" 
                        v-model="accountInfo.accountRef" 
                        :options="teachers" 
                        optionLabel="fullName"
                        optionValue="id" 
                        placeholder="Select a teacher" 
                        fluid
                        :filter="true"
                    />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="submitForm" />
            </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm Deletion" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-red-500" style="font-size: 2rem"></i>
                <span>Are you sure you want to delete <b>{{ accountInfo.username }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" severity="secondary" @click="deleteDialog = false" />
                <Button label="Yes" icon="pi pi-check" severity="danger" @click="deleteAccount" />
            </template>
        </Dialog>

        <Toast position="top-right" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from '@primevue/core/api';
import { formatDate } from '../../../const';
import { getAccounts, createAccount, updateAccount, deleteAccountAPI } from '../../../api/ajax';

// Reactive data
const toast = useToast();
const accounts = ref([]);
const teachers = ref([]);
const roles = ref(['Administrator', 'Student', 'Teacher']);
const dialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);

// Form data
const accountInfo = ref({
    id: null,
    username: '',
    email: '',
    password: '',
    roles: [],
    accountRef: null
});

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    roles: { value: null, matchMode: FilterMatchMode.IN }
});

// Methods
const loadData = async () => {
    try {
        const response = await getAccounts();
        if (response.success) {
            accounts.value = response.data;
        } else {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to load accounts', 
                life: 3000 
            });
        }
    } catch (error) {
        console.error('Error loading accounts:', error);
        toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to load accounts', 
            life: 3000 
        });
    }
};

const reloadData = () => {
    loadData();
    toast.add({ 
        severity: 'success', 
        summary: 'Refreshed', 
        detail: 'Data reloaded successfully', 
        life: 3000 
    });
};

const openNew = (data) => {
    if (data && Object.keys(data).length > 0) {
        // Edit mode
        accountInfo.value = { ...data };
    } else {
        // Create mode
        accountInfo.value = {
            id: null,
            username: '',
            email: '',
            password: '',
            roles: [],
            accountRef: null
        };
    }
    submitted.value = false;
    dialog.value = true;
};

const hideDialog = () => {
    dialog.value = false;
    submitted.value = false;
};

const validateForm = () => {
    const errors = [];
    
    if (!accountInfo.value.username?.trim()) {
        errors.push('Username is required');
    }
    
    if (!accountInfo.value.email?.trim()) {
        errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(accountInfo.value.email)) {
        errors.push('Email format is invalid');
    }
    
    if (!accountInfo.value.id && !accountInfo.value.password?.trim()) {
        errors.push('Password is required for new accounts');
    }
    
    if (!accountInfo.value.roles || accountInfo.value.roles.length === 0) {
        errors.push('At least one role must be selected');
    }
    
    return errors;
};

const submitForm = async () => {
    submitted.value = true;
    
    const errors = validateForm();
    if (errors.length > 0) {
        toast.add({ 
            severity: 'error', 
            summary: 'Validation Error', 
            detail: errors.join(', '), 
            life: 5000 
        });
        return;
    }

    try {
        let response;
        if (accountInfo.value.id) {
            // Update existing account
            response = await updateAccount(accountInfo.value.id, accountInfo.value);
        } else {
            // Create new account
            response = await createAccount(accountInfo.value);
        }

        if (response.success) {
            toast.add({ 
                severity: 'success', 
                summary: 'Successful', 
                detail: `Account ${accountInfo.value.id ? 'updated' : 'created'} successfully`, 
                life: 3000 
            });
            hideDialog();
            await loadData();
        } else {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: response.message || 'Failed to save account', 
                life: 3000 
            });
        }
    } catch (error) {
        console.error('Error saving account:', error);
        toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to save account', 
            life: 3000 
        });
    }
};

const confirmDelete = (data) => {
    accountInfo.value = { ...data };
    deleteDialog.value = true;
};

const deleteAccount = async () => {
    try {
        const response = await deleteAccountAPI(accountInfo.value.id);
        if (response.success) {
            deleteDialog.value = false;
            toast.add({ 
                severity: 'success', 
                summary: 'Successful', 
                detail: 'Account deleted successfully', 
                life: 3000 
            });
            await loadData();
        } else {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to delete account', 
                life: 3000 
            });
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete account', 
            life: 3000 
        });
    }
};

const exportCSV = () => {
    const csvData = accounts.value.map(account => ({
        username: account.username,
        email: account.email,
        roles: account.roles.join('; '),
        createdAt: formatDate(account.createdAt),
        updatedAt: formatDate(account.updatedAt)
    }));
    
    // Convert to CSV format
    const headers = ['Username', 'Email', 'Roles', 'Created At', 'Updated At'];
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => Object.values(row).map(field => `"${field}"`).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'accounts_export.csv';
    link.click();
    
    toast.add({ 
        severity: 'success', 
        summary: 'Exported', 
        detail: 'Accounts exported successfully', 
        life: 3000 
    });
};

// Load data on component mount
onMounted(() => {
    loadData();
});
</script>
<template>
    <Toolbar class="mb-6">
        <template #start>
            <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2"
                @click="() => { dialog = true; teacher = {} }" />
        </template>

        <template #end>
            <Button icon="pi pi-refresh" rounded raised @click="reloadData" />
        </template>
    </Toolbar>
    <div class="card">
        <DataTable v-model:filters="filters" :value="teachers" paginator lazy :rows="10" dataKey="id"
            filterDisplay="row" :globalFilterFields="['employeeNo', 'firstName', 'lastName', 'contactNo', 'position']"
            @lazyLoad="loadCarsLazy" @page="onPage" @filter="loadCarsLazy" @sort="loadCarsLazy"
            :rowsPerPageOptions="[10, 25, 50]" :totalRecords="totalRecords">

            <template #empty> No teachers found. </template>
            <template #loading> Loading teachers data. Please wait. </template>
            <Column field="" header="Avatar" style="min-width: 1rem" :showFilterMenu="false" :sortable="false">
                <template #body="{ data }">

                    <Avatar v-on:click="() => { dialog = true; teacher = data }"
                        :label="data.firstName ? data.firstName.substring(0, 1).toUpperCase() : ''" class="mr-2"
                        :style="{ 'cursor': 'pointer', 'background-color': primaryColors[Math.floor(Math.random() * primaryColors.length)].palette['900'], color: '#ffffff' }"
                        shape="circle"></Avatar>

                </template>
            </Column>
            <Column field="employeeNo" header="Employee No" style="min-width: 12rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ data.employeeNo }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Employee No" />
                </template>
            </Column>
            <Column field="firstName" header="First Name" style="min-width: 12rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ data.firstName }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by First Name" />
                </template>
            </Column>
            <Column field="lastName" header="Last Name" filterField="lastName" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.lastName }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Last Name" />
                </template>
            </Column>
            <Column field="contactNo" header="Contact No" filterField="contactNo" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.contactNo }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Contact No" />
                </template>
            </Column>

            <Column field="position" header="Position" filterField="position" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.position }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Position" />
                </template>
            </Column>

            <Column header="Action" style="min-width: 3rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <Button label="Academic" icon="pi pi-search" severity="primary" class="mr-2"
                            @click="async () => { router.push('/teacher/index?teacher=' + data.id) }" />
                    </div>
                </template>
            </Column>

        </DataTable>

        <TeacherFormView v-if="dialog" :dialog="dialog" :teacher="teacher" @onClose="onClose"></TeacherFormView>
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

import { primaryColors } from '@/const';
import router from '@/router';
import TeacherResponse from '@/types/teacher';
import TeacherFormView from './forms/TeacherFormView.vue';

const fTmp = {
    employeeNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    contactNo: { value: null, matchMode: FilterMatchMode.IN },
    position: { value: null, matchMode: FilterMatchMode.EQUALS },
    action: { value: null, matchMode: FilterMatchMode.EQUALS }
}

const teachers = ref([]);
const filters = ref(fTmp);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)
const dialog = ref(false)
const teacher = ref({})

onMounted(() => {
    // Get the data from the server
    loadTeachers({})
});

function onPage(event) {
    loadTeachers(event)
}

function loadCarsLazy(event) {
    if (loadLazyTimeout.value) {
        clearTimeout(loadLazyTimeout.value);
    }

    loadLazyTimeout.value = setTimeout(() => {
        loadTeachers(event)
    }, Math.random() * 1000 + 250);
}

const loadTeachers = (filter) => {
    let model = new TeacherResponse()
    model.getTeachers(filter,
        (data) => {
            teachers.value = data.data;
            totalRecords.value = data.page.totalCount;
        },
        (err) => {
            console.log(err)
        })
}

const reloadData = () => {
    filters.value = fTmp;
    loadTeachers({
        filters: filters.value
    })
}


function onClose() {
    dialog.value = false
    loadTeachers({ filters: filters.value })
}


</script>

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
            filterDisplay="row" :globalFilterFields="['employeeNo', 'firstName', 'lastName', 'contactNo', 'position']"
            @lazyLoad="loadCarsLazy" @page="onPage" @filter="loadCarsLazy" @sort="loadCarsLazy"
            :totalRecords="totalRecords">
            <template #empty> No teachers found. </template>
            <template #loading> Loading teachers data. Please wait. </template>
            <Column field="yearLevel" header="Grade level" filterField="yearLevel" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <a href="javascript:void(0)" v-on:click="openNew(data)">{{ data.yearLevel }}</a>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Contact No" />
                </template>
            </Column>
            <Column field="code" header="Section Code" style="min-width: 12rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <a href="javascript:void(0)" @click="openNew(data)">{{ data.code }}</a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Employee No" />
                </template>
            </Column>
            <Column field="name" header="Section Name" style="min-width: 12rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by First Name" />
                </template>
            </Column>
            <Column field="adviser" header="Adviser" filterField="adviser" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.adviser }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Last Name" />
                </template>
            </Column>


            <Column field="schoolYear" header="School Year" filterField="schoolYear" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.schoolYear }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Position" />
                </template>
            </Column>

        </DataTable>


        <Dialog v-model:visible="dialog" :style="{ width: '450px' }" header="Section Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="yearLevel" class="block font-bold mb-3">Year Level</label>
                    <Select v-model.trim="section.yearLevelId" :options="yearLevels" :showClear="true"
                        optionLabel="name" optionValue="id" class="w-full"></Select>
                    <small v-if="submitted && !section.yearLevel" class="text-red-500">Year Level is required.</small>
                </div>
                <div>
                    <label for="code" class="block font-bold mb-3">Section Code</label>
                    <InputText id="code" v-model.trim="section.code" required="true" autofocus
                        :invalid="submitted && !section.name" fluid />
                    <small v-if="submitted && !section.code" class="text-red-500">Code is required.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Section Name</label>
                    <InputText id="name" v-model.trim="section.name" required="true" autofocus
                        :invalid="submitted && !section.name" fluid />
                    <small v-if="submitted && !section.name" class="text-red-500">Name is required.</small>
                </div>

                <div>
                    <label for="adviser" class="block font-bold mb-3">Adviser {{ section.adviser }}</label>
                    <Select v-model.trim="section.adviserId" :options="teachers" :showClear="true"
                        optionLabel="fullName" optionValue="id" class="w-full"></Select>
                    <small v-if="submitted && !section.adviserId" class="text-red-500">Adviser is required.</small>
                </div>

                <div>
                    <label for="name" class="block font-bold mb-3">School Year</label>
                    <InputText id="name" v-model.trim="section.schoolYear" fluid />
                </div>


            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="submit" />
            </template>
        </Dialog>

        <Toast position="top-right" group="tl" />
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

import { useToast } from "primevue/usetoast";

const toast = useToast();

import { useGlobalStore } from '@/stores/global';
import SectionResponse from '@/types/section';
import TeacherResponse from '@/types/teacher';
import YearLevelResponse from '@/types/year_level';

const fTmp = {
    code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    adviser: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    schoolYear: { value: useGlobalStore().appConfig.schoolYear, matchMode: FilterMatchMode.IN },
    yearLevel: { value: null, matchMode: FilterMatchMode.EQUALS }
}
const dataList = ref([]);
const filters = ref(fTmp);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)
const dialog = ref(false);
const section = ref({});
const submitted = ref(false);
const teachers = ref([])
const yearLevels = ref([])
onMounted(() => {
    // Get the data from the server
    loadData({ filters: filters.value })
});

function onPage(event) {
    loadData(event)
}

function loadCarsLazy(event) {
    if (loadLazyTimeout.value) {
        clearTimeout(loadLazyTimeout.value);
    }

    loadLazyTimeout.value = setTimeout(() => {
        loadData(event)
    }, Math.random() * 1000 + 250);
}

const loadData = (filter) => {
    let model = new SectionResponse()
    model.getData(filter,
        (data) => {
            dataList.value = data.data;
            totalRecords.value = data.page.totalCount;
        },
        (err) => {
            console.log(err)
        })
}

const fetchTechers = () => {
    let model = new TeacherResponse()
    model.getTeachers({ rows: 1000 },
        (data) => teachers.value = data.data,
        (err) => console.log(err))
}


const fetchYearLevels = () => {
    let model = new YearLevelResponse()
    model.getData({ rows: 1000 },
        (data) => yearLevels.value = data.data,
        (err) => console.log(err))
}

function openNew(data) {
    section.value = JSON.parse(JSON.stringify(data));
    submitted.value = false;
    dialog.value = true;
    fetchTechers();
    fetchYearLevels();
}

function hideDialog() {
    dialog.value = false;
    submitted.value = false;
}

function saveProduct() {
    submitted.value = true;
}

const reloadData = () => {
    filters.value = fTmp;
    loadData({
        filters: filters.value
    })
}

const submit = () => {
    let model = new SectionResponse()
    model.sendData(section.value,
        (data) => {
            if (data.status == "SUCCESS") {
                toast.add({ severity: 'success', summary: 'Success', detail: data.message, group: 'tl', life: 3000 });
                hideDialog()
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: data.message, group: 'tl', life: 3000 });
            }
            loadData({
                filters: filters.value
            })
        },
        (err) => toast.add({ severity: 'error', summary: 'Error', detail: err.response.data.message, group: 'tl', life: 3000 }))
}

</script>

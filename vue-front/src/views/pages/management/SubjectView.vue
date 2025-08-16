<template>
    <Toolbar class="mb-6">
        <template #start>
            <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2"
                @click="() => { dialog = true; subject = {} }" />
        </template>

        <template #end>
            <Button icon="pi pi-refresh" rounded raised @click="reloadData" />
        </template>
    </Toolbar>

    <div class="card">
        <DataTable v-model:filters="filters" :value="dataList" paginator lazy :rows="10" dataKey="id"
            filterDisplay="row" @lazyLoad="loadCarsLazy" @page="onPage" @filter="loadCarsLazy" @sort="loadCarsLazy"
            :rowsPerPageOptions="[10, 25, 50]" :totalRecords="totalRecords">
            <template #empty> No teachers found. </template>
            <template #loading> Loading teachers data. Please wait. </template>
            <Column field="code" header="Subject Code" style="min-width: 12rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <a href="javascript:void(0)"
                        v-on:click="() => { dialog = true; subject = JSON.parse(JSON.stringify(data)) }">{{ data.code ?? 'N/A'
                        }}</a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by subject code" />
                </template>
            </Column>
            <Column field="name" header="Subject Name" style="min-width: 12rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="units" header="Subject Units" style="min-width: 12rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ data.units }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="number" @input="filterCallback()"
                        placeholder="Search by units" />
                </template>
            </Column>
            <Column field="yearLevel" header="Class or Course" filterField="yearLevel" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.yearLevel }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by grade level" />
                </template>
            </Column>

            <Column field="active" header="Status" filterField="active"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <i class="pi" :class="{ 'pi-check-circle text-green-500 ': data.active, 'pi-times-circle text-red-500': !data.active }"></i>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    
                <Select v-model="filterModel.value" :options="[{'val' : 'true', 'name' : 'Active'}, {'val' : 'false', 'name' : 'Inactive'}]" optionValue="val" optionLabel="name" placeholder="Select" @change="filterCallback()" />
                </template>
            </Column>


            

            <Column field="createdDate" header="Created At" sortable style="min-width: 13rem">
                <template #body="{ data }">
                    <DateTimeComponent :data="data.createdDate"></DateTimeComponent>
                </template>
            </Column>
            <Column field="updatedDate" header="Updated At" sortable style="min-width: 13rem">
                <template #body="{ data }">
                    <DateTimeComponent :data="data.updatedDate"></DateTimeComponent>
                </template>
            </Column>

        </DataTable>


        <SubjectFormView v-if="dialog" :dialog="dialog" :subject="subject" @onClose="onClose"></SubjectFormView>
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

import SubjectResponse from '@/types/subject';
import SubjectFormView from './forms/SubjectFormView.vue';
import DateTimeComponent from '@/components/DateTimeComponent.vue';


const fTmp = {
    code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    units: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    yearLevel: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    active: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
}

const dialog = ref(false)
const dataList = ref([]);
const filters = ref(fTmp);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)
const subject = ref({})

onMounted(() => {
    // Get the data from the server
    loadSubjects({})
});

function onPage(event) {
    loadSubjects(event)
}

function loadCarsLazy(event) {
    if (loadLazyTimeout.value) {
        clearTimeout(loadLazyTimeout.value);
    }

    loadLazyTimeout.value = setTimeout(() => {
        loadSubjects(event)
    }, Math.random() * 1000 + 250);
}

const loadSubjects = (filter) => {
    let model = new SubjectResponse()
    model.getData(filter,
        (data) => {
            dataList.value = data.data;
            totalRecords.value = data.page.totalCount;
        })
}

const reloadData = () => {
    filters.value = fTmp;
    loadSubjects({
        filters: filters.value
    })
}

function onClose() {
    dialog.value = false
    loadSubjects({ filters: filters.value })
}


</script>

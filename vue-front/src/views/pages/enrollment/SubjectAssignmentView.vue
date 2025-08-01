<template>
    <Toolbar class="mb-6">
        <template #start>
            <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew(null)" />
        </template>

        <template #end>
            <Button icon="pi pi-refresh" class="mr-2" rounded raised @click="reloadData" />
            <Button label="Export" icon="pi pi-upload" severity="secondary" class="mr-2" @click="exportCSV($event)" />
        </template>
    </Toolbar>
    <div class="card">

        <DataTable v-model:filters="filters" :value="dataList" paginator lazy :rows="10" dataKey="id"
            filterDisplay="row" @lazyLoad="loadCarsLazy" @page="onPage" @filter="loadCarsLazy" @sort="loadCarsLazy"
            :rowsPerPageOptions="[10, 25, 50]" :totalRecords="totalRecords">
            <template #empty> No teachers found. </template>
            <template #loading> Loading teachers data. Please wait. </template>
            <Column field="code" header="Code" :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <a href="javascript:void(0)" @click="data.locked ? null : openNew(data) ">{{ data.code }}</a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText style="max-width: 7rem" v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Code" />
                </template>
            </Column>
            <Column field="subjectCode" header="Subject Code" :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    {{ data.subjectCode }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText style="max-width: 10rem" v-model="filterModel.value" type="text"
                        @input="filterCallback()" placeholder="Subject Code" />
                </template>
            </Column>
            <Column field="subject.units" header="Units" style="max-width: 8rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ data.units }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText style="max-width: 6rem" v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by units" />
                </template>
            </Column>
            <Column field="adviser" header="Adviser" filterField="adviser" :showFilterMenu="false" :sortable="true">
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
            <Column field="yearLevel" header="Class or Course" filterField="yearLevel" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.yearLevel }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Contact No" />
                </template>
            </Column>

            <Column field="section" header="Section" filterField="section" :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.section }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Contact No" />
                </template>
            </Column>

            <Column field="schoolYear" header="School Year" filterField="schoolYear" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.schoolYear }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select v-model="filterModel.value" :options="schoolYears" 
                        optionLabel="year" optionValue="year" @change="filterCallback()"
                        placeholder="Select School Year" :showClear="true" style="max-width: 12rem" />
                </template>
            </Column>


            <Column field="room" header="Room" filterField="room" :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.room }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Position" />
                </template>
            </Column>

            <Column field="startTime" header="Start Time" filterField="startTime" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.startTime }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText style="max-width: 7rem" v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Position" />
                </template>
            </Column>


            <Column field="endTime" header="End Time" filterField="endTime" :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.endTime }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText style="max-width: 7rem" v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Position" />
                </template>
            </Column>

            <Column field="locked" header="Editable" filterField="locked" :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <i class="pi" :class="{ 'pi-check-circle text-green-500 ': !data.locked, 'pi-times-circle text-red-500': data.locked }"></i>
                    </div>
                </template>
               
            </Column>

        </DataTable>

        <SubjectAssignmentFormView v-if="dialog" :dialog="dialog" :subject="subject" @onClose="onClose">
        </SubjectAssignmentFormView>

        <Toast position="top-right" group="tl" />

    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, computed } from 'vue';

import { useGlobalStore } from '@/stores/global';
import SubjectCodeResponse from '@/types/subject_code';
import SubjectAssignmentFormView from './SubjectAssignmentFormView.vue';

const globalStore = useGlobalStore();

const fTmp = {
    code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    subjectCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    adviser: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    schoolYear: { value: useGlobalStore().appConfig.schoolYear, matchMode: FilterMatchMode.IN },
    yearLevel: { value: null, matchMode: FilterMatchMode.EQUALS },
    room: { value: null, matchMode: FilterMatchMode.EQUALS },
    startTime: { value: null, matchMode: FilterMatchMode.EQUALS },
    endTime: { value: null, matchMode: FilterMatchMode.EQUALS },
    section: { value: null, matchMode: FilterMatchMode.EQUALS },
    createdDate: { value: null, matchMode: FilterMatchMode.EQUALS },
    updatedDate: { value: null, matchMode: FilterMatchMode.EQUALS },
    'subject.units': { value: null, matchMode: FilterMatchMode.EQUALS },
    locked: { value: null, matchMode: FilterMatchMode.EQUALS },

}
const dataList = ref([]);
const filters = ref(fTmp);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)
const dialog = ref(false);
const subject = ref({});

// Use computed to get school years from global store
const schoolYears = computed(() => globalStore.schoolYears);

onMounted(() => {
    loadData({ filters: filters.value });
    // Ensure school years are loaded if not already
    if (!globalStore.schoolYearsLoaded) {
        globalStore.fetchSchoolYears();
    }
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
    let model = new SubjectCodeResponse()
    model.getData(filter,
        (data) => {
            dataList.value = data.data;
            totalRecords.value = data.page.totalCount;
        },
        (err) => {
            console.log(err)
        })
}


function openNew(data) {
    subject.value = data;
    dialog.value = true;
}

function onClose() {
    dialog.value = false
    loadData({ filters: filters.value })
}

const reloadData = () => {
    filters.value = fTmp;
    loadData({
        filters: filters.value
    })
}

</script>

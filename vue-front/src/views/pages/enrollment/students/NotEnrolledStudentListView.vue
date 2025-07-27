<template>
    <DataTable v-model:selection="selectedStudent" v-model:filters="filters" :value="students" paginator lazy :rows="10"
        dataKey="id" filterDisplay="row" @lazyLoad="loadCarsLazy" @page="onPage" @filter="loadCarsLazy" @sort="onPage"
        :totalRecords="totalRecords" tableStyle="min-width: 20rem">
        <template #empty> No students found. </template>
        <template #loading> Loading students data. Please wait. </template>
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="student.studentId" header="Student ID" style="min-width: 12rem" :showFilterMenu="false"
            :sortable="true">
            <template #body="{ data }">
                {{ data.student.studentId }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by name" />
            </template>
        </Column>
        <Column field="student.lrn" header="LRN" style="min-width: 12rem" :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                {{ data.student.lrn }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by name" />
            </template>
        </Column>
        <Column field="student.firstName" filterField="student.firstName" header="First Name" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                {{ data.student.firstName }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by name" />
            </template>
        </Column>
        <Column field="student.lastName" header="Last Name" filterField="student.lastName" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.student.lastName }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by last name" />
            </template>
        </Column>
        <Column field="schoolYear" header="SchoolYear" filterField="schoolYear" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.schoolYear }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by school year" />


            </template>
        </Column>
        <Column field="yearLevel" header="Year Level" filterField="yearLevel" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.yearLevel }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by year level" />
            </template>
        </Column>
        <Column field="student.gender" header="Gender" filterField="student.gender" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.student.gender }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <Select v-model="filterModel.value" @change="filterCallback()" :options="genders"
                    placeholder="Search by Gender" style="min-width: 12rem" :showClear="true" optionLabel="name"
                    optionValue="code"></Select>
            </template>
        </Column>

        <Column field="student.birthday" header="Birthday" filterField="student.birthday" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.student.birthday }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <DatePicker v-model="filterModel.value" @date-select="filterCallback()" dateFormat="dd/mm/yy"
                    placeholder="Search by Birthday" />
            </template>
        </Column>

        <Column field="student.contactNumber" header="Contact Number" filterField="student.contactNumber"
            style="min-width: 12rem" :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.student.contactNumber }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by country" />
            </template>
        </Column>

    </DataTable>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';


const emit = defineEmits(['onSelect']);

import { genders } from '@/const';
import { useGlobalStore } from '@/stores/global';
import EnrollmentResponse from '@/types/enrollment';
const route = useRoute();


const students = ref([]);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)
const selectedStudent = ref([])
const fTmp = {
    'student.studentId': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.lrn': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.firstName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.lastName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.middleName': { value: null, matchMode: FilterMatchMode.IN },
    'student.gender': { value: null, matchMode: FilterMatchMode.EQUALS },
    'student.birthday': { value: null, matchMode: FilterMatchMode.EQUALS },
    'student.contactNumber': { value: null, matchMode: FilterMatchMode.EQUALS },
    'student.status': { value: "OPEN", matchMode: FilterMatchMode.EQUALS },
    yearLevel: { value: null, matchMode: FilterMatchMode.EQUALS },
    schoolYear: { value: useGlobalStore().appConfig.schoolYear, matchMode: FilterMatchMode.EQUALS },

}
const filters = ref(fTmp);

onMounted(() => {
    // Get the data from the server
    loadStudents({ filters: filters.value })

    console.log(selectedStudent.value, 'mounted')

});


// Expose the function to parent
defineExpose({
    reloadData
});


watch(selectedStudent, (newVal, oldVal) => {
    console.log(`count changed from ${oldVal.length} to ${newVal.length}`);
    emit('onSelect', newVal);
});


function onPage(event) {
    loadStudents(event)
}

function loadCarsLazy(event) {
    if (loadLazyTimeout.value) {
        clearTimeout(loadLazyTimeout.value);
    }

    loadLazyTimeout.value = setTimeout(() => {
        loadStudents(event)
    }, Math.random() * 1000 + 250);
}

const loadStudents = (filter) => {
    let model = new EnrollmentResponse()
    model.getData(filter,
        (data) => {
            students.value = data.data;
            totalRecords.value = data.page.totalCount;
        },
        (err) => {
            console.log(err)
        })
}


function reloadData() {
    filters.value = fTmp;
    selectedStudent.value = [];
    loadStudents({
        filters: filters.value
    })
}


</script>

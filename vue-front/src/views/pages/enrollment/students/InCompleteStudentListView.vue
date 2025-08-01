<template>
    <DataTable v-model:filters="filters" :value="students" paginator lazy :rows="10" dataKey="id2" filterDisplay="row"
        @lazyLoad="loadCarsLazy" @page="onPage" @filter="loadCarsLazy" @sort="onPage" :totalRecords="totalRecords"
        tableStyle="min-width: 20rem" :rowsPerPageOptions="[10, 25, 50]">
        <template #empty> No students found. </template>
        <template #loading> Loading students data. Please wait. </template>
        <Column field="student.lrn" header="LRN" style="min-width: 12rem" :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                {{ data.student.lrn }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by lrn" />
            </template>
        </Column>
        <Column field="student.firstName" header="First Name" style="min-width: 12rem" :showFilterMenu="false"
            :sortable="true">
            <template #body="{ data }">
                {{ data.student.firstName }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by first name" />
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
        <Column field="yearLevel" header="Class or Course" filterField="yearLevel" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.yearLevel }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by section" />
            </template>
        </Column>
        <Column field="section" header="Section" filterField="section" style="min-width: 12rem" :showFilterMenu="false"
            :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.section }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by section" />
            </template>
        </Column>
        <Column field="adviser" header="Adviser" filterField="adviser" style="min-width: 12rem" :showFilterMenu="false"
            :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.adviser }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by adviser" />
            </template>
        </Column>

        <Column field="enrollmentDate" header="Enrolled Date" filterField="enrollmentDate" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.enrollmentDate }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by enrolled date" />
            </template>
        </Column>
        <Column field="student.gender" header="Gender" filterField="student.gender" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <GenderComponent :data="data.student.gender"></GenderComponent>
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
                    placeholder="Search by contact no" />
            </template>
        </Column>

    </DataTable>
</template>

<script setup lang="ts">
import GenderComponent from '@/components/GenderComponent.vue';
import { genders } from '@/const';
import EnrollmentResponse from '@/types/enrollment';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

const students = ref([]);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)
const fTmp = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.lrn': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.firstName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.lastName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.middleName': { value: null, matchMode: FilterMatchMode.IN },
    'student.gender': { value: null, matchMode: FilterMatchMode.EQUALS },
    'student.birthday': { value: null, matchMode: FilterMatchMode.EQUALS },
    'student.contactNumber': { value: null, matchMode: FilterMatchMode.EQUALS },
    'status': { value: "INCOMPLETE", matchMode: FilterMatchMode.EQUALS },
    section: { value: null, matchMode: FilterMatchMode.EQUALS },
    enrollmentDate: { value: null, matchMode: FilterMatchMode.EQUALS },
    adviser: { value: null, matchMode: FilterMatchMode.EQUALS },
    yearLevel: { value: null, matchMode: FilterMatchMode.EQUALS },

}
const filters = ref(fTmp);


// Expose the function to parent
defineExpose({
    reloadData
});

onMounted(() => {
    // Get the data from the server
    loadStudents({ filters: filters.value })
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
    loadStudents({
        filters: filters.value
    })
}

</script>

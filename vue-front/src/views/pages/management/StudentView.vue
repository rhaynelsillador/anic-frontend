<template>

    <Toolbar class="mb-6">
        <template #start>
            <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="newStudent" />
        </template>

        <template #end>
            <Button icon="pi pi-refresh" rounded raised @click="reloadData" />

        </template>
    </Toolbar>
    <div class="card">
        <DataTable v-model:filters="filters" :value="students" paginator lazy :rows="10" dataKey="id"
            filterDisplay="row" @lazyLoad="loadCarsLazy" @page="onPage" @filter="loadCarsLazy" @sort="onPage"
            :totalRecords="totalRecords">
            <template #empty> No students found. </template>
            <template #loading> Loading students data. Please wait. </template>

            <Column field="studentId" header="Avatar" style="min-width: 5rem" :showFilterMenu="false" :sortable="false">
                <template #body="{ data }">
                    <Avatar @click="() => { router.push('/enrollment/student?id=' + data.id) }"
                        :label="data.firstName ? data.firstName.substring(0, 1).toUpperCase() : ''" class="mr-2"
                        :style="{ 'cursor': 'pointer', 'background-color': primaryColors[Math.floor(Math.random() * primaryColors.length)].palette['900'], color: '#ffffff' }"
                        shape="circle"></Avatar>
                </template>
            </Column>

            <Column field="studentId" header="Student ID" style="max-width: 10rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ data.studentId }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText style="max-width: 7rem" v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by student id" />
                </template>
            </Column>
            <Column field="lrn" header="LRN" style="min-width: 12rem" :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    {{ data.lrn }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by lrn" />
                </template>
            </Column>
            <Column field="firstName" header="First Name" style="min-width: 12rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    {{ data.firstName }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by first name" />
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
                        placeholder="Search by last name" />
                </template>
            </Column>
            <Column field="gender" header="Gender" filterField="gender" style="max-width: 10rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.gender }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select style="max-width: 8rem" v-model="filterModel.value" @change="filterCallback()"
                        :options="genders" placeholder="Search by Gender" :showClear="true" optionLabel="name"
                        optionValue="code">
                    </Select>
                </template>
            </Column>

            <Column field="birthday" header="Birthday" filterField="birthday" style="min-width: 10rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.birthday }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <DatePicker v-model="filterModel.value" @date-select="filterCallback()" dateFormat="dd/mm/yy"
                        placeholder="Search by birthday" />
                </template>
            </Column>

            <Column field="contactNumber" header="Contact Number" filterField="contactNumber" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.contactNumber }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by contact No" />
                </template>
            </Column>
            <Column field="status" header="Status" filterField="status" style="max-width: 10rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusLabel(data.status)" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select v-model="filterModel.value" @change="filterCallback()" :options="studentStatus"
                        placeholder="Search by status" style="max-width: 8rem" :showClear="true" optionLabel="name"
                        optionValue="code"></Select>
                </template>
            </Column>

            <Column field="information.batch" header="Batch" filterField="information.batch" style="min-width: 12rem"
                :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.information ? data.information.batch : '' }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by batch" />
                </template>
            </Column>

            <Column field="information.graduated" header="Graduated" filterField="information.graduated"
                style="min-width: 12rem" :showFilterMenu="false" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.information ? data.information.graduated : '' }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by graduated" />
                </template>
            </Column>

        </DataTable>
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

import { genders, primaryColors, studentStatus } from '@/const';
import StudentResponse from '@/types/student';
import { useRouter } from 'vue-router';


const router = useRouter();
const students = ref([]);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)

const fTmp = {
    studentId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lrn: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    middleName: { value: null, matchMode: FilterMatchMode.IN },
    gender: { value: null, matchMode: FilterMatchMode.EQUALS },
    birthday: { value: null, matchMode: FilterMatchMode.EQUALS },
    contactNumber: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    'information.graduated': { value: null, matchMode: FilterMatchMode.EQUALS },
    'information.batch': { value: null, matchMode: FilterMatchMode.EQUALS }
}

const filters = ref(fTmp);

onMounted(() => {
    // Get the data from the server
    loadStudents({})
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
    let model = new StudentResponse()
    model.getData(filter,
        (data) => {
            students.value = data.data;
            totalRecords.value = data.page.totalCount;
        },
        (err) => {
            console.log(err)
        })
}

const reloadData = () => {
    console.log(fTmp)
    filters.value = fTmp;
    loadStudents({
        filters: filters.value
    })
}

const newStudent = () => {
    router.push("/enrollment/student")
}

const getStatusLabel = (status) => {
    if (status == "GRADUATED" || status == "TRANSFERRED") {
        return "info"
    } else if (status == "DROPPED" || status == "INCOMPLETE") {
        return "danger"
    }
    return "primary"
}
</script>

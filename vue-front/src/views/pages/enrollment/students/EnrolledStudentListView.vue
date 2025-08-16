<template>
    <!-- Page Header -->
    <div class="mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Enrolled Students</h2>
    </div>

    <DataTable v-model:filters="filters" :value="students" paginator lazy :rows="10" dataKey="id2" filterDisplay="row"
        @lazyLoad="loadCarsLazy" @page="onPage" @filter="loadCarsLazy" @sort="onPage" :totalRecords="totalRecords"
        :rowsPerPageOptions="[10, 25, 50]" tableStyle="min-width: 20rem">
        <template #empty> No students found. </template>
        <template #loading> Loading students data. Please wait. </template>
        
        <Column field="student.studentId" header="Avatar" style="min-width: 5rem"
            :showFilterMenu="false" :sortable="false">
            <template #body="{ data }">
                <div v-if="getStudentAvatarUrl(data)" class="flex justify-center">
                    <Avatar @click="() => { router.push('/enrollment/student/' + data.student.id) }"
                            :image="getStudentAvatarUrl(data)"
                            class="mr-2 transition-all duration-200 hover:scale-105 border-2 border-gray-200 hover:border-blue-300 cursor-pointer"
                            style="width: 40px; height: 40px;"
                            shape="circle"></Avatar>
                </div>
                <div v-else class="flex justify-center">
                    <Avatar @click="() => { router.push('/enrollment/student/' + data.student.id) }"
                            :label="data.student.firstName ? data.student.firstName.substring(0, 1).toUpperCase() : ''"
                            class="mr-2 transition-all duration-200 hover:scale-105 border-2 border-gray-200 hover:border-blue-300 cursor-pointer"
                            :style="{ 'width': '40px', 'height': '40px', 'background-color': primaryColors[data.student.id % primaryColors.length].palette['900'], color: '#ffffff' }"
                            shape="circle"></Avatar>
                </div>
            </template>
        </Column>
        <Column field="student.studentId" filterField="student.studentId" header="Student ID" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
               {{ data.student.studentId }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by student ID" />
            </template>
        </Column>
        <Column field="student.lrn" filterField="student.lrn" header="LRN" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
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
        <Column field="student.lastName" filterField="student.lastName" header="Last Name" style="min-width: 12rem"
            :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.student.lastName }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by country" />
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
                <Select v-model="filterModel.value" :options="schoolYears" 
                    optionLabel="year" optionValue="year" @change="filterCallback()"
                    placeholder="Select School Year" :showClear="true" style="max-width: 12rem" />
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
                    placeholder="Search by country" />
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
                    placeholder="Search by country" />
            </template>
        </Column>
        <Column field="section.adviser.firstName" header="Adviser" filterField="section.adviser.firstName"
            style="min-width: 12rem" :showFilterMenu="false" :sortable="true">
            <template #body="{ data }">
                <div class="flex items-center gap-2">
                    <span>{{ data.adviser }}</span>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by country" />
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
                    placeholder="Search by country" />
            </template>
        </Column>
        <Column field="student.gender" filterField="student.gender" header="Gender" style="min-width: 12rem"
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
                    placeholder="Search by country" />
            </template>
        </Column>
        <Column field="action" header="Action" :showFilterMenu="false"
            style="min-width: 12rem">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button icon="pi pi-pencil" severity="primary" text raised rounded 
                        @click="async () => {router.push('/enrollment/student?id='+data.student.id)}"
                        v-tooltip.top="'Edit Student'"
                    />
                    <Button icon="pi pi-print" severity="info" text raised rounded 
                        @click="printSingleID(data)"
                        v-tooltip.top="'Print ID'"
                    />
                </div>
            </template>
            
        </Column>

    </DataTable>

    <!-- ID Preview Dialog -->
    <Dialog 
        v-model:visible="showPreview" 
        modal 
        header="Student ID Card" 
        :style="{ width: '90vw', maxWidth: '800px' }"
        :closable="true"
        @hide="closePreview"
    >
        <IDPreview 
            v-if="showPreview && currentStudent"
            :students="[currentStudent]" 
            @close="closePreview"
        />
    </Dialog>

    <!-- Toast for notifications -->
    <Toast />
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';

import { genders, primaryColors } from '@/const';
import { useGlobalStore } from '@/stores/global';
import EnrollmentResponse from '@/types/enrollment';
import router from '@/router';
import GenderComponent from '@/components/GenderComponent.vue';
import IDPreview from '@/components/IDPreview.vue';
import { getProfilePictureUrl } from '@/config/app';

const toast = useToast();
const globalStore = useGlobalStore();
const students = ref([]);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)
const showPreview = ref(false)
const currentStudent = ref(null)
const statuses = ['MALE', 'FEMALE'];

// Helper function to get profile picture URL for enrolled students
const getStudentAvatarUrl = (studentData) => {
    const student = studentData.student;
    const photoUrl = student.profilePictureUrl || student.photoUrl;
    return getProfilePictureUrl(photoUrl);
};

// Use computed to get school years from global store
const schoolYears = computed(() => globalStore.schoolYears);
const fTmp = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.studentId': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.lrn': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.firstName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.lastName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'student.middleName': { value: null, matchMode: FilterMatchMode.IN },
    'student.gender': { value: null, matchMode: FilterMatchMode.EQUALS },
    'student.birthday': { value: null, matchMode: FilterMatchMode.EQUALS },
    'student.contactNumber': { value: null, matchMode: FilterMatchMode.EQUALS },
    // 'student.status': { value: "ENROLLED", matchMode: FilterMatchMode.EQUALS },
    status: { value: "ENROLLED", matchMode: FilterMatchMode.EQUALS },
    section: { value: null, matchMode: FilterMatchMode.EQUALS },
    enrollmentDate: { value: null, matchMode: FilterMatchMode.EQUALS },
    'section.adviser.firstName': { value: null, matchMode: FilterMatchMode.EQUALS },
    yearLevel: { value: null, matchMode: FilterMatchMode.EQUALS },
    schoolYear: { value: useGlobalStore().appConfig.schoolYear, matchMode: FilterMatchMode.EQUALS },
    action : { value: null, matchMode: FilterMatchMode.EQUALS },

}
const filters = ref(fTmp);

// Expose the function to parent
defineExpose({
    reloadData
});

onMounted(() => {
    // Get the data from the server
    loadStudents({ filters: filters.value })
    // Ensure school years are loaded if not already
    if (!globalStore.schoolYearsLoaded) {
        globalStore.fetchSchoolYears();
    }
});

const onPage = (event) => {
    loadStudents(event)
}

const loadCarsLazy = (event) => {
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
        })
}

function reloadData() {
    filters.value = fTmp;
    loadStudents({
        filters: filters.value
    })
}

// Single ID Printing Function
const printSingleID = (studentData) => {
    currentStudent.value = studentData
    showPreview.value = true
}

const closePreview = () => {
    showPreview.value = false
    currentStudent.value = null
}

</script>

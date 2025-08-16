<template>
    <Toolbar class="mb-6">
        <template #start>
            <Button label="New Student" icon="pi pi-plus" severity="primary" class="mr-2"
                @click="async () => { router.push('/enrollment/student') }" />
            <Button label="Enroll" icon="pi pi-sign-in" severity="warning" @click="enrollStudent"
                :disabled="tabIndex != 1 || (!selectedStudents || !selectedStudents.length)" />
        </template>

        <template #end>
            <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
    </Toolbar>
    <div class="card">

        <Tabs value="0">
            <TabList>
                <Tab value="0" @click="onTabChange(0)">Enrolled</Tab>
                <Tab value="1" @click="onTabChange(1)">Not Enrolled</Tab>
                <Tab value="2" @click="onTabChange(2)">Incomplete</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <EnrolledStudentListView ref="enrolledRef"></EnrolledStudentListView>
                </TabPanel>
                <TabPanel value="1">
                    <NotEnrolledStudentListView ref="notEnrolledRef" @onSelect="onSelect"></NotEnrolledStudentListView>
                </TabPanel>
                <TabPanel value="2">
                    <InCompleteStudentListView ref="incompleteStudentRef"></InCompleteStudentListView>
                </TabPanel>
            </TabPanels>
        </Tabs>


    </div>

    <StudentEnrollmentFormView v-if="dialog" :dialog="dialog" :students="selectedStudents" @onClose="onClose">
    </StudentEnrollmentFormView>


    <Toast position="top-right" group="tl" />
</template>

<script setup>
import router from '@/router';
import { ref } from 'vue';
import EnrolledStudentListView from './EnrolledStudentListView.vue';
import InCompleteStudentListView from './InCompleteStudentListView.vue';
import NotEnrolledStudentListView from './NotEnrolledStudentListView.vue';
import StudentEnrollmentFormView from './StudentEnrollmentFormView.vue';


const selectedStudents = ref([])
const dialog = ref(false)
const tabIndex = ref(0)

const enrolledRef = ref(null);
const notEnrolledRef = ref(null)

const incompleteStudentRef = ref(null)

function callChildMethod(index) {
    if (enrolledRef.value && (index == undefined || index == "0")) {
        enrolledRef.value.reloadData(); // Call the method from child
    }
    if (notEnrolledRef.value && (index == undefined || index == "1")) {
        notEnrolledRef.value.reloadData()
    }
    if (incompleteStudentRef.value && (index == undefined || index == "2")) {
        incompleteStudentRef.value.reloadData()
    }
}

const onSelect = (data) => {
    selectedStudents.value = data
}

const onClose = () => {
    dialog.value = false;
    callChildMethod(tabIndex.value)
}

const enrollStudent = () => {
    dialog.value = true;
}

const onTabChange = (index) => {
    tabIndex.value = index

    callChildMethod(index)
}

</script>

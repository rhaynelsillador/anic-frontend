<script setup>
import GradeResponse from '@/types/grade';
import SubjectCodeResponse from '@/types/subject_code';
import { onMounted, ref } from 'vue';

const students = ref(null)
const totalRecords = ref(0)
const studentGrades = ref({ grades: [], quarters: [] });
const subjectCode = ref(null)
// Expose the function to parent
defineExpose({
    reloadData
});

onMounted(() => {


});

const loadStudents = (code) => {
    subjectCode.value = code
    let model = new SubjectCodeResponse()
    studentGrades.value = []
    model.getSubjectStudents(code,
        (data) => {
            console.log("data ", data)
            students.value = data.data;
            totalRecords.value = data.page.totalCount;

            // students.value.push({
            //     student: {
            //         fullName: "Status"
            //     }
            // })

            loadGrades(code)
        },
        (err) => {
            console.log(err)
        })
}


const loadGrades = (code) => {
    let model = new GradeResponse()
    model.getData(code,
        (data) => {
            studentGrades.value = data.data;
        },
        (err) => {
            console.log(err)
        })
}

function reloadData(data) {
    loadStudents(data.code)
}

const saveGrades = () => {
    let model = new GradeResponse()
    model.postData(subjectCode.value, studentGrades.value.grades,
        (data) => {
            console.log(data)
            studentGrades.value = data.data
        },
        (err) => {
            console.log(err)
        })

}




</script>

<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Grade Entry</h1>
                <p class="text-gray-600">Enter and manage student grades for the selected subject and grading periods.</p>
            </div>
            <Button severity="primary" rounded label="Save Grades" @click="saveGrades()" :disabled="!students || students.length === 0" />
        </div>

        <!-- Grades Table Section -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
            <div v-if="students && students.length > 0">
                <DataTable :value="students" tableStyle="min-width: 50rem" class="grades-table">
                    <Column field="student.studentId" header="Student ID" style="width: 120px;">
                        <template #body="{ data }">
                            <span class="font-mono text-blue-700">{{ data.student.studentId }}</span>
                        </template>
                    </Column>
                    <Column field="student.fullName" header="Student Name" style="width: 220px;">
                        <template #body="{ data }">
                            <span class="font-semibold text-gray-900">{{ data.student.fullName }}</span>
                        </template>
                    </Column>
                    <Column v-for="(val, index) in studentGrades.quarters" :field="val.name" :header="val.name"
                        style="width: 100px;">
                        <template #body="slotProps">
                            <!-- <div v-if="studentGrades.grades.length > 0 && slotProps.data.student.fullName != 'Status'"> -->
                                <InputText
                                    type="number"
                                    :invalid="studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore < 75 && studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore != null"
                                    :disabled="studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).id != null || val.active == false"
                                    placeholder="00"
                                    v-model="studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore"
                                    class="w-full text-center"
                                    :class="{
                                        'bg-green-100 border-green-400 text-green-900': studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore >= 75,
                                        'bg-red-100 border-red-400 text-red-900': studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore < 75 && studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore != null
                                    }"
                                />
                            <!-- </div>
                            <div v-else>
                                <Message severity="info">
                                    <i class="pi pi-info-circle mr-1"></i>No grade
                                </Message>
                            </div> -->
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-16">
                <i class="pi pi-users text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-500 mb-2">No students found for this subject.</h3>
                <p class="text-gray-400">Please select a subject to view and enter grades.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.grades-table :deep(.p-datatable-tbody > tr > td) {
    vertical-align: middle;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}
.grades-table :deep(.p-inputtext) {
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
    border-width: 2px;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.bg-green-100 {
    background-color: #d1fae5 !important;
}
.border-green-400 {
    border-color: #34d399 !important;
}
.text-green-900 {
    color: #065f46 !important;
}
.bg-red-100 {
    background-color: #fee2e2 !important;
}
.border-red-400 {
    border-color: #f87171 !important;
}
.text-red-900 {
    color: #991b1b !important;
}
</style>

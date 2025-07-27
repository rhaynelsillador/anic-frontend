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

            students.value.push({
                student: {
                    fullName: "Status"
                }
            })

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
    <div class="flex flex-col">
        <div class="flex justify-between">
            <br>
            <Button severity="primary" rounded label="Save Grades" @click="saveGrades()" />
        </div>
        <br>
        <DataTable v-if="studentGrades.quarters" :value="students" tableStyle="min-width: 50rem">
            <Column field="student.fullName" header="Student Name"></Column>
            <Column v-for="(val, index) in studentGrades.quarters" :field="val.name" :header="val.name"
                style="width: 60px;">
                <template #body="slotProps">
                    <InputText v-if="studentGrades.grades.length > 0 && slotProps.data.student.fullName != 'Status'"
                        type="number"
                        :invalid="studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore < 75 && studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore != null"
                        :disabled="studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).id != null || val.active == false"
                        placeholder="00"
                        v-model="studentGrades.grades.find(d => d.studentId == slotProps.data.student.id && d.gradingPeriod == val.code).gradeScore" />

                    <Message
                        v-else-if="studentGrades.grades.filter(d => d.gradingPeriod == val.code && d.gradeScore < 75 && d.gradeScore > 0).length > 0"
                        severity="error">
                        Failed : {{studentGrades.grades.filter(d => d.gradingPeriod == val.code && d.gradeScore < 75 &&
                            d.gradeScore > 0).length}}
                    </Message>
                    <Message v-else severity="success">
                        Passed
                    </Message>
                </template>
            </Column>

        </DataTable>
        <!-- {{ studentGrades }} -->
    </div>
</template>

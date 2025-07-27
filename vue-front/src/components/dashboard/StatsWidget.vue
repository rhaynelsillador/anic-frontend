<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const totalStudents = ref(0)
const totalPendingStudents = ref(0)
const newTransferee = ref(0)
const totalNewStudents = ref(0)
const totalTransferred = ref(0)
const totalTeachers = ref(0)

onMounted(() => {
})

// Expose the function to parent
defineExpose({
    processData
});

function processData(studentStatusCount, enrollmentType, teacherCount) {
    studentStatusCount.forEach(([g, count]) => {
        totalStudents.value += count;
    });

    totalPendingStudents.value = studentStatusCount.find(d => d[0] == 4) ? studentStatusCount.find(d => d[0] == 4)[1] : 0;


    // Get the total number of new transferee
    newTransferee.value = enrollmentType.find(d => d[0] == 2) ? enrollmentType.find(d => d[0] == 2)[1] : 0;
    totalNewStudents.value = (enrollmentType.find(d => d[0] == 0) ? enrollmentType.find(d => d[0] == 0)[1] : 0) + newTransferee.value;

    totalTransferred.value = (enrollmentType.find(d => d[0] == 3) ? enrollmentType.find(d => d[0] == 3)[1] : 0) + newTransferee.value;

    totalTeachers.value = teacherCount;
}



</script>

<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Total Students</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalStudents }}</div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-graduation-cap text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ totalPendingStudents }} </span>
            <span class="text-muted-color"> not yet enrolled</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Total Teachers</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalTeachers }}</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-users text-orange-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Learn, grow, and inspire!</span>
            <span class="text-muted-color"> </span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">New Students</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalNewStudents }}</div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-sign-in text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ newTransferee }} </span>
            <span class="text-muted-color"> new transferee</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Transferred</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalTransferred }}</div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-sign-out text-purple-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Students</span>
            <span class="text-muted-color"> tranferred to other school</span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';


const props = defineProps({
    academicRecord: Array,
});


onMounted(() => {
});
</script>

<template>
    <div class="flex flex-col gap-8">
        <!-- {{ academicRecord }} -->
        <div v-for="ar in academicRecord">
            <p>{{ ar.enrollment.yearLevel }} (S.Y. {{ ar.enrollment.schoolYear }})</p>
            <table class="student-info-subjects">
                <thead>
                    <th style="max-width: 50px;">Subject Name</th>
                    <th style="max-width: 50px;">Subject Code</th>
                    <th>Adviser</th>
                    <th>Room</th>
                    <th v-if="ar.subjects.find(d => d.groupYearLevel == 'COLLEGE')">Units</th>
                    <th>Q1</th>
                    <th>Q2</th>
                    <th>Q3</th>
                    <th>Q4</th>
                    <th>Final</th>
                    <th>Remarks</th>
                </thead>
                <tbody>
                    <tr v-for="subject in ar.subjects">
                        <td>{{ subject.subjectCode }}</td>
                        <td>{{ subject.subjectName }}</td>
                        <td>{{ subject.adviser }}</td>
                        <td>{{ subject.roomNum ?? "N/A" }}</td>
                        <td v-if="ar.subjects.find(d => d.groupYearLevel == 'COLLEGE')">{{ subject.units == 0 ? '' : subject.units }}</td>
                        <td>{{ subject.firstQuarter }}</td>
                        <td>{{ subject.secondQuarter }}</td>
                        <td>{{ subject.thirdQuarter }}</td>
                        <td>{{ subject.fourthQuarter }}</td>
                        <td>{{ subject.finalGrade }}</td>
                        <td>{{ subject.remarks }}</td>
                    </tr>
                </tbody>
            </table>
            <hr>
        </div>

    </div>
</template>

<style lang="css">
.student-info-subjects{
    width: 100%;
    border-collapse: separate;
    border-spacing: 10px; /* 0 = column gap, 10px = row gap */
}


.student-info-subjects thead{
    text-align: left;
}

.student-info thead th:nth-child(2) {
  width: 400px; /* Adjust as needed */
}

</style>
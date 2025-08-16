<script setup>
import DashboardReportResponse from '@/types/academic_dashboar';
import { onMounted, ref } from 'vue';

const chartData = ref({});
const chartOptions = ref({});


function processSchoolYearData(){

    let model = new DashboardReportResponse()

    model.getMainDashboardData(
        (data) => {
            // Handle success
            console.log("Main Dashboard Data:", data.data.studentCountPerSchoolYear);
            let studentCountPerSchoolYear = data.data.studentCountPerSchoolYear;
            let years = [];
            let totalStudents = [];
            let totalMale = [];
            let totalFemale = [];
            for (let i = 0; i < studentCountPerSchoolYear.length; i++) {
                years[i] = studentCountPerSchoolYear[i][0];   // index 0 values
                totalStudents[i] = studentCountPerSchoolYear[i][3];  // index 1 values
                totalMale[i] = studentCountPerSchoolYear[i][1];  // index 1 values
                totalFemale[i] = studentCountPerSchoolYear[i][2];  // index 1 values
            }

            chartData.value = {
                labels: years,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Male',
                        data: totalMale,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        backgroundColor: [
                            '#36A2EB', 
                        ]
                    },
                    {
                        type: 'bar',
                        label: 'Female',
                        data: totalFemale,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        backgroundColor: [
                            '#FF6384',
                            
                        ]
                    },
                    {
                        type: 'line',
                        label: 'Total Students',
                        data: totalStudents,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB', 
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40'
                        ],
                        borderColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56', 
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40'
                        ],
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            };


        },
        (error) => {
            // Handle error
            console.error("Error fetching Main Dashboard Data:", error);
        }
    );

    
};

onMounted(() => {
    processSchoolYearData();
    chartOptions.value = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            },
            title: {
                display: true,
                text: 'Student Enrollment by School Year'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Students'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'School Year'
                }
            }
        }
    };
});

</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <span class="text-900 text-xl font-semibold">School Year Enrollment</span>
            <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded />
        </div>
        <div style="height: 300px;">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
        </div>
        <div class="mt-4 text-center">
            <span class="text-600 text-sm">Enrollment trends across school years</span>
        </div>
    </div>
</template>
<script setup>
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import { useLayout } from '@/layout/composables/layout';
import { useGlobalStore } from '@/stores/global';
import DashboardReportResponse from '@/types/academic_dashboar';
import { onMounted, ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
const lineData = ref(null);
const pieData = ref(null);
const barData = ref(null);
const lineOptions = ref(null);
const pieOptions = ref(null);
const barOptions = ref(null);
const totalStudents = ref([])
const statsWidget = ref(null);

onMounted(() => {
    setColorOptions();
    dashboarReport()
});

const dashboarReport = () => {
    let model = new DashboardReportResponse()
    model.getData({
        filters: {
            schoolYear: {
                value: useGlobalStore().appConfig.schoolYear
            }
        }
    },
        (data) => {
            setPieData(data.data.gender)
            setBarGraphData(data.data.gender)
            setLineGraphData(data.data.studentCount)
            statsWidget.value.processData(data.data.studentStatusCount, data.data.enrollmentType, data.data.totalTeachers);
        },
        (err) => {
            console.log(err)
        })
}

const setPieData = (data) => {
    const sortedLabels = [...new Set(data.map(item => item[0] === 0 ? 'Male' : 'Female'))].sort((a, b) => a === 'Male' ? -1 : b === 'Male' ? 1 : 0);

    let maleTotal = 0;
    let femaleTotal = 0;

    data.forEach(([g, count]) => {
        if (g === 0) {
            maleTotal += count;
        } else if (g === 1) {
            femaleTotal += count;
        }
    });

    const documentStyle = getComputedStyle(document.documentElement);
    pieData.value = {
        labels: sortedLabels,
        datasets: [
            {
                data: [maleTotal, femaleTotal],
                backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400')]
            }
        ]
    };
}

const setBarGraphData = (genderData) => {

    const gradeMap = new Map();

    // Group by grade
    genderData.forEach(([g, count, grade]) => {
        const isMale = g === 0;
        if (!gradeMap.has(grade)) {
            gradeMap.set(grade, { male: 0, female: 0 });
        }
        const entry = gradeMap.get(grade);
        if (isMale) {
            entry.male += count;
        } else {
            entry.female += count;
        }
    });

    // Transform to desired structure
    const result = {
        grades: [],
        male: [],
        female: []
    };

    [...gradeMap.entries()]
        .sort((a, b) => a[0].localeCompare(b[0])) // optional: sort grades
        .forEach(([grade, { male, female }]) => {
            result.grades.push(grade);
            result.male.push(male);
            result.female.push(female);
        });

    console.log(result);



    const documentStyle = getComputedStyle(document.documentElement);
    barData.value = {
        labels: result.grades,
        datasets: [
            {
                label: 'Male',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                data: result.male
            },
            {
                label: 'Female',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                data: result.female
            }
        ]
    };

}

const setLineGraphData = (studentCount) => {
    const documentStyle = getComputedStyle(document.documentElement);

    // Sort by grade number
    const sorted = studentCount.slice().sort((a, b) => {
        const numA = parseInt(a[0].replace("Grade ", ""));
        const numB = parseInt(b[0].replace("Grade ", ""));
        return numA - numB;
    });

    // Extract sorted grades and totals
    const grades = sorted.map(item => item[0]);
    const totals = sorted.map(item => item[1]);

    console.log({ grades, totals });


    lineData.value = {
        labels: grades,
        datasets: [
            {
                label: 'Number of Students',
                data: totals,
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                tension: 0.4
            },
            // {
            //     label: 'Second Dataset',
            //     data: [28, 48, 40, 19, 86, 27, 90],
            //     fill: false,
            //     backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
            //     borderColor: documentStyle.getPropertyValue('--p-primary-200'),
            //     tension: 0.4
            // }
        ]
    };

}

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}

watch(
    [getPrimary, getSurface, isDarkTheme],
    () => {
        setColorOptions();
    },
    { immediate: true }
);
</script>

<template>


    <div class="grid grid-cols-12 gap-8">
        <StatsWidget ref="statsWidget" />
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Grade Level Students</div>
                <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Gender Per Grade Level</div>
                <Chart type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">Gender</div>
                <Chart type="pie" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">Status</div>
                <Chart type="doughnut" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>

    </div>
</template>

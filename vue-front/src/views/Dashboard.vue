<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import StudentSchoolYearReportWidget from '@/components/dashboard/StudentSchoolYearReportWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import { useGlobalStore } from '@/stores/global';
import DashboardReportResponse from '@/types/academic_dashboar';
import { onMounted, ref } from 'vue';


const statsWidget = ref(null);

onMounted(() => {
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
            statsWidget.value.processData(data.data.studentStatusCount, data.data.enrollmentType, data.data.totalTeachers);
        
        })
}


</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <StatsWidget ref="statsWidget" />

        <div class="col-span-12 xl:col-span-6">
            <RecentSalesWidget />
            <BestSellingWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <StudentSchoolYearReportWidget />
            <NotificationsWidget />
        </div>
    </div>
</template>

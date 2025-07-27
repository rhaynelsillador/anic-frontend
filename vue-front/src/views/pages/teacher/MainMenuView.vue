<script setup>
import { useGlobalStore } from '@/stores/global';
import SubjectCodeResponse from '@/types/subject_code';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DashboardView from './DashboardView.vue';
import GradeView from './GradeView.vue';
import SubjectListView from './SubjectListView.vue';

const route = useRoute()
const menu = ref({
});

const subjectStudentList = ref(null)
const studentGradesViewList = ref(null)
const subjects = ref([]);
const teacherId = ref(null)

const globalStore = useGlobalStore()

const nestedMenuitems = ref([
    {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        to: "Dashboard"
    },
    {
        label: 'Attendance',
        icon: 'pi pi-fw pi-building-columns',
        // items: subjects.value
    },
    {
        label: '|',
        // icon: 'pi pi-fw pi-home'
    },
    {
        label: 'GradesView',
        icon: 'pi pi-fw pi-table',
        items: []
    }
]);

watch(() => route.fullPath, () => {
    console.log(route)
    initData()
})

onMounted(() => {
    initData()
});

const initData = () => {
    // Access query parameters
    const subject = route.query.subject
    teacherId.value = route.query.teacher

    console.log(subject)
    if (subject == undefined) {
        menu.value.to = "Dashboard"
    } else {
        menu.value.to = "Attendance"
    }

    if (teacherId.value) {
        getSubjects(teacherId.value)
    } else {
        if (globalStore.loginAccount.accountRef) {
            teacherId.value = globalStore.loginAccount.accountRef
            getSubjects(teacherId.value)
            console.log(">><<")
        } else {
            nestedMenuitems.value = nestedMenuitems.value.filter(d => d.label == "Home")
        }

    }
}

const getSubjects = (teacherId) => {
    let model = new SubjectCodeResponse()
    model.getAdviserSubjects({ "adviser": teacherId, "year": globalStore.appConfig.schoolYear },
        (data) => {
            if (data.status == "SUCCESS") {
                subjects.value = data.data;
                let menuSubjects = data.data.map(cls => ({
                    label: cls.subjectName,
                    to: 'Subject',
                    id: cls.id,
                    code: cls.code,
                    yearLevel: cls.yearLevel,
                    icon: 'pi pi-fw pi-graduation-cap' // convert number to string, if needed
                }));
                nestedMenuitems.value.find(d => d.label == "Attendance").items = menuSubjects
                const subject = route.query.subject
                if (subject) {
                    let activeSubj = menuSubjects.find(d => d.label == subject)
                    menu.value = activeSubj
                    if (activeSubj && subjectStudentList.value) {
                        subjectStudentList.value.reloadData(activeSubj); // Call the method from child
                    } else {
                        menu.value = {
                            to: "Dashboard"
                        }
                    }
                }

                let menuStudentGrades = data.data.map(cls => ({
                    label: cls.subjectName,
                    to: 'GradesView',
                    id: cls.id,
                    code: cls.code,
                    yearLevel: cls.yearLevel,
                    icon: 'pi pi-fw pi-graduation-cap' // convert number to string, if needed
                }));


                nestedMenuitems.value.find(d => d.label == "GradesView").items = menuStudentGrades

            }



        },
        (err) => {
            console.log(err)
        })
}

const onMenuClick = (e) => {
    if (e.to) {
        menu.value = e
        console.log("menu ", menu.value)
        setTimeout(() => {
            if (subjectStudentList.value) {
                subjectStudentList.value.reloadData(menu.value); // Call the method from child
            } else if (studentGradesViewList && studentGradesViewList.value) {
                studentGradesViewList.value.reloadData(menu.value); // Call the method from child
            }
        }, 100)

    }

}
</script>

<template>
    <div class="card" v-if="teacherId">
        <div class="font-semibold text-xl mb-4">Teacher Dashboard</div>
        <Menubar :model="nestedMenuitems">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action"
                    @click="onMenuClick(item)">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.yearLevel ? item.yearLevel + ' (' + item.label + ')' : item.label
                        }}</span>
                </a>
            </template>
        </Menubar>
    </div>

    <DashboardView v-if="menu && menu.to == 'Dashboard'"></DashboardView>
    <SubjectListView v-else-if="menu && menu.to == 'Subject'" :subject="menu" ref="subjectStudentList">
    </SubjectListView>
    <GradeView v-else-if="menu && menu.to == 'GradesView'" :subject="menu" ref="studentGradesViewList"></GradeView>
</template>

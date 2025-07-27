<script setup>
import { onMounted, ref } from 'vue';

import { useGlobalStore } from '@/stores/global';
import Helper from '@/types/helper';
import SubjectCodeRequest from '@/types/requests/subject_code_req';
import RoomResponse from '@/types/room';
import SectionResponse from '@/types/section';
import SubjectResponse from '@/types/subject';
import SubjectCodeResponse from '@/types/subject_code';
import TeacherResponse from '@/types/teacher';
import YearLevelResponse from '@/types/year_level';
import { useToast } from "primevue/usetoast";

const toast = useToast();


const subjectInfo = ref({})
const yearLevels = ref([])
const sections = ref([])
const subjects = ref([])
const rooms = ref([])
const teachers = ref([])
const isOpen = ref(true)

const emit = defineEmits(['onClose']);


const props = defineProps({
    subject: Object,
    dialog: Boolean
});


onMounted(() => {
    // Get the data from the server
    loadData();
    loadRoomData();

    isOpen.value = props.dialog

});

const loadData = () => {
    let model = new YearLevelResponse();
    model.getData({},
        (data) => {
            yearLevels.value = data.data.map(cls => ({
                name: cls.name,
                code: String(cls.id) // convert number to string, if needed
            }));

            setDefaultYearLevelValue()
        },
        (err) => {
            console.log(err)
        })
}

const setDefaultYearLevelValue = () => {
    if (props.subject) {
        subjectInfo.value.yearLevelData = yearLevels.value.find(d => d.name == props.subject.yearLevel)
        loadSectionData();
        loadSubCodeData();
    }
}

const loadSectionData = () => {
    let model = new SectionResponse();
    console.log("useGlobalStore().appConfig ", useGlobalStore().appConfig)
    model.getData({
        filters: {
            yearLevel: { value: subjectInfo.value.yearLevelData.name, matchMode: 'equals' },
            schoolYear: { value: useGlobalStore().appConfig.schoolYear, matchMode: 'equals' }
        }
    },
        (data) => {
            sections.value = data.data.map(cls => ({
                name: cls.code,
                code: String(cls.id) // convert number to string, if needed
            }));


            // Set default section 
            if (props.subject) {
                subjectInfo.value.sectionData = sections.value.find(d => d.name == props.subject.section)

            }

        },
        (err) => {
            console.log(err)
        })
}

const loadSubjectData = () => {
    let model = new SubjectResponse();
    model.getData({
        filters: { yearLevel: { value: subjectInfo.value.yearLevelData.name, matchMode: 'equals' } }
    },
        (data) => {
            subjects.value = data.data.map(cls => ({
                name: cls.name,
                startTime: '08:00',
                endTime: '09:00',
                subjectCode: cls.code,
            }));



            loadTeachers();

        },
        (err) => {
            console.log(err)
        })

}


const loadRoomData = () => {
    let model = new RoomResponse();
    model.getData({},
        (data) => {
            rooms.value = data.data.map(cls => ({
                name: cls.building + " - " + cls.roomNo,
                code: String(cls.id) // convert number to string, if needed
            }));

        },
        (err) => {
            console.log(err)
        })

}

const fetchSectionAndSubject = () => {
    loadSubjectData();
    loadSectionData();
}

const loadSubCodeData = () => {
    let model = new SubjectCodeResponse()
    model.getData({
        filters: {
            yearLevel: { value: subjectInfo.value.yearLevelData.name, matchMode: 'equals' },
            schoolYear: { value: props.subject.schoolYear, matchMode: 'equals' },
            section: { value: props.subject.section, matchMode: 'equals' },
        }
    },
        (data) => {
            subjects.value = data.data.map(cls => ({
                code: cls.code,
                name: cls.subjectName,
                subjectCode: cls.subjectCode,
                adviser: cls.adviser,
                id: cls.id,
                startTime: Helper.toHHmm(Helper.getCurrentDate() + "T" + (cls.startTime ?? '08:00:00')),
                endTime: Helper.toHHmm(Helper.getCurrentDate() + "T" + (cls.endTime ?? '09:00:00'))
            }));


            loadTeachers();
        },
        (err) => {
            console.log(err)
        })
}

const loadTeachers = () => {
    let model = new TeacherResponse()
    model.getTeachers({},
        (data) => {
            teachers.value = data.data.map(cls => ({
                name: cls.firstName + ' ' + cls.lastName,
                code: String(cls.id) // convert number to string, if needed
            }));

            // Set default adviser default value 
            if (props.subject) {
                for (const element of subjects.value) {
                    element.adviserData = teachers.value.find(
                        t => t.name === props.subject.adviser
                    );

                    element.roomData = rooms.value.find(
                        t => t.name === props.subject.room
                    );
                }

            }
        },
        (err) => {
            console.log(err)
        })
}



function hideDialog() {
    isOpen.value = false;
    emit('onClose');
}

function saveSubjectCode() {
    console.log(",,,, ", subjects.value)


    console.log("Helper.getCurrentDate() ", Helper.getCurrentDate())


    let tmpSubjects = [];
    for (const sub of subjects.value) {
        let startTime = sub.startTime
        if (new Date(startTime) != "Invalid Date") {
            startTime = Helper.toTime(startTime)
        }
        if (startTime.split(":").length == 2) {
            startTime = startTime + ":00"
        }

        let endTime = sub.endTime
        if (new Date(endTime) != "Invalid Date") {
            endTime = Helper.toTime(endTime)
        }
        if (endTime.split(":").length == 2) {
            endTime = endTime + ":00"
        }



        console.log("startTime ", startTime)
        tmpSubjects.push({
            code: sub.code,
            id: sub.id,
            endTime: endTime,
            startTime: startTime,
            name: sub.name,
            adviser: sub.adviserData ? sub.adviserData.code : null,
            room: sub.roomData ? sub.roomData.code : null,
            subjectCode: sub.subjectCode
        })

    }
    let newSubjectCode = {
        subjects: tmpSubjects,
        section: subjectInfo.value.sectionData ? subjectInfo.value.sectionData.code : null,
    }

    console.log("newSubjectCode, ", newSubjectCode)

    // Subject new subject
    let model = new SubjectCodeRequest();

    model.post(newSubjectCode, (data) => {
        console.log("response ", data)
        if (data.status == "SUCCESS") {
            toast.add({ severity: 'success', summary: 'Success', detail: data.message, group: 'tl', life: 3000 });
            hideDialog()
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, group: 'tl', life: 3000 });
        }
    }, (err) => {
        console.log("error ", err)
        toast.add({ severity: 'error', summary: 'Error', detail: err.message, group: 'tl', life: 3000 });
    })
}

</script>

<template>
    <Dialog v-model:visible="isOpen" :style="{ width: '80%' }" header="Subject Details" :modal="true"
        @hide="hideDialog">
        <Fluid>
            <div class="flex flex-col md:flex-row">
                <div class="md:w-1/2">
                    <div class="card flex flex-col gap-4">
                        <div class="font-semibold text-xl">Year Level & Section</div>
                        <div class="flex flex-col md:flex-row">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="email1">Year Level</label>
                                <Select id="state" v-model="subjectInfo.yearLevelData" :options="yearLevels"
                                    optionLabel="name" @change="fetchSectionAndSubject" placeholder="Select One"
                                    class="w-full" :disabled="props.subject != undefined"></Select>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="email1">Section</label>
                                <Select id="state" v-model="subjectInfo.sectionData" :options="sections"
                                    optionLabel="name" placeholder="Select One" class="w-full"></Select>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="md:w-1/2">
                </div>
            </div>

            <div class="flex">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl">Subjects Schedule</div>
                    <div class="flex flex-col md:flex-row gap-4" v-for="(subjectSchedule, ind) in subjects">
                        <div class="flex flex-wrap gap-2 w-full" v-if="subjectSchedule.code">
                            <label for="name1" v-if="ind == 0">Subject Code</label>
                            <InputText id="name1" type="text" v-model="subjectSchedule.code" :disabled="true" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="name1" v-if="ind == 0">Subject Name</label>
                            <InputText id="name1" type="text" v-model="subjectSchedule.name" :disabled="true" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="name1" v-if="ind == 0">Adviser</label>
                            <Select id="state" v-model="subjectSchedule.adviserData" :options="teachers"
                                :showClear="true" optionLabel="name" placeholder="Select One" class="w-full"></Select>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="name1" v-if="ind == 0">Bdlg & Room</label>
                            <Select id="state" v-model="subjectSchedule.roomData" :options="rooms" optionLabel="name"
                                placeholder="Select One" class="w-full"></Select>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="email1" v-if="ind == 0">Start</label>
                            <DatePicker id="datepicker-timeonly" v-model="subjectSchedule.startTime" timeOnly fluid
                                class="w-full" dateFormat="HH:mm" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="email1" v-if="ind == 0">End</label>
                            <DatePicker id="datepicker-timeonly" v-model="subjectSchedule.endTime" timeOnly fluid
                                class="w-full" />
                        </div>
                    </div>

                </div>
            </div>
        </Fluid>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="saveSubjectCode" />
        </template>
    </Dialog>

</template>

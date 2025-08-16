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
const errors = ref({});
const isLoading = ref(false)

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
        })
}



function hideDialog() {
    isOpen.value = false;
    emit('onClose');
}

const validateForm = () => {
    errors.value = {};
    
    if (!subjectInfo.value.yearLevelData) {
        errors.value.yearLevel = 'Year level is required';
    }
    
    if (!subjectInfo.value.sectionData) {
        errors.value.section = 'Section is required';
    }
    
    // Validate subjects
    subjects.value.forEach((subject, index) => {
        if (!subject.adviserData) {
            errors.value[`adviser_${index}`] = 'Adviser is required';
        }
        // if (!subject.roomData) {
        //     errors.value[`room_${index}`] = 'Room is required';
        // }
        if (!subject.startTime) {
            errors.value[`startTime_${index}`] = 'Start time is required';
        }
        if (!subject.endTime) {
            errors.value[`endTime_${index}`] = 'End time is required';
        }
        if (subject.startTime && subject.endTime) {
            const start = new Date(`2000-01-01T${Helper.toTime(subject.startTime)}`);
            const end = new Date(`2000-01-01T${Helper.toTime(subject.endTime)}`);
            if (start >= end) {
                errors.value[`timeRange_${index}`] = 'End time must be after start time';
            }
        }
    });
    
    return Object.keys(errors.value).length === 0;
};

function saveSubjectCode() {
    if (!validateForm()) {
        toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'Please fix the errors before saving', group: 'tl', life: 3000 });
        return;
    }
    
    isLoading.value = true;
    
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
    
    // Subject new subject
    let model = new SubjectCodeRequest();

    model.post(newSubjectCode, (data) => {
        isLoading.value = false;
        if (data.status == "SUCCESS") {
            toast.add({ severity: 'success', summary: 'Success', detail: data.message, group: 'tl', life: 3000 });
            hideDialog()
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, group: 'tl', life: 3000 });
        }
    }, (err) => {
        isLoading.value = false;
        toast.add({ severity: 'error', summary: 'Error', detail: err.message, group: 'tl', life: 3000 });
    })
}

</script>

<template>
    <Dialog v-model:visible="isOpen" :style="{ width: '95%', maxWidth: '1200px' }" 
            header="Subject Assignment & Schedule" :modal="true" @hide="hideDialog" 
            :closable="!isLoading" class="subject-assignment-dialog">
            
        <div class="min-h-[600px] p-2">
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
                <div class="flex items-center gap-3 mb-2">
                    <i class="pi pi-book text-2xl text-blue-600"></i>
                    <h2 class="text-2xl font-bold text-gray-800">Subject Assignment</h2>
                </div>
                <p class="text-gray-600">Configure subject schedules, assign teachers, and set room assignments for the selected section.</p>
            </div>

            <!-- Form Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Year Level & Section Card -->
                <Card class="h-fit">
                    <template #title>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-users text-blue-500"></i>
                            Class Information
                        </div>
                    </template>
                    <template #content>
                        <div class="space-y-4">
                            <div class="field">
                                <label for="yearLevel" class="block text-sm font-medium text-gray-700 mb-2">
                                    Year Level <span class="text-red-500">*</span>
                                </label>
                                <Select 
                                    id="yearLevel" 
                                    v-model="subjectInfo.yearLevelData" 
                                    :options="yearLevels"
                                    optionLabel="name" 
                                    @change="fetchSectionAndSubject" 
                                    placeholder="Select Year Level"
                                    class="w-full" 
                                    :disabled="props.subject != undefined"
                                    :class="{ 'p-invalid': errors.yearLevel }"
                                />
                                <small v-if="errors.yearLevel" class="p-error">{{ errors.yearLevel }}</small>
                            </div>
                            
                            <div class="field">
                                <label for="section" class="block text-sm font-medium text-gray-700 mb-2">
                                    Section <span class="text-red-500">*</span>
                                </label>
                                <Select 
                                    id="section" 
                                    v-model="subjectInfo.sectionData" 
                                    :options="sections"
                                    optionLabel="name" 
                                    placeholder="Select Section" 
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.section }"
                                />
                                <small v-if="errors.section" class="p-error">{{ errors.section }}</small>
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Summary Card -->
                <Card class="h-fit">
                    <template #title>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-info-circle text-green-500"></i>
                            Assignment Summary
                        </div>
                    </template>
                    <template #content>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span class="font-medium text-blue-800">Total Subjects:</span>
                                <span class="font-bold text-blue-900">{{ subjects.length }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span class="font-medium text-green-800">Assigned Teachers:</span>
                                <span class="font-bold text-green-900">{{ subjects.filter(s => s.adviserData).length }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                <span class="font-medium text-purple-800">Assigned Rooms:</span>
                                <span class="font-bold text-purple-900">{{ subjects.filter(s => s.roomData).length }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                <span class="font-medium text-orange-800">Scheduled Times:</span>
                                <span class="font-bold text-orange-900">{{ subjects.filter(s => s.startTime && s.endTime).length }}</span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Subjects Schedule Section -->
            <Card v-if="subjects.length > 0">
                <template #title>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-calendar text-indigo-500"></i>
                            Subject Schedules
                        </div>
                        <Tag :value="`${subjects.length} Subjects`" severity="info" />
                    </div>
                </template>
                <template #content>
                    <div class="space-y-6">
                        <div v-for="(subject, index) in subjects" :key="index" 
                             class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            
                            <!-- Subject Header -->
                            <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span class="text-sm font-bold text-indigo-600">{{ index + 1 }}</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">{{ subject.name }}</h4>
                                        <p class="text-sm text-gray-500">Code: {{ subject.code || subject.subjectCode }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Tag v-if="subject.adviserData && subject.roomData && subject.startTime && subject.endTime" 
                                         value="Complete" severity="success" />
                                    <Tag v-else value="Incomplete" severity="warning" />
                                </div>
                            </div>

                            <!-- Subject Form Fields -->
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <!-- Teacher Assignment -->
                                <div class="field">
                                    <label :for="`adviser_${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="pi pi-user text-blue-500 mr-1"></i>
                                        Teacher <span class="text-red-500">*</span>
                                    </label>
                                    <Select 
                                        :id="`adviser_${index}`"
                                        v-model="subject.adviserData" 
                                        :options="teachers"
                                        :showClear="true" 
                                        optionLabel="name" 
                                        placeholder="Select Teacher" 
                                        class="w-full"
                                        :class="{ 'p-invalid': errors[`adviser_${index}`] }"
                                    />
                                    <small v-if="errors[`adviser_${index}`]" class="p-error">{{ errors[`adviser_${index}`] }}</small>
                                </div>

                                <!-- Room Assignment -->
                                <div class="field">
                                    <label :for="`room_${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="pi pi-home text-green-500 mr-1"></i>
                                        Room <span class="text-red-500">*</span>
                                    </label>
                                    <Select 
                                        :id="`room_${index}`"
                                        v-model="subject.roomData" 
                                        :options="rooms" 
                                        optionLabel="name"
                                        placeholder="Select Room" 
                                        class="w-full"
                                        :class="{ 'p-invalid': errors[`room_${index}`] }"
                                    />
                                    <small v-if="errors[`room_${index}`]" class="p-error">{{ errors[`room_${index}`] }}</small>
                                </div>

                                <!-- Start Time -->
                                <div class="field">
                                    <label :for="`startTime_${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="pi pi-clock text-purple-500 mr-1"></i>
                                        Start Time <span class="text-red-500">*</span>
                                    </label>
                                    <DatePicker 
                                        :id="`startTime_${index}`"
                                        v-model="subject.startTime" 
                                        timeOnly 
                                        fluid
                                        class="w-full" 
                                        dateFormat="HH:mm"
                                        :class="{ 'p-invalid': errors[`startTime_${index}`] || errors[`timeRange_${index}`] }"
                                    />
                                    <small v-if="errors[`startTime_${index}`]" class="p-error">{{ errors[`startTime_${index}`] }}</small>
                                </div>

                                <!-- End Time -->
                                <div class="field">
                                    <label :for="`endTime_${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="pi pi-clock text-orange-500 mr-1"></i>
                                        End Time <span class="text-red-500">*</span>
                                    </label>
                                    <DatePicker 
                                        :id="`endTime_${index}`"
                                        v-model="subject.endTime" 
                                        timeOnly 
                                        fluid
                                        class="w-full"
                                        :class="{ 'p-invalid': errors[`endTime_${index}`] || errors[`timeRange_${index}`] }"
                                    />
                                    <small v-if="errors[`endTime_${index}`]" class="p-error">{{ errors[`endTime_${index}`] }}</small>
                                    <small v-if="errors[`timeRange_${index}`]" class="p-error">{{ errors[`timeRange_${index}`] }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Empty State -->
            <Card v-else class="text-center py-12">
                <template #content>
                    <div class="flex flex-col items-center gap-4">
                        <i class="pi pi-book text-6xl text-gray-300"></i>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-500 mb-2">No Subjects Available</h3>
                            <p class="text-gray-400">Please select a year level and section to view subjects.</p>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <template #footer>
            <div class="flex justify-between items-center w-full">
                <div class="text-sm text-gray-500">
                    <i class="pi pi-info-circle mr-1"></i>
                    {{ subjects.length }} subject(s) to be saved
                </div>
                <div class="flex gap-2">
                    <Button 
                        label="Cancel" 
                        icon="pi pi-times" 
                        severity="secondary"
                        outlined
                        @click="hideDialog" 
                        :disabled="isLoading"
                    />
                    <Button 
                        label="Save Assignment" 
                        icon="pi pi-check" 
                        @click="saveSubjectCode"
                        :loading="isLoading"
                        :disabled="subjects.length === 0"
                    />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.subject-assignment-dialog :deep(.p-dialog-content) {
    padding: 0;
}

.field {
    margin-bottom: 0;
}

.p-invalid {
    border-color: #f87171;
}

.p-error {
    color: #f87171;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>

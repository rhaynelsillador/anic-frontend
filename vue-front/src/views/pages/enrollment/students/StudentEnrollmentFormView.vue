<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useGlobalStore } from '@/stores/global';
import { Filter } from '@/types/Filter';
import StudentSectionAssignmentRequest from '@/types/requests/enrollment_req';
import SectionResponse from '@/types/section';
import YearLevelResponse from '@/types/year_level';
import { useToast } from "primevue/usetoast";

const toast = useToast();

const yearLevels = ref([])
const sections = ref({})
const canApplyAllLevel = ref(false)
const canApplyAllSection = ref(false)
const students = ref([])
const isOpen = ref(true)
const errors = ref({});
const isLoading = ref(false)

const emit = defineEmits(['onClose']);

const props = defineProps({
    students: Array,
    dialog: Boolean
});


onMounted(() => {
    // Get the data from the server
    loadData();
    isOpen.value = props.dialog
    students.value = JSON.parse(JSON.stringify(props.students))

});

const loadData = () => {
    let model = new YearLevelResponse();
    model.getData({},
        (data) => {
            yearLevels.value = data.data.map(cls => ({
                name: cls.name,
                code: String(cls.id) // convert number to string, if needed
            }));

            let uniqueYearLevel = []
            for (const element of students.value) {
                let index = students.value.findIndex(d => d.id === element.id)
                if (index > -1) {
                    students.value[index].yearLevelData = yearLevels.value.find(d => d.name == students.value[index].yearLevel)
                    if (uniqueYearLevel.find(d => d.name == students.value[index].yearLevel) == null) {
                        uniqueYearLevel.push(students.value[index].yearLevelData)
                    }
                }

            }

            for (const element of uniqueYearLevel) {
                loadSectionData(0, element)
            }



        })
}

const loadSectionData = (index, yearLevel) => {
    if (yearLevel && sections.value[yearLevel.code] == undefined) {

        let filterRequest: Filter = {
            filters: {
                yearLevel: {
                    value: yearLevel.name,
                    matchMode: 'equals'
                },
                schoolYear: {
                    value: useGlobalStore().appConfig.schoolYear,
                    matchMode: 'equals'
                },

            }
        };

        let model = new SectionResponse();
        model.getData(filterRequest,
            (data) => {
                sections.value[yearLevel.code] = data.data.map(cls => ({
                    name: cls.code,
                    code: String(cls.id) // convert number to string, if needed
                }));

            })
    }

    hasSameYearLevel();

}

function hideDialog() {
    isOpen.value = false;
    emit('onClose');
}

const validateForm = () => {
    errors.value = {};
    
    students.value.forEach((student, index) => {
        if (!student.yearLevelData) {
            errors.value[`yearLevel_${index}`] = 'Grade level is required';
        }
        if (!student.sectionData) {
            errors.value[`section_${index}`] = 'Section is required';
        }
    });
    
    return Object.keys(errors.value).length === 0;
};

function save() {
    if (!validateForm()) {
        toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'Please assign all students to a grade level and section', group: 'tl', life: 3000 });
        return;
    }
    
    isLoading.value = true;

    let hasAllValidLevel = students.value.find(d => d.yearLevelData == undefined) == undefined
    let hasAllValidSection = students.value.find(d => d.sectionData == undefined) == undefined
    if (!hasAllValidLevel) {
        toast.add({ severity: 'error', summary: 'Error', detail: "Grade Level assignment is required to all students.", group: 'tl', life: 3000 });
    } else if (!hasAllValidSection) {
        toast.add({ severity: 'error', summary: 'Error', detail: "Section assignment is required to all students.", group: 'tl', life: 3000 });
    } else {
        const sectionAssignment = students.value.map(student => ({
            student: student.student.id,
            section: Number(student.sectionData.code),
            yearLevel: Number(student.yearLevelData.code)
        }));

        // Subject new subject
        let model = new StudentSectionAssignmentRequest();

        model.post(sectionAssignment, (data) => {
            if (data.status == "SUCCESS") {
                toast.add({ severity: 'success', summary: 'Success', detail: data.message, group: 'tl', life: 3000 });
                hideDialog()
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: data.message, group: 'tl', life: 3000 });
            }
        }, (err) => {
            toast.add({ severity: 'error', summary: 'Error', detail: err.message, group: 'tl', life: 3000 });
        })
    }
    isLoading.value = false;
}

const getSections = (yearLevelData) => {
    return yearLevelData ? sections.value[yearLevelData.code] : []
}

const hasSameYearLevel = () => {
    const reference = students.value.find(item => item.yearLevelData != null);

    // If no item has yearLevelData, set button to disabled
    if (!reference) {
        canApplyAllLevel.value = false
        return
    };

    const referenceValue = JSON.stringify(reference.yearLevelData);

    canApplyAllLevel.value = students.value.every(item => {
        // Only compare when yearLevelData is present
        return item.yearLevelData == null || JSON.stringify(item.yearLevelData) === referenceValue;
    });

    hasSameSection()
}

const hasSameSection = () => {
    const reference = students.value.find(item => item.sectionData != null);

    // If no item has yearLevelData, set button to disabled
    if (!reference) {
        canApplyAllSection.value = false
        return
    };

    const referenceValue = JSON.stringify(reference.sectionData);

    canApplyAllSection.value = students.value.every(item => {
        // Only compare when yearLevelData is present
        return item.sectionData == null || JSON.stringify(item.sectionData) === referenceValue;
    });
}

const applyLevelToAll = (isApply) => {
    // Find first valid yearLevelData
    const reference = students.value.find(item => item.yearLevelData != null)?.yearLevelData;
    if (!reference) {
        console.warn('No valid yearLevelData found.');
        hasSameYearLevel()
        return;
    }

    // Set the same yearLevelData to all items
    students.value = students.value.map(item => ({
        ...item,
        yearLevelData: isApply ? reference : null,
        sectionData: null
    }));

    hasSameYearLevel()
}

const applySectionToAll = (isApply) => {
    // Find first valid yearLevelData
    const reference = students.value.find(item => item.sectionData != null)?.sectionData;
    if (!reference) {
        console.warn('No valid sectionData found.');
        hasSameSection()
        return;
    }

    // Set the same yearLevelData to all items
    students.value = students.value.map(item => ({
        ...item,
        sectionData: isApply ? reference : null
    }));

    hasSameSection()
}

</script>

<template>
    <Dialog v-model:visible="isOpen" :style="{ width: '95%', maxWidth: '1400px' }" 
            header="Student Enrollment Assignment" :modal="true" @hide="hideDialog" 
            :closable="!isLoading" class="student-enrollment-dialog">
            
        <div class="min-h-[700px] p-2">
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
                <div class="flex items-center gap-3 mb-2">
                    <i class="pi pi-users text-2xl text-blue-600"></i>
                    <h2 class="text-2xl font-bold text-gray-800">Student Enrollment</h2>
                </div>
                <p class="text-gray-600">Assign students to their appropriate grade level and section for the current school year.</p>
                <div class="mt-3 flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-users text-blue-500"></i>
                        <span class="font-medium">{{ students.length }} Students Selected</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-calendar text-green-500"></i>
                        <span class="font-medium">School Year: {{ useGlobalStore().appConfig.schoolYear }}</span>
                    </div>
                </div>
            </div>

            <!-- Bulk Actions Section -->
            <Card class="mb-6">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-bolt text-orange-500"></i>
                        Bulk Actions
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Grade Level Actions -->
                        <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <h4 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                <i class="pi pi-graduation-cap"></i>
                                Grade Level Actions
                            </h4>
                            <div class="flex flex-wrap gap-2">
                                <Button 
                                    label="Apply Level to All" 
                                    icon="pi pi-copy"
                                    severity="info"
                                    size="small"
                                    :disabled="!canApplyAllLevel" 
                                    @click="applyLevelToAll(true)"
                                />
                                <Button 
                                    label="Reset All Levels" 
                                    icon="pi pi-refresh"
                                    severity="danger" 
                                    outlined
                                    size="small"
                                    :disabled="!canApplyAllLevel"
                                    @click="applyLevelToAll(false)"
                                />
                            </div>
                            <p class="text-xs text-blue-600 mt-2">
                                Apply the same grade level to all students or reset all assignments
                            </p>
                        </div>

                        <!-- Section Actions -->
                        <div class="p-4 border border-green-200 rounded-lg bg-green-50">
                            <h4 class="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                <i class="pi pi-sitemap"></i>
                                Section Actions
                            </h4>
                            <div class="flex flex-wrap gap-2">
                                <Button 
                                    label="Apply Section to All" 
                                    icon="pi pi-copy"
                                    severity="success"
                                    size="small"
                                    :disabled="!canApplyAllSection || !canApplyAllLevel" 
                                    @click="applySectionToAll(true)"
                                />
                                <Button 
                                    label="Reset All Sections" 
                                    icon="pi pi-refresh"
                                    severity="danger" 
                                    outlined
                                    size="small"
                                    :disabled="!canApplyAllSection || !canApplyAllLevel"
                                    @click="applySectionToAll(false)"
                                />
                            </div>
                            <p class="text-xs text-green-600 mt-2">
                                Apply the same section to all students or reset all assignments
                            </p>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Student Assignment Section -->
            <Card>
                <template #title>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-list text-indigo-500"></i>
                            Student Assignments
                        </div>
                        <div class="flex items-center gap-2">
                            <Tag :value="`${students.filter(s => s.yearLevelData && s.sectionData).length}/${students.length} Complete`" 
                                 :severity="students.every(s => s.yearLevelData && s.sectionData) ? 'success' : 'warning'" />
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="space-y-4">
                        <div v-for="(student, index) in students" :key="index" 
                             class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            
                            <!-- Student Header -->
                            <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span class="text-sm font-bold text-indigo-600">{{ index + 1 }}</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">
                                            {{ student.student.firstName }} {{ student.student.lastName }}
                                        </h4>
                                        <p class="text-sm text-gray-500">Student ID: {{ student.student.studentNumber || 'N/A' }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Tag v-if="student.yearLevelData && student.sectionData" 
                                         value="Complete" severity="success" />
                                    <Tag v-else-if="student.yearLevelData" 
                                         value="Partial" severity="warning" />
                                    <Tag v-else 
                                         value="Pending" severity="danger" />
                                </div>
                            </div>

                            <!-- Assignment Form -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Grade Level Selection -->
                                <div class="field">
                                    <label :for="`yearLevel_${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="pi pi-graduation-cap text-blue-500 mr-1"></i>
                                        Grade Level <span class="text-red-500">*</span>
                                    </label>
                                    <Select 
                                        :id="`yearLevel_${index}`"
                                        v-model="student.yearLevelData" 
                                        :options="yearLevels" 
                                        optionLabel="name"
                                        placeholder="Select Grade Level" 
                                        class="w-full"
                                        :class="{ 'p-invalid': errors[`yearLevel_${index}`] }"
                                        @change="loadSectionData(index, student.yearLevelData)"
                                    />
                                    <small v-if="errors[`yearLevel_${index}`]" class="p-error">{{ errors[`yearLevel_${index}`] }}</small>
                                </div>

                                <!-- Section Selection -->
                                <div class="field">
                                    <label :for="`section_${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="pi pi-sitemap text-green-500 mr-1"></i>
                                        Section <span class="text-red-500">*</span>
                                    </label>
                                    <Select 
                                        :id="`section_${index}`"
                                        v-model="student.sectionData" 
                                        :options="getSections(student.yearLevelData)"
                                        optionLabel="name" 
                                        placeholder="Select Section" 
                                        class="w-full"
                                        :class="{ 'p-invalid': errors[`section_${index}`] }"
                                        :disabled="!student.yearLevelData"
                                        @change="hasSameSection"
                                    />
                                    <small v-if="errors[`section_${index}`]" class="p-error">{{ errors[`section_${index}`] }}</small>
                                    <small v-if="!student.yearLevelData" class="text-gray-500 text-xs">Select grade level first</small>
                                </div>
                            </div>

                            <!-- Assignment Summary -->
                            <div v-if="student.yearLevelData || student.sectionData" 
                                 class="mt-3 p-3 bg-gray-50 rounded-lg border-l-4"
                                 :class="student.yearLevelData && student.sectionData ? 'border-green-400 bg-green-50' : 'border-yellow-400 bg-yellow-50'">
                                <div class="text-sm">
                                    <span class="font-medium">Assignment:</span>
                                    <span v-if="student.yearLevelData" class="ml-2">{{ student.yearLevelData.name }}</span>
                                    <span v-if="student.yearLevelData && student.sectionData"> - </span>
                                    <span v-if="student.sectionData">{{ student.sectionData.name }}</span>
                                    <span v-if="!student.yearLevelData || !student.sectionData" class="text-orange-600 ml-2">
                                        (Incomplete)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Progress Summary -->
                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold text-gray-800 mb-3">Assignment Progress</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div class="p-3 bg-green-100 rounded-lg">
                                <div class="text-2xl font-bold text-green-800">
                                    {{ students.filter(s => s.yearLevelData && s.sectionData).length }}
                                </div>
                                <div class="text-sm text-green-600">Complete</div>
                            </div>
                            <div class="p-3 bg-yellow-100 rounded-lg">
                                <div class="text-2xl font-bold text-yellow-800">
                                    {{ students.filter(s => s.yearLevelData && !s.sectionData).length }}
                                </div>
                                <div class="text-sm text-yellow-600">Partial</div>
                            </div>
                            <div class="p-3 bg-red-100 rounded-lg">
                                <div class="text-2xl font-bold text-red-800">
                                    {{ students.filter(s => !s.yearLevelData).length }}
                                </div>
                                <div class="text-sm text-red-600">Pending</div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <template #footer>
            <div class="flex justify-between items-center w-full">
                <div class="text-sm text-gray-500">
                    <i class="pi pi-info-circle mr-1"></i>
                    {{ students.filter(s => s.yearLevelData && s.sectionData).length }} of {{ students.length }} students ready for enrollment
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
                        label="Enroll Students" 
                        icon="pi pi-check" 
                        @click="save"
                        :loading="isLoading"
                        :disabled="!students.some(s => s.yearLevelData && s.sectionData)"
                    />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.student-enrollment-dialog :deep(.p-dialog-content) {
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

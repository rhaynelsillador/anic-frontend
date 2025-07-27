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



        },
        (err) => {
            console.log(err)
        })
}

const loadSectionData = (index, yearLevel) => {
    console.log('yearLevel', yearLevel)
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

            },
            (err) => {
                console.log(err)
            })
    }

    hasSameYearLevel();

}

function hideDialog() {
    isOpen.value = false;
    emit('onClose');
}

function save() {
    // console.log(",,,, ", students.value)

    let hasAllValidLevel = students.value.find(d => d.yearLevelData == undefined) == undefined
    let hasAllValidSection = students.value.find(d => d.sectionData == undefined) == undefined

    console.log("hasAllValidLevel : ", hasAllValidLevel, hasAllValidSection, students.value)
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


        console.log(sectionAssignment)

        // Subject new subject
        let model = new StudentSectionAssignmentRequest();

        model.post(sectionAssignment, (data) => {
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

    console.log("canApplyAllSection.valuecanApplyAllSection.value ", canApplyAllSection.value)
}

const applyLevelToAll = (isApply) => {
    // Find first valid yearLevelData
    const reference = students.value.find(item => item.yearLevelData != null)?.yearLevelData;
    console.log(reference)
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
    <Dialog v-model:visible="isOpen" :style="{ width: '80%' }" header="Student Enrollment" :modal="true"
        @hide="hideDialog">
        <hr>
        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl">Actions</div>
            <div class="flex flex-wrap gap-2">
                <Button label="Enroll" :disabled="!canApplyAllLevel" @click="applyLevelToAll(true)">Enroll Everyone in
                    this Level</Button>
                <Button label="Reset Levels" severity="danger" :disabled="!canApplyAllLevel"
                    @click="applyLevelToAll(false)"></Button>

                <span>|</span>
                <Button label="Apply Section To All" :disabled="!canApplyAllSection || !canApplyAllLevel"
                    @click="applySectionToAll(true)"></Button>
                <Button label="Reset Section" severity="danger" :disabled="!canApplyAllSection || !canApplyAllLevel"
                    @click="applySectionToAll(false)"></Button>
            </div>

        </div>
        <hr>
        <Fluid>
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Student Enrollment</div>
                <div class="flex flex-col md:flex-row gap-4" v-for="(student, ind) in students">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name1" v-if="ind == 0">Student Name</label>
                        <label class="w-full" for="">{{ ind + 1 }}). {{ student.student.firstName }} {{
                            student.student.lastName }} </label>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name1" v-if="ind == 0">Grade Level</label>
                        <Select id="state" v-model="student.yearLevelData" :options="yearLevels" optionLabel="name"
                            placeholder="Select One" class="w-full"
                            @change="loadSectionData(ind, student.yearLevelData)"></Select>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name1" v-if="ind == 0">Section</label>
                        <Select id="state" v-model="student.sectionData" :options="getSections(student.yearLevelData)"
                            optionLabel="name" placeholder="Select One" class="w-full"
                            @change="hasSameSection"></Select>
                    </div>
                </div>
            </div>
        </Fluid>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="save" />
        </template>
    </Dialog>

</template>

<script setup>
import { onMounted, ref } from 'vue';

import SubjectResponse from '@/types/subject';
import YearLevelResponse from '@/types/year_level';
import { useToast } from "primevue/usetoast";
import { statuses } from '@/const';

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
    isOpen.value = props.dialog
    subjectInfo.value = props.subject ?? {active: true, yearLevel: '', code: '', units: 0, name: ''};
    loadYearLevel()
});

const submitForm = () => {
    let model = new SubjectResponse()
    model.postData(subjectInfo.value,
        (data) => {
            hideDialog()
        })

}

const loadYearLevel = () => {
    let model = new YearLevelResponse();
    model.getData({},
        (data) => {
            yearLevels.value = data.data.map(cls => ({
                name: cls.name,
                code: String(cls.id) // convert number to string, if needed
            }));
        })
}

function hideDialog() {
    isOpen.value = false;
    emit('onClose');
}


</script>

<template>
    <Dialog v-model:visible="isOpen" :style="{ width: '40%' }" header="Subject Details" :modal="true"
        @hide="hideDialog">

        <Fluid>
            <div class="flex flex-row md:flex-col gap-8">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Subject Code</label>
                    <InputText id="code" type="text" v-model="subjectInfo.code" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Name</label>
                    <InputText id="name" type="Subject text" v-model="subjectInfo.name" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Units</label>
                    <InputText id="units" type="Subject units" v-model="subjectInfo.units" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Class or Course</label>
                    <Select id="state" v-model="subjectInfo.yearLevel" :options="yearLevels" option-value="name"
                        optionLabel="name" placeholder="Select One" class="w-full"></Select>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Status</label>
                    <Select v-model="subjectInfo.active" :options="statuses" optionValue="code" optionLabel="name" placeholder="Select" />
                </div>

            </div>
            <br>
        </Fluid>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="submitForm" />
        </template>
    </Dialog>

</template>

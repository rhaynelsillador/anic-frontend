<script setup>
import { onMounted, ref } from 'vue';

import TeacherResponse from '@/types/teacher';
import { useToast } from "primevue/usetoast";

const toast = useToast();


const teacherInfo = ref({})
const yearLevels = ref([])
const sections = ref([])
const subjects = ref([])
const rooms = ref([])
const teachers = ref([])
const isOpen = ref(true)

const emit = defineEmits(['onClose']);


const props = defineProps({
  teacher: Object,
  dialog: Boolean
});


onMounted(() => {
    isOpen.value = props.dialog
    teacherInfo.value = props.teacher ?? {}
});

const submitTeacher = () => {
    let model = new TeacherResponse()
    if(teacherInfo.value.id){
        model.update(teacherInfo.value,
        (data) => { 
            hideDialog()
        })
    }else{
        model.create(teacherInfo.value,
        (data) => { 
            hideDialog()
        })
    }
    
}



function hideDialog() {
    isOpen.value = false;
    emit('onClose'); 
}


</script>

<template>
    <Dialog v-model:visible="isOpen" :style="{ width: '40%' }" header="Teacher Details" :modal="true" @hide="hideDialog">
        
        <Fluid>
            <div class="flex flex-row md:flex-col gap-8">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Employee No</label>
                    <InputText id="lrn" type="text"  v-model="teacherInfo.employeeNo"/>
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">FirstName</label>
                    <InputText id="lrn" type="text"  v-model="teacherInfo.firstName"/>
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">LastName</label>
                    <InputText id="lrn" type="text"  v-model="teacherInfo.lastName"/>
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Email</label>
                    <InputText id="lrn" type="text"  v-model="teacherInfo.email"/>
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Contact No</label>
                    <InputText id="lrn" type="text"  v-model="teacherInfo.contactNo"/>
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Position</label>
                    <InputText id="lrn" type="text"  v-model="teacherInfo.position"/>
                </div>


            </div>
            <br>
        </Fluid>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="submitTeacher" />
            </template>
        </Dialog>

</template>

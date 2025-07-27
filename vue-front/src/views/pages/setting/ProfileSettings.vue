<script setup lang="ts">

import { useGlobalStore } from '@/stores/global';
import { onMounted, ref } from 'vue';


const settingVal = ref({})

onMounted(() => {
    settingVal.value = {
        schoolYear: useGlobalStore().appConfig.schoolYear
    }

    console.log(settingVal.value)
})

</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Settings</div>
        <div class="font-semibold mb-4">Quarter Period</div>
        <div class="flex items-center flex-col sm:flex-row">
            <Chip label="First Quarter" class="mr-2 mb-2"></Chip>
            <Chip label="Second Quarter" class="mr-2 mb-2"></Chip>
            <Chip label="Third Quarter" class="mr-2 mb-2"></Chip>
            <Chip label="Fourth Quarter" class="mb-2"></Chip>
        </div>

        <div class="font-semibold my-4">School Year</div>
        <div class="flex items-center flex-col sm:flex-row">
            <InputText id="code" type="number" v-model="settingVal.schoolYear" readonly="true" />
        </div>

        <div class="font-semibold my-4">Image {{ settingVal }}</div>
        <div class="flex items-center flex-col sm:flex-row">
            <Chip label="Amy Elsner" :image="'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
                class="mr-2 mb-2"></Chip>
            <Chip label="Asiya Javayant" :image="'https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png'"
                class="mr-2 mb-2"></Chip>
            <Chip label="Onyama Limba" :image="'https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png'"
                class="mr-2 mb-2"></Chip>
        </div>
    </div>
</template>

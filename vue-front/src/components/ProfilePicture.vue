<script lang="ts" setup> 

import { getProfilePictureUrl } from '@/config/app';

const props = defineProps({
    currentProfilePictureUrl : String,
    rounded: true
});

// Helper function to get full image URL (using shared config)
const getImageUrl = getProfilePictureUrl;



</script>
<template>
    <div v-if="rounded" class="w-32 h-32 mx-auto rounded-full border-3 border-surface-200 dark:border-surface-700 overflow-hidden bg-surface-50 dark:bg-surface-800">
        <img v-if="props.currentProfilePictureUrl" 
                :src="getImageUrl(props.currentProfilePictureUrl)" 
                class="w-full h-full object-cover" 
                alt="Profile" />
        <div v-else class="w-full h-full flex items-center justify-center">
            <i class="pi pi-user text-4xl text-surface-400"></i>
        </div>
    </div>
    <div v-else class="w-32 h-32 mx-auto border-3 border-surface-200 dark:border-surface-700 overflow-hidden bg-surface-50 dark:bg-surface-800">
        <img v-if="props.currentProfilePictureUrl" 
                :src="getImageUrl(props.currentProfilePictureUrl)" 
                class="w-full h-full object-cover" 
                alt="Profile" />
        <div v-else class="w-full h-full flex items-center justify-center">
            <i class="pi pi-user text-4xl text-surface-400"></i>
        </div>
    </div>
</template>
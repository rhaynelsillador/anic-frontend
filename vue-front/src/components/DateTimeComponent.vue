<script lang="ts" setup>

const props = defineProps({
    data : String
});

const getLabel = () => {
    if(props.data){
        try {
            return formatter.format(new Date(props.data));
        } catch (error) {
            
        }
        
    }return null;
}

const formatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short'
});


</script>

<template>
    <span>{{ getLabel() }}</span>
</template>
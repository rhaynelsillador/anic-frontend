<script lang="ts" setup>

const defaultFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short'
});


const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
});


const props = defineProps({
    data : String,
    formatter: String
});

const getLabel = () => {
    if(props.data){
        if(props.formatter && props.formatter === "YYYY/MM/DD"){
            return dateFormatter.format(new Date(props.data));
        }else{
            try {
                return defaultFormatter.format(new Date(props.data));
            } catch (error) {

            }
        }
        
    }return null;
}





</script>

<template>
    <span>{{ getLabel() }}</span>
</template>
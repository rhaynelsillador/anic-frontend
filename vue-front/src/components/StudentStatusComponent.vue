<script lang="ts" setup>

const props = defineProps({
    status : String,
    text : String
});

const getStatusLabel = () => {
    if (props.status == "GRADUATED") {
        return "Graduated"
    }else if(props.status == "TRANSFERRED"){
        return "Transferred"
    } else if (props.status == "DROPPED") {
        return "Dropped"
    }else if (props.status == "INCOMPLETE") {
        return "Incomplete"
    }
    return ""
}

const getStatus = () => {
    if (props.status == "GRADUATED" || props.status == "TRANSFERRED") {
        return "info"
    } else if (props.status == "DROPPED" || props.status == "INCOMPLETE") {
        return "danger"
    }
    return "primary"
}
</script>

<template>
    <Message :severity="getStatus()">{{ getStatusLabel() + ' ' + props.text }}</Message>
</template>
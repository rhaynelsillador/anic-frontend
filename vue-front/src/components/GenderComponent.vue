<script lang="ts" setup>

const props = defineProps({
    data : String
});

const getLabel = () => {
    if (props.data == "MALE") {
        return "Male"
    }else if(props.data == "FEMALE"){
        return "Female"
    }
    return "Invalid"
}

const getStatus = () => {
    if (props.data == "MALE") {
        return "info"
    }
    return "primary"
}
</script>

<template>
    <Tag :severity="getStatus()" :value="getLabel()"/>
</template>
<template>
    <Toolbar class="mb-6">
        <template #start>
            <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew({})" />
        </template>

        <template #end>
            <Button icon="pi pi-refresh" rounded raised @click="reloadData" />
        </template>
    </Toolbar>
    <div class="card">

        <DataTable ref="dt" :value="dataList" dataKey="id" :paginator="true" :rows="10" :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} data">
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Manage Classes and Courses</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>
            <Column field="code" header="Class Code" sortable style="min-width: 12rem">
                <template #body="slotProps">
                    <a href="javascript:void(0)" @click="() => { openNew(slotProps.data) }">{{
                        slotProps.data.code }}</a>
                </template>
            </Column>
            <Column field="name" header="Class Name" sortable style="min-width: 16rem"></Column>

            <Column field="prerequisiteYear" header="Prerequisite Year" style="min-width: 16rem">
                <template #body="slotProps">
                    <Tag v-if="slotProps.data.prerequisiteYear == null" severity="warn" value="None"></Tag>
                    <Tag v-else severity="success"
                        :value="slotProps.data.prerequisiteYear.name + ' : (' + slotProps.data.prerequisiteYear.code + ')'">
                    </Tag>
                </template>
            </Column>

            <Column field="groupYearLevel" header="Type" style="min-width: 10rem">
                <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <Tag v-if="slotProps.data.groupYearLevel == 'ELEMENTARY'" severity="success" value="Elementary">
                        </Tag>
                        <Tag v-else-if="slotProps.data.groupYearLevel == 'JUNIOR_HIGH'" severity="info"
                            value="Junior High">
                        </Tag>
                        <Tag v-else-if="slotProps.data.groupYearLevel == 'SENIOR_HIG'" severity="warn"
                            value="Senior High">
                        </Tag>
                        <Tag v-else-if="slotProps.data.groupYearLevel == 'COLLEGE'" severity="danger" value="College">
                        </Tag>
                        <Tag v-else severity="danger" :value="slotProps.data.groupYearLevel">
                        </Tag>
                    </div>
                </template>
            </Column>
            <Column field="createdDate" header="Created At" sortable style="min-width: 13rem">
                <template #body="{ data }">
                    <DateTimeComponent :data="data.createdDate"></DateTimeComponent>
                </template>
            </Column>
            <Column field="updatedDate" header="Updated At" sortable style="min-width: 13rem">
                <template #body="{ data }">
                    <DateTimeComponent :data="data.updatedDate"></DateTimeComponent>
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="dialog" :style="{ width: '450px' }" header="Classes Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="code" class="block font-bold mb-3">Class/Course Code (Auto generated when empty)</label>
                    <InputText id="code" v-model.trim="classInfo.code" required="true" autofocus
                        :invalid="submitted && !classInfo.name" fluid />
                    <small v-if="submitted && !classInfo.code" class="text-red-500">Code is required.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Class/Course Name</label>
                    <InputText id="name" v-model.trim="classInfo.name" required="true"
                        :invalid="submitted && !classInfo.name" fluid />
                    <small v-if="submitted && !classInfo.name" class="text-red-500">Name is required.</small>
                </div>

                <div>
                    <label for="adviser" class="block font-bold mb-3">Type</label>
                    <Select v-model.trim="classInfo.groupYearLevel" :options="groupLevels" :showClear="true"
                        v-on:change="() => { prerequisites.filter(d => d.code == classInfo.code && d.groupYearLevel == classInfo.groupYearLevel).length == 0 ? classInfo.prerequisiteYear = null : null }"
                        optionLabel="name" optionValue="code" class="w-full"></Select>
                    <small v-if="submitted && !classInfo.groupYearLevel" class="text-red-500">Adviser is
                        required.</small>
                </div>

                <div>
                    <label for="adviser" class="block font-bold mb-3">Prerequisite</label>
                    <Select v-model.trim="classInfo.prerequisiteYear"
                        :options="prerequisites.filter(d => d.groupYearLevel == classInfo.groupYearLevel)"
                        :showClear="true" optionLabel="name" class="w-full"></Select>
                    <small v-if="submitted && !classInfo.prerequisiteYear" class="text-red-500">Adviser is
                        required.</small>
                </div>

            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="submit" />
            </template>
        </Dialog>

        <Toast position="top-right" group="tl" />
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

import { useToast } from "primevue/usetoast";

const toast = useToast();

import { groupLevels } from '@/const';
import ClassesResponse from '@/types/classes';
import TeacherResponse from '@/types/teacher';
import YearLevelResponse from '@/types/year_level';
import DateTimeComponent from '@/components/DateTimeComponent.vue';

const fTmp = {
    global: { value: "", matchMode: FilterMatchMode.CONTAINS }
}

const dataList = ref([]);
const filters = ref(fTmp);
const loadLazyTimeout = ref(null)
const totalRecords = ref(0)
const dialog = ref(false);
const classInfo = ref({});
const submitted = ref(false);
const teachers = ref([])
const yearLevels = ref([])
const prerequisites = ref([])

onMounted(() => {
    // Get the data from the server
    loadData({ filters: filters.value })
});

function onPage(event) {
    loadData(event)
}

const loadData = (filter) => {
    let model = new ClassesResponse()
    model.getData(filter,
        (data) => {
            dataList.value = data.data;
            totalRecords.value = data.page.totalCount;

            prerequisites.value = dataList.value.map(({ id, name, code, groupYearLevel }) => ({
                id,
                name,
                code,
                groupYearLevel
            }));

            console.log("prerequisites ", prerequisites)
        },
        (err) => {
            console.log(err)
        })
}

const fetchTechers = () => {
    let model = new TeacherResponse()
    model.getTeachers({ rows: 1000 },
        (data) => teachers.value = data.data,
        (err) => console.log(err))
}


const fetchYearLevels = () => {
    let model = new YearLevelResponse()
    model.getData({ rows: 1000 },
        (data) => yearLevels.value = data.data,
        (err) => console.log(err))
}

function openNew(data) {
    classInfo.value = JSON.parse(JSON.stringify(data));
    if (classInfo.value.prerequisiteYear) {
        classInfo.value.prerequisiteYear = {
            id: classInfo.value.prerequisiteYear.id,
            name: classInfo.value.prerequisiteYear.name,
            code: classInfo.value.prerequisiteYear.code,
            groupYearLevel: classInfo.value.groupYearLevel
        }
    }
    submitted.value = false;
    dialog.value = true;
    fetchTechers();
    fetchYearLevels();
}

function hideDialog() {
    dialog.value = false;
    submitted.value = false;
}

function saveProduct() {
    submitted.value = true;
}

const reloadData = () => {
    filters.value = fTmp;
    loadData({
        filters: filters.value
    })
}

const submit = () => {
    let model = new ClassesResponse()
    model.sendData(classInfo.value,
        (data) => {
            if (data.status == "SUCCESS") {
                toast.add({ severity: 'success', summary: 'Success', detail: data.message, group: 'tl', life: 3000 });
                hideDialog()
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: data.message, group: 'tl', life: 3000 });
            }
            loadData({
                filters: filters.value
            })
        },
        (err) => toast.add({ severity: 'error', summary: 'Error', detail: err.response.data.message, group: 'tl', life: 3000 }))
}

</script>

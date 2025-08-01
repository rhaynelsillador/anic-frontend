<script setup lang="ts">
import { enrollmentType, genders } from '@/const';
import SectionResponse from '@/types/section';
import SubjectResponse from '@/types/subject';
import YearLevelResponse from '@/types/year_level';
import StudentStatusComponent from '@/components/StudentStatusComponent.vue'
import { onMounted, ref, watch } from 'vue';

import { useGlobalStore } from '@/stores/global';
import EnrollmentResponse from '@/types/enrollment';
import StudentResponse from '@/types/student';
import { useToast } from "primevue/usetoast";
import { useRoute } from 'vue-router';

const route = useRoute();
const toast = useToast();

const student = ref({ yearLevelData:null,
    id : null,
    sectionData : null,
    yearLevel : null,
    firstName: null,
    lastName: null,
    middleName: null,
    gender: null,
    section: null,
    enrollmentType: null,
    status: null,
    lrn: null,
    birthday :null,
    email : null,
    contactNumber : null,
    address : null,
    information: {
        religion : null,
        nationality : null,
        motherName : null,
        fatherName : null,
        parentContactInfo : null,
        parentAddress : null,
        batch : null,
        guardian : null,
        guardianContactInfo : null,
        guardianAddress : null
    } 
})

const yearLevels = ref([])
const sections = ref([])
const subjects = ref([])


onMounted(() => {
    // Get the data from the server
    loadData()
    if (route.query.id) {
        loadStudentData(route.query.id)
    }
});

watch(() => route.fullPath, () => {
    student.value = {
        id : null,
        yearLevelData: null,
        information: {}
    }
})


function loadData() {
    let model = new YearLevelResponse();
    model.getData({
        rows: 100
    },
        (data) => {
            yearLevels.value = data.data.map(cls => ({
                name: cls.name,
                code: String(cls.id) // convert number to string, if needed
            }));

        },
        (err) => {
            console.log(err)
        })
}

function loadStudentData(id) {
    let model = new StudentResponse();
    model.getDataById(id,
        (data) => {
            console.log(data)
            student.value = data.data
            if (student.value.information == null) {
                student.value.information = {}
            }

        },
        (err) => {
            console.log(err)
        })
}

const loadSectionData = () => {
    let model = new SectionResponse();
    model.getData({
        filters: {
            yearLevel: { value: student.value.yearLevelData.name, matchMode: 'equals' },
            schoolYear: { value: useGlobalStore().appConfig.schoolYear, matchMode: 'equals' }
        },
        rows: 100
    },
        (data) => {
            sections.value = data.data.map(cls => ({
                name: cls.name,
                code: String(cls.id) // convert number to string, if needed
            }));

        },
        (err) => {
            console.log(err)
        })

    loadSubjectData()

}

const loadSubjectData = () => {
    let model = new SubjectResponse();
    model.getData({
        filters: { yearLevel: { value: student.value.yearLevelData.name, matchMode: 'equals' } },
        rows: 100
    },
        (data) => {
            subjects.value = data.data;
        },
        (err) => {
            subjects.value = []
        })

}

const submitStudent = () => {
    if (student.value.id) {
        // Update student information
        updateStudent()
    } else {
        // Enroll new student
        createNewStudent()
    }
}

const updateStudent = () => {
    console.log(student.value)
    let model = new StudentResponse();
    model.updateStudent(student.value,
        (data) => {
            console.log(data)
            // student.value = data.data
            if (data.status == "SUCCESS") {
                toast.add({ severity: 'success', summary: 'Success', detail: data.message, group: 'tl', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: data.message, detail: Object.values(data.data).join('\n'), group: 'tl', life: 3000 });
            }

        },
        (err) => {
            console.log(err)
        })
}

const createNewStudent = () => {
    if (student.value.yearLevelData) {
        student.value.yearLevel = student.value.yearLevelData.code
    }
    if (student.value.sectionData) {
        student.value.section = student.value.sectionData.code
    }

    if (student.value.firstName == undefined) {
        toast.add({ severity: 'error', summary: 'Error', detail: "Firstname is required.", group: 'tl', life: 3000 });
    } else if (student.value.middleName == undefined) {
        toast.add({ severity: 'error', summary: 'Error', detail: "Middle name is required.", group: 'tl', life: 3000 });
    } else if (student.value.lastName == undefined) {
        toast.add({ severity: 'error', summary: 'Error', detail: "Lastname is required.", group: 'tl', life: 3000 });
    } else if (student.value.gender == undefined) {
        toast.add({ severity: 'error', summary: 'Error', detail: "Gender is required.", group: 'tl', life: 3000 });
    } else if (student.value.birthday == undefined) {
        toast.add({ severity: 'error', summary: 'Error', detail: "Birthday is required.", group: 'tl', life: 3000 });
    } else if (student.value.enrollmentType == undefined) {
        toast.add({ severity: 'error', summary: 'Error', detail: "Enrollment type is required.", group: 'tl', life: 3000 });
    } else {
        let model = new EnrollmentResponse();

        model.postData(student.value,
            (data) => {
                if (data.status == "SUCCESS") {
                    toast.add({ severity: 'success', summary: 'Success', detail: data.message, group: 'tl', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: data.message, detail: Object.values(data.data).join('\n'), group: 'tl', life: 3000 });
                }
            },
            (err) => {
                console.log(err)
            })

        console.log(student.value)
    }
}

const onUpload = () => {

}

</script>

<template>

    <div class="card1">
        <Toolbar class="mb-6">
            <template #start>
                {{ student.id ? 'Update Student Information' : 'Register New Student' }}
            </template>

            <template #end>
                <Button :label="student.id ? 'Update' : 'Enroll'" icon="pi pi-sign-in" severity="primary"
                    @click="submitStudent" />
            </template>
        </Toolbar>
        <Fluid>
            <div class="flex flex-col md:flex-row gap-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="flex justify-between">
                        <div class="font-semibold text-l">Student Informations</div>
                        <StudentStatusComponent :status="student.status" :text="' (Batch' + student.information.batch + ') '"></StudentStatusComponent>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="firstname2">LRN</label>
                            <InputText id="lrn" type="text" v-model="student.lrn" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="firstname2">Firstname</label>
                            <InputText id="firstname2" type="text" v-model="student.firstName" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Middle Name</label>
                            <InputText id="lastname2" type="text" v-model="student.middleName" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Lastname</label>
                            <InputText id="lastname2" type="text" v-model="student.lastName" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Gender</label>
                            <Select id="state" v-model="student.gender" :options="genders" optionLabel="name"
                                optionValue="code" placeholder="Select One" class="w-full"></Select>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Birthday</label>
                            <DatePicker v-model="student.birthday" class="w-full" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Contact</label>
                            <InputText id="lastname2" type="text" v-model="student.contactNumber" />
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Email</label>
                            <InputText id="email2" type="text" v-model="student.email" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="address">Address</label>
                            <Textarea id="address" rows="1" v-model="student.address" />
                        </div>

                        <div class="flex flex-wrap gap-2 w-full"></div>
                    </div>
                </div>
            </div>
            <br>
            <div class="flex flex-col md:flex-row gap-8">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-l">More Information</div>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Religion</label>
                            <InputText id="lastname2" type="text" v-model="student.information.religion" />
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Nationality</label>
                            <InputText id="lastname2" type="text" v-model="student.information.nationality" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full"></div>
                    </div>
                    <hr>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Mother's Name</label>
                            <InputText id="lastname2" type="text" v-model="student.information.motherName" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="state">Father's Name</label>
                                <InputText id="lastname2" type="text" v-model="student.information.fatherName" />
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="state">Contact Information</label>
                                <InputText id="lastname2" type="text" v-model="student.information.parentContactInfo" />
                            </div>
                        </div>

                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="address">Address</label>
                            <Textarea id="address" rows="1" v-model="student.information.parentAddress" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full"></div>
                    </div>
                    <hr>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Guardian Name</label>
                            <InputText id="lastname2" type="text" v-model="student.information.guardian" />
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="state">Contact Information</label>
                                <InputText id="lastname2" type="text"
                                    v-model="student.information.guardianContactInfo" />
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full"></div>

                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="address">Address</label>
                            <Textarea id="address" rows="1" v-model="student.information.guardianAddress" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full"></div>
                    </div>



                </div>
            </div>

            <br v-if="student != null && student.id == null">
            <div class="flex flex-col md:flex-row gap-8" v-if="student != null && student.id == null">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-l">Class Information</div>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Enrollment Type</label>
                            <Select id="state" v-model="student.enrollmentType" :options="enrollmentType"
                                optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></Select>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Grade Level</label>
                            <Select id="state" v-model="student.yearLevelData" :options="yearLevels" optionLabel="name"
                                placeholder="Select One" class="w-full" @change="loadSectionData"></Select>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="state">Section</label>
                                <Select id="state" v-model="student.sectionData" :options="sections" optionLabel="name"
                                    placeholder="Select One" class="w-full"></Select>
                            </div>
                        </div>

                    </div>

                    <div class="flex flex-col md:flex-row gap-4" v-if="subjects.length > 0">
                        <DataTable :value="subjects" scrollHeight="400px" class="mt-6">
                            <Column field="code" header="Code" style="min-width: 200px"></Column>
                            <Column field="name" header="Name" style="min-width: 200px"></Column>
                        </DataTable>
                    </div>

                </div>
            </div>

            <br>
            <div class="grid grid-cols-12 gap-8">
                <div class="col-span-full lg:col-span-6">
                    <div class="card">
                        <div class="font-semibold text-l mb-4">Documents Upload</div>
                        <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*"
                            :maxFileSize="1000000" customUpload />
                    </div>
                </div>
            </div>

        </Fluid>
        <Toast position="top-right" group="tl" />
    </div>
</template>

<script setup>
import StudentResponse from '@/types/student';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AcademicRecordsView from './forms/AcademicRecordView.vue';

const route = useRoute()

const items = ref([
    {
        label: 'Save',
        icon: 'pi pi-check'
    },
    {
        label: 'Update',
        icon: 'pi pi-upload'
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash'
    },
    {
        label: 'Home Page',
        icon: 'pi pi-home'
    }
]);

const studentInfo = ref({})
const academicRecord = ref([])


onMounted(() => {
    const userId = route.params.id

    loadStudentData(userId)
    loadAcademicDataById(userId)
})

function loadStudentData(id) {
    let model = new StudentResponse();
    model.getDataById(id,
        (data) => {
            console.log(data)
            studentInfo.value = data.data
            if (studentInfo.value.information == null) {
                studentInfo.value.information = {}
            }

        },
        (err) => {
            console.log(err)
        })
}


function loadAcademicDataById(id) {
    let model = new StudentResponse();
    model.getAcademicDataById(id,
        (data) => {
            console.log(data)
            academicRecord.value = data.data

        },
        (err) => {
            console.log(err)
        })
}

</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl mb-4">Toolbar</div>
            <Toolbar>
                <template #start>
                    <Button icon="pi pi-plus" class="mr-2" severity="secondary" text />
                    <Button icon="pi pi-print" class="mr-2" severity="secondary" text />
                    <Button icon="pi pi-upload" severity="secondary" text />
                </template>

                <template #center>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Search" />
                    </IconField>
                </template>

                <template #end> <SplitButton label="Save" :model="items"></SplitButton></template>
            </Toolbar>
        </div>

        
        <div class="flex flex-col gap-8">
        
            <div class="md:w-2/2 mt-6 md:mt-0">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Student Information</div>
                    <div class="flex flex-row gap-8">
                    <div class="md:w-1/2 mt-6 md:mt-0">
                     <table class="table student-info">
                                    <tr>
                                        <th style="min-width: 120px;">LRN : </th>
                                        <td>{{ studentInfo.lrn }}</td>
                                    </tr>
                                    <tr>
                                        <th>Student ID : </th>
                                        <td>{{ studentInfo.studentId }}</td>
                                    </tr>
                                    <tr>
                                        <th>Name : </th>
                                        <td>{{ studentInfo.fullName }}</td>
                                    </tr>
                                    <tr>
                                        <th>Gender : </th>
                                        <td>{{ studentInfo.gender }}</td>
                                    </tr>
                                    <tr>
                                        <th>Birthday : </th>
                                        <td>{{studentInfo.birthday}}</td>
                                    </tr>
                                    <tr>
                                        <th>Contact : </th>
                                        <td>{{studentInfo.contactNumber}}</td>
                                    </tr>
                                    <tr>
                                        <th>Email : </th>
                                        <td>{{studentInfo.email}}</td>
                                    </tr>
                                    <tr>
                                        <th>Address : </th>
                                        <td>{{studentInfo.address}}</td>
                                    </tr>
                                    <tr>
                                        <th>Status : </th>
                                        <td>{{studentInfo.status}}</td>
                                    </tr>
                                </table>
                                </div>

                                <div class="md:w-1/2 mt-6 md:mt-0">
                     <table class="table student-info" v-if="studentInfo.information">
                                    <tr>
                                        <th>Religion : </th>
                                        <td>{{ studentInfo.information.religion }}</td>
                                    </tr>
                                    <tr>
                                        <th>Nationality : </th>
                                        <td>{{ studentInfo.information.nationality }}</td>
                                    </tr>
                                    <tr>
                                        <th>Mother's Name : </th>
                                        <td>{{ studentInfo.information.motherName }}</td>
                                    </tr>
                                    <tr>
                                        <th>Father's Name : </th>
                                        <td>{{ studentInfo.information.fatherName }}</td>
                                    </tr>
                                    <tr>
                                        <th>Parent ContactInfo : </th>
                                        <td>{{studentInfo.information.parentContactInfo}}</td>
                                    </tr>
                                    <tr>
                                        <th>Parent Address : </th>
                                        <td>{{studentInfo.information.parentAddress}}</td>
                                    </tr>
                                    <tr>
                                        <th>Guardian : </th>
                                        <td>{{studentInfo.information.guardian}}</td>
                                    </tr>
                                    <tr>
                                        <th>Guardian ContactInfo : </th>
                                        <td>{{studentInfo.information.guardianContactInfo}}</td>
                                    </tr>
                                    <tr>
                                        <th>Guardian Address : </th>
                                        <td>{{studentInfo.information.guardianAddress}}</td>
                                    </tr>
                                </table>
                                </div>
                                </div>
                </div>
            </div>
            
        </div>

        <br>

        <div class="flex flex-col gap-8">
        
            <div class="md:w-2/2 mt-6 md:mt-0">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Academic Records</div>
                    <hr>
                    <AcademicRecordsView :academicRecord="academicRecord"></AcademicRecordsView>
                </div>
            </div>
            
        </div>
    </div>
</template>


<style lang="css">

.student-info {
  border-collapse: separate;
  border-spacing: 0 10px; /* 0 = column gap, 10px = row gap */

}


.student-info > tr > th {
  text-align: right;
}

.student-info td {
  padding-left: 16px; /* adjust as needed */
}

</style>
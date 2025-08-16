<script setup lang="ts">
import { enrollmentType, genders } from '@/const';
import SectionResponse from '@/types/section';
import SubjectResponse from '@/types/subject';
import YearLevelResponse from '@/types/year_level';
import StudentStatusComponent from '@/components/StudentStatusComponent.vue'
import { onMounted, ref, watch, computed } from 'vue';

import { useGlobalStore } from '@/stores/global';
import EnrollmentResponse from '@/types/enrollment';
import StudentResponse from '@/types/student';
import { useToast } from "primevue/usetoast";
import { useRoute } from 'vue-router';
import { fileUploadService } from '@/api/fileUploadService';
import { getProfilePictureUrl } from '@/config/app';
import router from '@/router';

const route = useRoute();
const toast = useToast();

// Helper function to get full image URL (using shared config)
const getImageUrl = getProfilePictureUrl;

// Computed property to get the current profile picture URL
const currentProfilePictureUrl = computed(() => {
    return student.value.profilePictureUrl || student.value.photoUrl || null;
});

const student = ref({
    yearLevelData: null,
    id: null,
    sectionData: null,
    yearLevel: null,
    firstName: null,
    lastName: null,
    middleName: null,
    gender: null,
    section: null,
    enrollmentType: null,
    status: null,
    lrn: null,
    birthday: null,
    email: null,
    contactNumber: null,
    address: null,
    profilePicture: null,
    profilePictureUrl: null,
    photoUrl: null, // Backend field for profile picture URL
    information: {
        religion: null,
        nationality: null,
        motherName: null,
        fatherName: null,
        parentContactInfo: null,
        parentAddress: null,
        batch: null,
        guardian: null,
        guardianContactInfo: null,
        guardianAddress: null
    }
})

const yearLevels = ref([])
const sections = ref([])
const subjects = ref([])
const selectedFiles = ref([])
const profileImageUrl = ref(null)


onMounted(() => {
    // Get the data from the server
    loadData()
    if (route.query.id) {
        loadStudentData(route.query.id)
    }
});

watch(() => route.fullPath, () => {
    student.value = {
        id: null,
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

        })
}

function loadStudentData(id) {
    let model = new StudentResponse();
    model.getDataById(id,
        (data) => {
            student.value = data.data

            // Map backend photoUrl to frontend profilePictureUrl
            if (student.value.photoUrl && !student.value.profilePictureUrl) {
                student.value.profilePictureUrl = student.value.photoUrl;
            }

            if (student.value.information == null) {
                student.value.information = {}
            }

        },
        (err) => {
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
    let model = new StudentResponse();
    model.updateStudent(student.value,
        (data) => {
            // student.value = data.data
            if (data.status == "SUCCESS") {
                toast.add({ severity: 'success', summary: 'Success', detail: data.message, group: 'tl', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: data.message, detail: Object.values(data.data).join('\n'), group: 'tl', life: 3000 });
            }
            if (route.query.back) {
                router.go(-1);
            }
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
            })
    }
}

const onUpload = (event) => {
    selectedFiles.value = event.files;
    toast.add({ severity: 'info', summary: 'Success', detail: 'Files uploaded', group: 'tl', life: 3000 });
}

const onProfilePictureSelect = async (event) => {
    const files = event.files;
    if (files && files.length > 0) {
        const file = files[0];

        try {
            // Show loading state
            toast.add({ severity: 'info', summary: 'Uploading...', detail: 'Profile picture is being uploaded', group: 'tl', life: 2000 });

            // Upload file immediately
            const response = await fileUploadService.uploadProfilePicture(file);

            if (response.code === 20) { // SUCCESS code from backend
                // Store the uploaded file info
                student.value.profilePicture = file;
                student.value.profilePictureUrl = response.data.fileUrl;
                // Clear the local preview since we now have server URL
                profileImageUrl.value = null;

                toast.add({
                    severity: 'success',
                    summary: 'Upload Successful',
                    detail: 'Profile picture uploaded successfully',
                    group: 'tl',
                    life: 3000
                });
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.add({
                severity: 'error',
                summary: 'Upload Failed',
                detail: error.message || 'Failed to upload profile picture',
                group: 'tl',
                life: 5000
            });

            // Clear the failed selection
            student.value.profilePicture = null;
            student.value.profilePictureUrl = null;
            profileImageUrl.value = null;
        }
    }
}

const removeProfilePicture = async () => {
    try {
        // If there's a server-uploaded file, delete it from server
        if (student.value.profilePictureUrl) {
            await fileUploadService.deleteFile(student.value.profilePictureUrl);
        }

        // Clear local references
        student.value.profilePicture = null;
        student.value.profilePictureUrl = null;
        profileImageUrl.value = null;

        toast.add({
            severity: 'info',
            summary: 'Image Removed',
            detail: 'Profile picture removed successfully',
            group: 'tl',
            life: 3000
        });
    } catch (error) {
        console.error('Error removing profile picture:', error);
        // Still clear local references even if server deletion fails
        student.value.profilePicture = null;
        student.value.profilePictureUrl = null;
        profileImageUrl.value = null;

        toast.add({
            severity: 'warn',
            summary: 'Partially Removed',
            detail: 'Profile picture removed locally, but may still exist on server',
            group: 'tl',
            life: 3000
        });
    }
}

const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

</script>

<template>
        <Toolbar class="mb-6">
            <template #start>
                <div class="flex items-center gap-3">
                    <i class="pi pi-user-plus text-primary text-xl"></i>
                    <span class="text-xl font-semibold">{{ student.id ? 'Update Student Information' : 'Register NewStudent' }}</span>
                </div>
            </template>

            <template #end>
                <Button :label="student.id ? 'Update Student' : 'Enroll Student'"
                    :icon="student.id ? 'pi pi-save' : 'pi pi-sign-in'" severity="primary" size="large"
                    @click="submitStudent" />
            </template>
        </Toolbar>

        <div class="grid grid-cols-12 card">
            <!-- Profile Picture Section -->
            <div class="col-span-12 lg:col-span-3">
                <div class="card h-fit">
                    <div class="text-center">
                        <h5 class="font-semibold mb-4">Profile Picture</h5>

                        <!-- Profile Picture Display -->
                        <div class="relative inline-block mb-4">

                            <ProfilePicture :currentProfilePictureUrl="currentProfilePictureUrl"></ProfilePicture>

                            <!-- Remove button if image exists -->
                            <Button v-if="currentProfilePictureUrl" icon="pi pi-times" severity="danger" rounded
                                size="small" class="absolute -top-2 -right-2" @click="removeProfilePicture" />
                        </div>

                        <!-- Upload Button -->
                        <FileUpload mode="basic" name="profilePicture" accept="image/*" :maxFileSize="2000000"
                            :customUpload="true" @select="onProfilePictureSelect" choose-label="Choose Photo"
                            choose-icon="pi pi-camera" class="w-full" />
                        <small class="text-muted-color">Max file size: 2MB. Formats: JPG, PNG, GIF</small>
                    </div>
                </div>

                <!-- Student Status -->
                <div class="card mt-4" v-if="student.status">
                    <div class="text-center">
                        <h6 class="font-semibold mb-3">Current Status</h6>
                        <StudentStatusComponent :status="student.status"
                            :text="student.information.batch ? ` (Batch ${student.information.batch})` : ''" />
                    </div>
                </div>
            </div>

            <!-- Main Form Section -->
            <div class="col-span-12 lg:col-span-9">
                <!-- Personal Information -->
                <div class="flex items-center gap-3 mb-6">
                    <i class="pi pi-user text-primary text-xl"></i>
                    <h5 class="font-semibold text-xl">Personal Information</h5>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div class="flex flex-col gap-2">
                        <label for="lrn" class="font-semibold text-sm">LRN</label>
                        <InputText id="lrn" v-model="student.lrn" placeholder="Enter LRN" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="firstName" class="font-semibold text-sm">First Name *</label>
                        <InputText id="firstName" v-model="student.firstName" placeholder="Enter first name" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="middleName" class="font-semibold text-sm">Middle Name *</label>
                        <InputText id="middleName" v-model="student.middleName" placeholder="Enter middle name" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="lastName" class="font-semibold text-sm">Last Name *</label>
                        <InputText id="lastName" v-model="student.lastName" placeholder="Enter last name" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div class="flex flex-col gap-2">
                        <label for="gender" class="font-semibold text-sm">Gender *</label>
                        <Select id="gender" v-model="student.gender" :options="genders" optionLabel="name"
                            optionValue="code" placeholder="Select Gender" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="birthday" class="font-semibold text-sm">Birthday *</label>
                        <DatePicker id="birthday" v-model="student.birthday" placeholder="Select birthday" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="contactNumber" class="font-semibold text-sm">Contact Number</label>
                        <InputText id="contactNumber" v-model="student.contactNumber"
                            placeholder="Enter contact number" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="email" class="font-semibold text-sm">Email</label>
                        <InputText id="email" v-model="student.email" type="email" placeholder="Enter email address" />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="address" class="font-semibold text-sm">Address</label>
                        <Textarea id="address" v-model="student.address" rows="2"
                            placeholder="Enter complete address" />
                    </div>
                </div>
            </div>
            <div class="col-span-12">
                <!-- Parents Information -->
                <Divider align="left">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-users text-primary"></i>
                        <span class="font-semibold">Additional Information</span>
                    </div>
                </Divider>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="flex flex-col gap-2">
                        <label for="religion" class="font-semibold text-sm">Religion</label>
                        <InputText id="religion" v-model="student.information.religion" placeholder="Enter religion" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="nationality" class="font-semibold text-sm">Nationality</label>
                        <InputText id="nationality" v-model="student.information.nationality"
                            placeholder="Enter nationality" />
                    </div>
                </div>

                
                <Divider align="left">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-users text-primary"></i>
                        <span class="font-semibold">Parents Information</span>
                    </div>
                </Divider>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div class="flex flex-col gap-2">
                        <label for="motherName" class="font-semibold text-sm">Mother's Name</label>
                        <InputText id="motherName" v-model="student.information.motherName"
                            placeholder="Enter mother's name" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="fatherName" class="font-semibold text-sm">Father's Name</label>
                        <InputText id="fatherName" v-model="student.information.fatherName"
                            placeholder="Enter father's name" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="parentContact" class="font-semibold text-sm">Parents Contact</label>
                        <InputText id="parentContact" v-model="student.information.parentContactInfo"
                            placeholder="Enter contact number" />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 mb-6">
                    <div class="flex flex-col gap-2">
                        <label for="parentAddress" class="font-semibold text-sm">Parents Address</label>
                        <Textarea id="parentAddress" v-model="student.information.parentAddress" rows="2"
                            placeholder="Enter parents address" />
                    </div>
                </div>

                <!-- Guardian Information -->
                <Divider align="left">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-shield text-primary"></i>
                        <span class="font-semibold">Guardian Information</span>
                    </div>
                </Divider>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="flex flex-col gap-2">
                        <label for="guardianName" class="font-semibold text-sm">Guardian Name</label>
                        <InputText id="guardianName" v-model="student.information.guardian"
                            placeholder="Enter guardian's name" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="guardianContact" class="font-semibold text-sm">Guardian Contact</label>
                        <InputText id="guardianContact" v-model="student.information.guardianContactInfo"
                            placeholder="Enter contact number" />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="guardianAddress" class="font-semibold text-sm">Guardian Address</label>
                        <Textarea id="guardianAddress" v-model="student.information.guardianAddress" rows="2"
                            placeholder="Enter guardian address" />
                    </div>
                </div>

                <!-- Class Information (Only for new students) -->
                <div class="mb-6" v-if="student != null && student.id == null">
                    <div class="flex items-center gap-3 mb-6">
                        <i class="pi pi-graduation-cap text-primary text-xl"></i>
                        <h5 class="font-semibold text-xl">Class Information</h5>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="flex flex-col gap-2">
                            <label for="enrollmentType" class="font-semibold text-sm">Enrollment Type *</label>
                            <Select id="enrollmentType" v-model="student.enrollmentType" :options="enrollmentType"
                                optionLabel="name" optionValue="code" placeholder="Select Type" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="yearLevel" class="font-semibold text-sm">Grade Level *</label>
                            <Select id="yearLevel" v-model="student.yearLevelData" :options="yearLevels"
                                optionLabel="name" placeholder="Select Grade Level" @change="loadSectionData" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="section" class="font-semibold text-sm">Section *</label>
                            <Select id="section" v-model="student.sectionData" :options="sections" optionLabel="name"
                                placeholder="Select Section" />
                        </div>
                    </div>

                    <!-- Subjects Table -->
                    <div v-if="subjects.length > 0">
                        <Divider align="left">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-book text-primary"></i>
                                <span class="font-semibold">Subjects for Selected Grade Level</span>
                            </div>
                        </Divider>
                        <DataTable :value="subjects" scrollHeight="300px" class="mt-4">
                            <Column field="code" header="Subject Code" style="min-width: 120px">
                                <template #body="{ data }">
                                    <Tag :value="data.code" severity="info" />
                                </template>
                            </Column>
                            <Column field="name" header="Subject Name" style="min-width: 200px"></Column>
                            <Column field="description" header="Description" style="min-width: 250px"></Column>
                        </DataTable>
                    </div>
                </div>

                <!-- Documents Upload -->
                <div class="flex items-center gap-3 mb-6">
                    <i class="pi pi-file text-primary text-xl"></i>
                    <h5 class="font-semibold text-xl">Documents Upload</h5>
                </div>

                <FileUpload name="documents[]" @uploader="onUpload" :multiple="true"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" :maxFileSize="5000000" :customUpload="true">
                    <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                        <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                            <div class="flex gap-2">
                                <Button @click="chooseCallback()" icon="pi pi-plus" severity="primary"
                                    label="Choose Files"></Button>
                                <Button @click="uploadCallback()" icon="pi pi-upload" severity="secondary"
                                    label="Upload" :disabled="!files || files.length === 0"></Button>
                                <Button @click="clearCallback()" icon="pi pi-times" severity="danger" label="Cancel"
                                    :disabled="!files || files.length === 0"></Button>
                            </div>
                        </div>
                    </template>
                    <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                        <div class="flex flex-col gap-8 pt-4">
                            <div v-if="files.length > 0">
                                <h6>Pending Files</h6>
                                <div class="flex flex-wrap gap-4">
                                    <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                                        class="p-4 rounded-border flex flex-col border border-surface items-center gap-4">
                                        <div>
                                            <img role="presentation" :alt="file.name" :src="file.objectURL"
                                                width="100" height="50" v-if="file.type.startsWith('image/')" />
                                            <i class="pi pi-file text-4xl text-primary" v-else></i>
                                        </div>
                                        <span
                                            class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                                            file.name }}</span>
                                        <div>{{ formatSize(file.size) }}</div>
                                        <Badge value="Pending" severity="warn"></Badge>
                                        <Button icon="pi pi-times" @click="removeFileCallback(index)"
                                            severity="danger" text rounded></Button>
                                    </div>
                                </div>
                            </div>

                            <div v-if="uploadedFiles.length > 0">
                                <h6>Uploaded Files</h6>
                                <div class="flex flex-wrap gap-4">
                                    <div v-for="(file, index) of uploadedFiles"
                                        :key="file.name + file.type + file.size"
                                        class="p-4 rounded-border flex flex-col border border-surface items-center gap-4">
                                        <div>
                                            <img role="presentation" :alt="file.name" :src="file.objectURL"
                                                width="100" height="50" v-if="file.type.startsWith('image/')" />
                                            <i class="pi pi-file text-4xl text-primary" v-else></i>
                                        </div>
                                        <span
                                            class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                                            file.name }}</span>
                                        <div>{{ formatSize(file.size) }}</div>
                                        <Badge value="Completed" class="mt-4" severity="success"></Badge>
                                        <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)"
                                            severity="danger" text rounded></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <div class="flex items-center justify-center flex-col p-8">
                            <i
                                class="pi pi-cloud-upload border-2 rounded-full p-8 text-4xl text-muted-color border-muted-color"></i>
                            <p class="mt-6 mb-0 text-muted-color">Drag and drop files here to upload.</p>
                            <small class="text-muted-color">Max file size: 5MB. Formats: PDF, DOC, DOCX, JPG,
                                PNG</small>
                        </div>
                    </template>
                </FileUpload>
            </div>
        </div>

        <Toast position="top-right" group="tl" />
</template>

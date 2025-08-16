<script setup>
import StudentResponse from '@/types/student';
import TranscriptService from '@/types/transcript';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AcademicRecordsView from './forms/AcademicRecordView.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import router from '@/router';
import { documentService } from '@/api/documentService';
import ProfilePicture from '@/components/ProfilePicture.vue';


const route = useRoute()
const toast = useToast()
const showTranscript = ref(false)

// Computed breadcrumb items based on current view
const breadcrumbItems = computed(() => {
    const items = [{ label: 'Student Information', command: () => showTranscript.value = false }]
    if (showTranscript.value) {
        items.push({ label: 'Transcript of Records' })
    }
    return items
})

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' })
const items = ref([
    {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => handleUpdateStudent()
    },
    {
        separator: true
    },
    {
        label: 'View Transcript',
        icon: 'pi pi-address-book',
        command: () => handleViewTranscript()
    },
    {
        separator: true
    },
    {
        label: 'Home Page',
        icon: 'pi pi-home',
        command: () => handleGoToHome()
    }
]);

const studentInfo = ref({})
const academicRecord = ref([])
const transcriptTemplate = ref('')
const isLoadingTemplate = ref(false)


onMounted(() => {
    const userId = route.params.id

    loadStudentData(userId)
    loadAcademicDataById(userId)
    loadTranscriptTemplate()
})

function loadStudentData(id) {
    let model = new StudentResponse();
    model.getDataById(id,
        (data) => {
            studentInfo.value = data.data
            if (studentInfo.value.information == null) {
                studentInfo.value.information = {}
            }

        })
}


function loadAcademicDataById(id) {
    let model = new StudentResponse();
    model.getAcademicDataById(id,
        (data) => {
            academicRecord.value = data.data

        })
}

async function loadTranscriptTemplate() {
    isLoadingTemplate.value = true
    try {
        // Use the document service to get documents with title filter
        const response = await documentService.getDocuments({
            title: 'Transcript of Record'
        })
        if (response && response.data && response.data.length > 0) {
            // Find the document with exact title match
            const transcriptDocument = response.data.find(doc =>
                doc.title === 'Transcript of Record'
            )
            if (transcriptDocument) {
                transcriptTemplate.value = transcriptDocument.content
            } else {
                transcriptTemplate.value = ''
            }
        } else {
            console.warn('No documents found')
            transcriptTemplate.value = ''
        }
    } catch (error) {
        console.error('Error loading transcript template:', error)
        transcriptTemplate.value = ''
    } finally {
        isLoadingTemplate.value = false
    }
}

const onItemClick = (event) => {
    // Execute the command if it exists (for newer PrimeVue versions)
    if (event.item.command) {
        event.item.command()
        return
    }

    // Fallback for older versions - handle by label
    switch (event.item.label) {
        case 'Update':
            handleUpdateStudent()
            break
        case 'View Transcript':
            handleViewTranscript()
            break
        case 'Home Page':
            handleGoToHome()
            break
        default:
    }
}


const handleUpdateStudent = () => {

    // Implementation: Reload student data from server

    router.push(`/enrollment/student?id=${studentInfo.value.id}&back=true`)
}


const handleGoToHome = () => {
    // Navigate to home/dashboard
    window.location.href = '/'
}

const handleViewTranscript = () => {
    // Show transcript preview on same page
    showTranscript.value = true;
}

const viewStudentInformation = () => {
    showTranscript.value = false;
}

const generateTranscriptContent = () => {
    if (!transcriptTemplate.value || !studentInfo.value) {
        return '<p>Template or student data not available</p>'
    }

    // Clone the template
    let content = transcriptTemplate.value

    // Replace student data placeholders with actual student information
    const replacements = {
        // School Information (can be made dynamic later)
        'Sample High School': 'Sample High School', // Keep school name for now

        // Student Information
        'Juan Pedro Dela Cruz': studentInfo.value.fullName || 'N/A',
        'SHS-2024-001': studentInfo.value.studentId || 'N/A',
        '123456789012': studentInfo.value.lrn || 'N/A',
        'May 15, 2008': formatStudentDate(studentInfo.value.birthday) || 'N/A',
        'Male': studentInfo.value.gender || 'N/A',
        '456 Student Avenue, Hometown City, Province 5678': studentInfo.value.address || 'N/A',
        'JDC': getStudentInitials() || 'N/A',

        // Dates
        'August 2, 2025': getCurrentFormattedDate(),
        'August 2, 2025, 12:00 PM': getCurrentFormattedDateTime(),

        // Document ID
        'TOR-SHS-2024-001-1722566400000': `TOR-${studentInfo.value.studentId || 'N/A'}-${new Date().getTime()}`
    }

    // Replace placeholders in the template
    Object.entries(replacements).forEach(([placeholder, value]) => {
        const regex = new RegExp(escapeRegExp(placeholder), 'g')
        content = content.replace(regex, value)
    })

    // Replace academic records if available
    if (academicRecord.value && academicRecord.value.length > 0) {
        content = replaceAcademicRecords(content)
    }

    return content
}

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const getCurrentFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const getCurrentFormattedDateTime = () => {
    return new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatStudentDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    } catch (error) {
        console.warn('Error formatting date:', error)
        return dateString
    }
}

const getStudentInitials = () => {
    if (!studentInfo.value.fullName) return 'N/A'
    const names = studentInfo.value.fullName.split(' ')
    return names.map(name => name.charAt(0)).join('').substring(0, 3)
}

const replaceAcademicRecords = (content) => {
    // This function would handle replacing academic records data
    // For now, return the content as-is since we need more complex logic
    // to replace table rows dynamically
    return content
}

const handleExportDataPdf = () => {
    if (!studentInfo.value || !studentInfo.value.id) {
        console.error('Student information not available')
        return
    }

    // Call the STRECS API to generate PDF transcript
    generateTranscriptDocumentPdf()
}

const generateTranscriptDocumentPdf = async () => {
    try {
        // Show loading state
        isLoadingTemplate.value = true

        // All data will be fetched from database using only student ID
        // Use the transcript service for PDF generation
        const transcriptService = new TranscriptService()

        transcriptService.generateTranscriptPdf(
            {
                studentId: studentInfo.value.id
            },
            (response) => {
                // Success: Handle the JSON response with file path
                if (response.status === 'SUCCESS' && response.data) {
                    const fileData = response.data

                    // Use the downloadUrl provided by the API
                    if (fileData.downloadUrl) {
                        // Create download link
                        const link = document.createElement('a')
                        link.href = fileData.downloadUrl
                        link.download = fileData.filename || 'transcript.pdf'
                        link.target = '_blank'

                        // Trigger download
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)

                        toast.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `PDF transcript generated successfully: ${fileData.filename}`,
                            life: 5000
                        })
                    } else {
                        throw new Error('Download URL not provided in response')
                    }
                } else {
                    throw new Error(response.message || 'Failed to generate PDF transcript')
                }
            },
            (error) => {
                // Error handling
                console.error('Error generating PDF transcript:', error)
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to generate PDF transcript. Please try again.',
                    life: 5000
                })
            }
        )

    } catch (error) {
        console.error('Error generating PDF transcript:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error generating PDF transcript. Please check your connection and try again.',
            life: 5000
        })
    } finally {
        isLoadingTemplate.value = false
    }
}

</script>

<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <h1 class="text-3xl font-bold text-gray-900">Student Records</h1>
                        <Tag :value="studentInfo.status" :severity="studentInfo.status === 'Active' ? 'success' : 'danger'" />
                    </div>
                    <p class="text-lg text-gray-600">
                        <span class="font-medium">{{ studentInfo.fullName }}</span>
                        <span v-if="studentInfo.studentId"> | ID: {{ studentInfo.studentId }}</span>
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                        <i class="pi pi-calendar text-gray-400"></i>
                        <span>{{ formatStudentDate(studentInfo.birthday) }}</span>
                    </div>
                </div>
                <div class="flex gap-3">
                    <Button 
                        label="Update Info" 
                        icon="pi pi-pencil" 
                        @click="handleUpdateStudent" 
                        severity="warning" 
                        outlined
                    />
                    <Button 
                        label="View Transcript" 
                        icon="pi pi-address-book" 
                        @click="handleViewTranscript" 
                        severity="info" 
                        outlined
                    />
                    <Button 
                        label="Home" 
                        icon="pi pi-home" 
                        @click="handleGoToHome" 
                        severity="secondary" 
                        outlined
                    />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <!-- Main Content -->
            <div class="xl:col-span-3 space-y-6">
                <!-- Student Information Card -->
                <div class="bg-white rounded-lg shadow-sm border">
                    <div class="border-b border-gray-200 p-6">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-user text-blue-500"></i>
                            <h2 class="text-xl font-semibold text-gray-900">Student Information</h2>
                        </div>
                    </div>
                    <div class="p-6 flex flex-col md:flex-row gap-8">
                        <div class="flex flex-col items-center gap-2 md:w-1/3">
                            <ProfilePicture :currentProfilePictureUrl="studentInfo.photoUrl" class="w-32 h-32 rounded-full border" />
                            <div class="mt-2 text-center">
                                <span class="font-semibold text-lg text-gray-900">{{ studentInfo.fullName }}</span>
                                <div class="text-sm text-gray-500">{{ studentInfo.studentId }}</div>
                            </div>
                        </div>
                        <div class="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <table class="table student-info">
                                    <tr>
                                        <th>LRN:</th>
                                        <td>{{ studentInfo.lrn }}</td>
                                    </tr>
                                    <tr>
                                        <th>Gender:</th>
                                        <td>{{ studentInfo.gender }}</td>
                                    </tr>
                                    <tr>
                                        <th>Birthday:</th>
                                        <td>{{ formatStudentDate(studentInfo.birthday) }}</td>
                                    </tr>
                                    <tr>
                                        <th>Contact:</th>
                                        <td>{{ studentInfo.contactNumber }}</td>
                                    </tr>
                                    <tr>
                                        <th>Email:</th>
                                        <td>{{ studentInfo.email }}</td>
                                    </tr>
                                    <tr>
                                        <th>Address:</th>
                                        <td>{{ studentInfo.address }}</td>
                                    </tr>
                                </table>
                            </div>
                            <div>
                                <table class="table student-info" v-if="studentInfo.information">
                                    <tr>
                                        <th>Religion:</th>
                                        <td>{{ studentInfo.information.religion }}</td>
                                    </tr>
                                    <tr>
                                        <th>Nationality:</th>
                                        <td>{{ studentInfo.information.nationality }}</td>
                                    </tr>
                                    <tr>
                                        <th>Mother's Name:</th>
                                        <td>{{ studentInfo.information.motherName }}</td>
                                    </tr>
                                    <tr>
                                        <th>Father's Name:</th>
                                        <td>{{ studentInfo.information.fatherName }}</td>
                                    </tr>
                                    <tr>
                                        <th>Parent Contact:</th>
                                        <td>{{ studentInfo.information.parentContactInfo }}</td>
                                    </tr>
                                    <tr>
                                        <th>Parent Address:</th>
                                        <td>{{ studentInfo.information.parentAddress }}</td>
                                    </tr>
                                    <tr>
                                        <th>Guardian:</th>
                                        <td>{{ studentInfo.information.guardian }}</td>
                                    </tr>
                                    <tr>
                                        <th>Guardian Contact:</th>
                                        <td>{{ studentInfo.information.guardianContactInfo }}</td>
                                    </tr>
                                    <tr>
                                        <th>Guardian Address:</th>
                                        <td>{{ studentInfo.information.guardianAddress }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Academic Records Card -->
                <div class="bg-white rounded-lg shadow-sm border">
                    <div class="border-b border-gray-200 p-6 flex items-center gap-2">
                        <i class="pi pi-book text-green-500"></i>
                        <h2 class="text-xl font-semibold text-gray-900">Academic Records</h2>
                    </div>
                    <div class="p-6">
                        <AcademicRecordsView :academicRecord="academicRecord"></AcademicRecordsView>
                    </div>
                </div>

                <!-- Transcript Preview Card -->
                <div v-if="showTranscript" class="bg-white rounded-lg shadow-sm border">
                    <div class="border-b border-gray-200 p-6 flex items-center gap-2">
                        <i class="pi pi-file-pdf text-red-500"></i>
                        <h2 class="text-xl font-semibold text-gray-900">Transcript of Records</h2>
                    </div>
                    <div class="p-6">
                        <div v-if="isLoadingTemplate" class="flex justify-center items-center py-8">
                            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
                            <span class="ml-3">Loading transcript template...</span>
                        </div>
                        <div v-else-if="transcriptTemplate" class="transcript-template-container">
                            <div v-html="generateTranscriptContent()" class="transcript-content"></div>
                        </div>
                        <div v-else>
                            <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                                <p class="text-yellow-800">
                                    <i class="pi pi-exclamation-triangle mr-2"></i>
                                    Template not found. Using default transcript component.
                                </p>
                                <router-link to="/management/documents/form?title=Transcript of Record">Create</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Quick Actions Card -->
                <div class="bg-white rounded-lg shadow-sm border">
                    <div class="border-b border-gray-200 p-4">
                        <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div class="p-4 space-y-3">
                        <Button 
                            label="Generate Transcript (PDF)" 
                            icon="pi pi-file-pdf" 
                            @click="handleExportDataPdf"
                            severity="primary"
                            :disabled="isLoadingTemplate"
                            class="w-full justify-center"
                        />
                        <Button 
                            label="Update Info" 
                            icon="pi pi-pencil" 
                            @click="handleUpdateStudent"
                            severity="warning"
                            outlined
                            class="w-full justify-center"
                        />
                        <Button 
                            label="Go to Home" 
                            icon="pi pi-home" 
                            @click="handleGoToHome"
                            severity="secondary"
                            outlined
                            class="w-full justify-center"
                        />
                    </div>
                </div>

                <!-- Student Summary Card -->
                <div class="bg-white rounded-lg shadow-sm border">
                    <div class="border-b border-gray-200 p-4">
                        <h3 class="text-lg font-semibold text-gray-900">Student Summary</h3>
                    </div>
                    <div class="p-4 space-y-2">
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-700">Full Name:</span>
                            <span class="text-gray-900">{{ studentInfo.fullName }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-700">Student ID:</span>
                            <span class="text-gray-900">{{ studentInfo.studentId }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-700">LRN:</span>
                            <span class="text-gray-900">{{ studentInfo.lrn }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-700">Status:</span>
                            <Tag :value="studentInfo.status" :severity="studentInfo.status === 'Active' ? 'success' : 'danger'" />
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-700">Birthday:</span>
                            <span class="text-gray-900">{{ formatStudentDate(studentInfo.birthday) }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-700">Gender:</span>
                            <span class="text-gray-900">{{ studentInfo.gender }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css">
.student-info {
    border-collapse: separate;
    border-spacing: 0 10px;
    /* 0 = column gap, 10px = row gap */

}


.student-info>tr>th {
    text-align: right;
}

.student-info td {
    padding-left: 16px;
    /* adjust as needed */
}

.transcript-template-container {
    width: 100%;
}

.transcript-content {
    width: 100%;
    overflow-x: auto;
}

/* Ensure template styles are preserved */
.transcript-content table {
    border-collapse: collapse;
}

.transcript-content table th,
.transcript-content table td {
    border: 1px solid #333;
    padding: 6px 4px;
    text-align: center;
}
</style>
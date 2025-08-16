<script setup>
import AttendanceRecordResponse from '@/types/attendance_record';
import SubjectCodeResponse from '@/types/subject_code';
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Tooltip from 'primevue/tooltip';

const students = ref(null)
const totalRecords = ref(0)
const weekDates = ref([]);
const weekNumber = ref(0);
const subjectCode = ref('');
const attendanceRecords = ref([]);

const items = ref([
    {
        label: 'Absent',
        icon: 'pi pi-refresh',
        value: 'ABSENT'
    },
    {
        label: 'Late',
        icon: 'pi pi-times',
        value: 'LATE'
    },
    {
        separator: true
    },
    {
        label: 'Excused',
        icon: 'pi pi-home',
        value: 'EXCUSED'
    }
]);

// Expose the function to parent
defineExpose({
  reloadData
});

onMounted(() => {
    weekNumber.value = getWeekNumber()
    weekDates.value = getDateRangeOfISOWeek(weekNumber.value - 2, new Date().getFullYear())

});

const loadStudents = (code) => {
    let model = new SubjectCodeResponse()
    model.getSubjectStudents(code,
    (data) => { 
        console.log("data ", data)
        students.value = data.data; 
        totalRecords.value = data.page.totalCount;
    },
    (err) => {
        console.log(err)
    })
}


function reloadData(data){
    subjectCode.value = data;
    loadStudents(data.code)
    nextPage(0);
}

function getSeverity(product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}

const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

const getWeekNumber = (date = new Date()) => {
  const target = new Date(date.valueOf());
  
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday (0) into 7
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);

  // Jan 4 is always in week 1
  const jan4 = new Date(target.getFullYear(), 0, 4);

  // Calculate full weeks to nearest Thursday
  const weekNo = 1 + Math.round(((target - jan4) / 86400000 - 3) / 7);
  return weekNo;
}

const getDateRangeOfISOWeek = (week, year) => {
  const simple = new Date(year, 0, 4); // Jan 4 is always in ISO week 1
  const dayOfWeek = simple.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
  const ISOweekStart = new Date(simple);

  // Calculate how many days to subtract to get to Monday
  const diff = (dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8);
  ISOweekStart.setDate(simple.getDate() - diff + (week - 1) * 7);

  // Get start (Monday) and end (Sunday)
  const startDate = new Date(ISOweekStart);
  const endDate = new Date(ISOweekStart);
  endDate.setDate(startDate.getDate() + 6);
    
  let dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(formatDate(date)); // Format as "YYYY-MM-DD"
  }
  return dates;
}

const nextPage = (direction) => {
    weekNumber.value += direction;
    weekDates.value = getDateRangeOfISOWeek(weekNumber.value, new Date().getFullYear());
    fetchAttendanceData(subjectCode.value.code, weekDates.value[0], weekDates.value[6]); // Replace with actual subject code
}

const fetchAttendanceData = (code, startDate, endDate) => {
    let model = new AttendanceRecordResponse();
    model.getData("code=" + code + "&startDate=" + startDate + "&endDate=" + endDate,
        (data) => {
            // Process the data as needed
            attendanceRecords.value = data.data
        },
        (err) => {
            console.error("Error fetching attendance data", err);
        }
    );
}

const showExcuseModal = ref(false);
const excuseReason = ref('');
const excuseFiles = ref([]);
const selectedStudentId = ref(null);
const selectedDate = ref(null);

function handleExcusedClick(studentId, date) {
    selectedStudentId.value = studentId;
    selectedDate.value = date;
    excuseReason.value = '';
    excuseFiles.value = [];
    showExcuseModal.value = true;
}

function submitExcuse() {
    // Implement file upload logic as needed
    createAttendance(selectedStudentId.value, selectedDate.value, 'EXCUSED', excuseReason.value, excuseFiles.value);
    showExcuseModal.value = false;
}

function handleFileUpload(event) {
    excuseFiles.value = event.files;
}

// Update createAttendance to accept reason and files
const createAttendance = (studentId, date, status, reason = null, files = []) => {
    // Placeholder for creating attendance record
    console.log(`Creating attendance for student ID: ${studentId} on date: ${date}`);
    // Implement the logic to create attendance record
    let model = new AttendanceRecordResponse();
    let payload = {
        studentId: studentId,
        date: date,
        subjectCode: subjectCode.value.code,
        status: status,
        remarks: reason
        // You can add file upload logic here if needed
    };
    model.createAttendance(payload,
        (data) => {
            // Process the data as needed
            if(data.status === 'SUCCESS') {
                attendanceRecords.value.push({
                    id: data.id,
                    date: date,
                    status: status,
                    remarks: null,
                    studentId: studentId,
                    studentName: data.studentName
                });

            } else {
                console.error("Failed to create attendance", data);
            }
        },
        (err) => {
            console.error("Error fetching attendance data", err);
        }
    );
};


</script>

<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Subject Attendance</h1>
                <p class="text-gray-600">Track and manage attendance for each student by week.</p>
            </div>
            <div class="flex gap-2">
                 </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex justify-between items-center">
            <Button icon="pi pi-angle-left" severity="secondary" rounded label="Previous" @click="nextPage(-1)"/>
                <span class="font-semibold text-blue-800">{{ subjectCode.yearLevel }} - ({{ subjectCode.label }})</span>
                <Button icon="pi pi-angle-right" severity="secondary" rounded label="Next"  @click="nextPage(1)"/>
           </div>
            <DataTable :value="students" tableStyle="min-width: 50rem">
                <Column field="student.fullName" header="Student Name"></Column>
                <Column v-for="(val, index) in weekDates" :field="val" :header="val" :key="val">
                    <template #body="slotProps">
                        <div class="flex flex-col items-center">
                            <span v-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field)">
                                <Tag
                                    v-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).status == 'PRESENT'"
                                    value="Present" severity="primary" ></Tag>
                                <Tag
                                    v-else-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).status == 'ABSENT'"
                                    severity="danger" value="Absent"></Tag>
                                <Tag
                                    v-else-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).status == 'LATE'"
                                    severity="warn" value="Late"></Tag>
                                <Tag
                                    v-else-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).status == 'EXCUSED'"
                                    severity="info"
                                    value="Excused"
                                    v-tooltip="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).remarks || 'No remarks'"
                                >
                                    <template #icon>
                                        <i v-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).remarks"
                                           class="pi pi-comment text-blue-700 ml-1" title="Has remarks"></i>
                                    </template>
                                </Tag>
                            </span>
                            <div v-else class="w-full flex justify-center">
                                <SplitButton
                                    label="Mark Present"
                                    :model="items"
                                    severity="success"
                                    class="attendance-split-btn"
                                    @click="createAttendance(slotProps.data.student.id, slotProps.field, 'PRESENT')"
                                >
                                    <template #item="{ item }">
                                        <span
                                            v-if="item.value === 'EXCUSED'"
                                            @click="handleExcusedClick(slotProps.data.student.id, slotProps.field)"
                                            class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-blue-50 rounded"
                                        >
                                            <i :class="item.icon" class="mr-1"></i>{{ item.label }}
                                        </span>
                                        <span
                                            v-else
                                            @click="createAttendance(slotProps.data.student.id, slotProps.field, item.value)"
                                            class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-blue-50 rounded"
                                        >
                                            <i :class="item.icon" class="mr-1"></i>{{ item.label }}
                                        </span>
                                    </template>
                                </SplitButton>
                            </div>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Excuse Modal -->
        <Dialog v-model:visible="showExcuseModal" :style="{ width: '500px' }" header="Excuse Reason" :modal="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label for="excuseReason" class="block font-bold mb-2">Reason for Excuse *</label>
                    <Textarea id="excuseReason" v-model="excuseReason" rows="3" placeholder="Enter reason..." autoResize />
                </div>
                <div>
                    <label class="block font-bold mb-2">Upload Supporting Files</label>
                    <FileUpload name="excuseFiles" customUpload :auto="false" @select="handleFileUpload" :multiple="true" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="showExcuseModal = false" severity="secondary" />
                <Button label="Submit Excuse" icon="pi pi-check" @click="submitExcuse" severity="info" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
/* Add some spacing and card styling */
.bg-gray-50 {
    background-color: #f9fafb;
}
.card {
    background: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    border: 1px solid #e5e7eb;
}
.attendance-split-btn {
    min-width: 110px;
    font-weight: 500;
    font-size: 0.95rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    border: 1px solid #e5e7eb;
}
.attendance-split-btn :deep(.p-splitbutton-menubutton) {
    border-radius: 0.5rem;
    background: #f3f4f6;
    border: none;
}
.attendance-split-btn :deep(.p-splitbutton-menu) {
    min-width: 120px;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.attendance-split-btn :deep(.p-menuitem-link) {
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
}
</style>


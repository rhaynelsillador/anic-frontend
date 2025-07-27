<script setup>
import AttendanceRecordResponse from '@/types/attendance_record';
import SubjectCodeResponse from '@/types/subject_code';
import { onMounted, ref } from 'vue';

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

const createAttendance = (studentId, date, status) => {
    // Placeholder for creating attendance record
    console.log(`Creating attendance for student ID: ${studentId} on date: ${date}`);
    // Implement the logic to create attendance record
    let model = new AttendanceRecordResponse();
    model.createAttendance({studentId: studentId, date: date, subjectCode: subjectCode.value.code, status: status},
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
    <div class="flex flex-col">
        <div class="flex justify-between">
            <Button icon="pi pi-angle-left" severity="secondary" rounded label="Previous" @click="nextPage(-1)"/>
            {{ subjectCode.yearLevel }} - ({{ subjectCode.label }})
            <Button icon="pi pi-angle-right" severity="secondary" rounded label="Next"  @click="nextPage(1)"/>
        </div>
        <br>
        <DataTable :value="students" tableStyle="min-width: 50rem">
            <Column field="student.fullName" header="Student Name"></Column>
            <Column v-for="(val, index) in weekDates" :field="val" :header="val">
                <template #body="slotProps">
                    <div class="flex flex-col items-center">
                        <span v-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field)">
                            <Tag v-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).status == 'PRESENT'" value="Present" severity="primary" ></Tag>
                            <Tag v-else-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).status == 'ABSENT'" severity="danger" value="Absent"></Tag>
                            <Tag v-else-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).status == 'LATE'" severity="warn" value="Late"></Tag>
                            <Tag v-else-if="attendanceRecords.find(d => d.studentId == slotProps.data.student.id && d.date == slotProps.field).status == 'EXCUSED'" severity="info" value="Excused"></Tag>
                        </span>
                       

                    <SplitButton v-else label="Present" :model="items" severity="secondary" @click="createAttendance(slotProps.data.student.id, slotProps.field, 'PRESENT')">
                        <template #item="{ item, toggleCallback }">
                            <span @click="createAttendance(slotProps.data.student.id, slotProps.field, item.value)" class="flex items-center gap-2 cursor-pointer">
                                {{ item.label }}
                            </span>
                        </template>

                    </SplitButton>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

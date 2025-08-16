<template>
  <div style="max-width: 210mm; margin: 0 auto; padding: 20px; font-family: 'Times New Roman', serif;">
    <!-- Action buttons -->
    <div style="display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 16px;" class="no-print">
      <button 
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px;"
        @click="generateSampleData"
      >
        <i class="pi pi-refresh"></i>
        Generate Sample Data
      </button>
      <button 
        style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px;"
        @click="printTranscript"
      >
        <i class="pi pi-print"></i>
        Print Transcript
      </button>
      <button 
        style="padding: 8px 16px; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px;"
        @click="downloadPDF"
      >
        <i class="pi pi-download"></i>
        Download PDF
      </button>
    </div>

    <!-- Transcript Document -->
    <div style="background: white; padding: 30px; box-shadow: 0 0 20px rgba(0,0,0,0.1); min-height: 297mm;" id="transcript-content">
      <!-- Header -->
      <div style="display: flex; align-items: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
        <div style="margin-right: 30px;">
          <img 
            v-if="schoolInfo.logo" 
            :src="schoolInfo.logo" 
            alt="School Logo"
            style="width: 80px; height: 80px; object-fit: contain;"
          />
          <div v-else style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc; border-radius: 8px;">
            <i class="pi pi-building" style="font-size: 2rem; color: #2563eb;"></i>
          </div>
        </div>
        
        <div style="flex: 1; text-align: center;">
          <h1 style="font-size: 24px; font-weight: bold; color: #1e40af; margin: 0 0 8px 0; text-transform: uppercase;">{{ schoolInfo.name }}</h1>
          <p style="font-size: 12px; margin: 4px 0; color: #666;">{{ schoolInfo.address }}</p>
          <p style="font-size: 12px; margin: 4px 0; color: #666;">{{ schoolInfo.contact }}</p>
          <div>
            <h2 style="font-size: 20px; font-weight: bold; margin: 20px 0 5px 0; color: #1e40af; text-transform: uppercase; letter-spacing: 2px;">TRANSCRIPT OF RECORDS</h2>
            <p style="font-size: 12px; color: #666; margin: 0;">Official Academic Record</p>
          </div>
        </div>
      </div>

      <!-- Student Information -->
      <div style="margin-bottom: 30px;">
        <div style="display: flex; gap: 30px;">
          <div style="flex: 1;">
            <div style="display: flex; margin-bottom: 8px; align-items: baseline;">
              <span style="font-weight: bold; width: 120px; flex-shrink: 0;">Student Name:</span>
              <span style="flex: 1; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-left: 10px;">{{ student.fullName }}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px; align-items: baseline;">
              <span style="font-weight: bold; width: 120px; flex-shrink: 0;">Student ID:</span>
              <span style="flex: 1; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-left: 10px;">{{ student.studentId }}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px; align-items: baseline;">
              <span style="font-weight: bold; width: 120px; flex-shrink: 0;">LRN:</span>
              <span style="flex: 1; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-left: 10px;">{{ student.lrn }}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px; align-items: baseline;">
              <span style="font-weight: bold; width: 120px; flex-shrink: 0;">Date of Birth:</span>
              <span style="flex: 1; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-left: 10px;">{{ formatDate(student.birthday) }}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px; align-items: baseline;">
              <span style="font-weight: bold; width: 120px; flex-shrink: 0;">Gender:</span>
              <span style="flex: 1; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-left: 10px;">{{ student.gender }}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px; align-items: baseline;">
              <span style="font-weight: bold; width: 120px; flex-shrink: 0;">Address:</span>
              <span style="flex: 1; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-left: 10px;">{{ student.address }}</span>
            </div>
          </div>
          
          <div style="width: 120px; flex-shrink: 0;">
            <div style="width: 120px; height: 140px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; background: #f9f9f9;">
              <img 
                v-if="student.photoUrl" 
                :src="student.photoUrl" 
                :alt="student.fullName"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
              <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #e5e7eb; color: #6b7280;">
                <span style="font-size: 24px; font-weight: bold;">{{ getStudentInitials() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Academic Records by School Year -->
      <div style="margin-bottom: 30px;">
        <div v-for="record in academicRecords" :key="record.schoolYear" style="margin-bottom: 25px;">
          <h3 style="font-size: 16px; font-weight: bold; background: #f3f4f6; padding: 10px; border: 1px solid #d1d5db; margin-bottom: 0; text-align: center; color: #1f2937;">
            School Year {{ record.schoolYear }} - Grade {{ record.gradeLevel }}
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 12%;">Subject Code</th>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 30%;">Subject Name</th>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 8%;">Units</th>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 8%;">Q1</th>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 8%;">Q2</th>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 8%;">Q3</th>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 8%;">Q4</th>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 10%;">Final Grade</th>
                <th style="border: 1px solid #333; padding: 6px 4px; text-align: center; background: #f9f9f9; font-weight: bold; font-size: 10px; width: 12%;">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in record.subjects" :key="subject.code">
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center;">{{ subject.code }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: left;">{{ subject.name }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center;">{{ subject.units }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center;">{{ subject.quarters.q1 }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center;">{{ subject.quarters.q2 }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center;">{{ subject.quarters.q3 }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center;">{{ subject.quarters.q4 }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center; font-weight: bold;">{{ subject.finalGrade }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center; font-size: 9px;">{{ subject.remarks }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style="background: #f3f4f6; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #333; padding: 6px 4px; text-align: right; padding-right: 10px;">School Year Average:</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center; font-weight: bold; color: #1e40af;">{{ record.totalUnits }}</td>
                <td colspan="4" style="border: 1px solid #333; padding: 6px 4px;"></td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center; font-weight: bold; color: #1e40af;">{{ record.yearAverage }}</td>
                <td style="border: 1px solid #333; padding: 6px 4px; text-align: center; color: #059669; font-weight: bold;">{{ record.status }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Overall Summary -->
      <div style="margin-bottom: 30px; border: 2px solid #2563eb; padding: 20px; background: #f8fafc;">
        <div style="display: flex; gap: 40px;">
          <div style="text-align: center; flex: 1;">
            <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #1e40af;">General Weighted Average</h4>
            <div style="font-size: 32px; font-weight: bold; color: #dc2626; margin-bottom: 5px;">{{ overallGWA }}</div>
            <div style="font-size: 14px; color: #059669; font-weight: bold;">{{ getGradeDescription(overallGWA) }}</div>
          </div>
          
          <div style="flex: 1;">
            <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #1e40af;">Academic Statistics</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px dotted #ccc;">
              <span style="font-weight: bold;">Total Units Earned:</span>
              <span style="color: #dc2626; font-weight: bold;">{{ totalUnitsEarned }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px dotted #ccc;">
              <span style="font-weight: bold;">Years Completed:</span>
              <span style="color: #dc2626; font-weight: bold;">{{ academicRecords.length }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px dotted #ccc;">
              <span style="font-weight: bold;">Academic Status:</span>
              <span style="color: #dc2626; font-weight: bold;">{{ overallStatus }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; border-top: 2px solid #333; padding-top: 20px;">
        <div style="margin-bottom: 20px;">
          <p style="text-align: center; font-style: italic; margin-bottom: 30px; color: #374151;">
            This is to certify that the above is a true and correct transcript of the academic record of the above-named student.
          </p>
          
          <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
            <div style="text-align: center; width: 200px;">
              <div style="border-bottom: 1px solid #333; margin-bottom: 5px; height: 40px;"></div>
              <p style="font-weight: bold; margin: 5px 0;">Registrar</p>
              <p style="font-size: 10px; color: #666;">Date: {{ getCurrentDate() }}</p>
            </div>
            
            <div style="text-align: center; width: 200px;">
              <div style="border-bottom: 1px solid #333; margin-bottom: 5px; height: 40px;"></div>
              <p style="font-weight: bold; margin: 5px 0;">Principal</p>
              <p style="font-size: 10px; color: #666;">Date: {{ getCurrentDate() }}</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; font-size: 10px; color: #666;">
          <p style="margin: 2px 0;">Generated on: {{ getCurrentDateTime() }}</p>
          <p style="margin: 2px 0;">Document ID: TOR-{{ student.studentId }}-{{ new Date().getTime() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Define props to accept external data
const props = defineProps({
  studentData: {
    type: Object,
    default: () => ({})
  },
  academicRecords: {
    type: Array,
    default: () => []
  },
  schoolInfo: {
    type: Object,
    default: () => ({
      name: 'Sample High School',
      address: '123 Education Street, Learning City, Knowledge Province 1234',
      contact: 'Tel: (02) 123-4567 | Email: registrar@samplehs.edu.ph',
      logo: '/demo/images/id_logo.jpeg'
    })
  }
})

// School information
const schoolInfo = ref(props.schoolInfo || {
  name: 'Sample High School',
  address: '123 Education Street, Learning City, Knowledge Province 1234',
  contact: 'Tel: (02) 123-4567 | Email: registrar@samplehs.edu.ph',
  logo: '/demo/images/id_logo.jpeg'
})

// Student data - use props if available, otherwise default
const student = ref(props.studentData && Object.keys(props.studentData).length > 0 ? {
  fullName: props.studentData.fullName || 'N/A',
  studentId: props.studentData.studentId || 'N/A',
  lrn: props.studentData.lrn || 'N/A',
  birthday: props.studentData.birthday || new Date(),
  gender: props.studentData.gender || 'N/A',
  address: props.studentData.address || 'N/A',
  photoUrl: props.studentData.photoUrl || null
} : {
  fullName: 'Juan Pedro Dela Cruz',
  studentId: 'SHS-2024-001',
  lrn: '123456789012',
  birthday: new Date('2008-05-15'),
  gender: 'Male',
  address: '456 Student Avenue, Hometown City, Province 5678',
  photoUrl: null
})

// Academic records data - use props if available, otherwise generate sample
const academicRecords = ref(props.academicRecords && props.academicRecords.length > 0 ? props.academicRecords : [])

// Generate sample academic data
const generateSampleData = () => {
  const sampleSubjects = [
    { code: 'ENG101', name: 'English for Academic and Professional Purposes', units: 3 },
    { code: 'FIL101', name: 'Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino', units: 3 },
    { code: 'MATH101', name: 'General Mathematics', units: 3 },
    { code: 'SCI101', name: 'Earth and Life Science', units: 3 },
    { code: 'SS101', name: 'Contemporary Philippine Arts from the Regions', units: 3 },
    { code: 'PE101', name: 'Physical Education and Health', units: 2 },
    { code: 'EMP101', name: 'Empowerment Technologies', units: 3 },
    { code: 'RES101', name: 'Research Project', units: 2 }
  ]

  academicRecords.value = [
    {
      schoolYear: '2022-2023',
      gradeLevel: '11',
      subjects: sampleSubjects.map(subject => {
        const q1 = 85 + Math.floor(Math.random() * 10)
        const q2 = 85 + Math.floor(Math.random() * 10)
        const q3 = 85 + Math.floor(Math.random() * 10)
        const q4 = 85 + Math.floor(Math.random() * 10)
        const finalGrade = Math.round((q1 + q2 + q3 + q4) / 4)
        
        return {
          ...subject,
          quarters: { q1, q2, q3, q4 },
          finalGrade,
          remarks: finalGrade >= 75 ? 'PASSED' : 'FAILED'
        }
      }),
      totalUnits: sampleSubjects.reduce((sum, s) => sum + s.units, 0),
      yearAverage: 0,
      status: 'PROMOTED'
    },
    {
      schoolYear: '2023-2024',
      gradeLevel: '12',
      subjects: sampleSubjects.map(subject => {
        const q1 = 87 + Math.floor(Math.random() * 8)
        const q2 = 87 + Math.floor(Math.random() * 8)
        const q3 = 87 + Math.floor(Math.random() * 8)
        const q4 = 87 + Math.floor(Math.random() * 8)
        const finalGrade = Math.round((q1 + q2 + q3 + q4) / 4)
        
        return {
          ...subject,
          quarters: { q1, q2, q3, q4 },
          finalGrade,
          remarks: finalGrade >= 75 ? 'PASSED' : 'FAILED'
        }
      }),
      totalUnits: sampleSubjects.reduce((sum, s) => sum + s.units, 0),
      yearAverage: 0,
      status: 'GRADUATED'
    }
  ]

  // Calculate year averages
  academicRecords.value.forEach(record => {
    const totalGradePoints = record.subjects.reduce((sum, subject) => sum + (subject.finalGrade * subject.units), 0)
    const totalUnits = record.subjects.reduce((sum, subject) => sum + subject.units, 0)
    record.yearAverage = (totalGradePoints / totalUnits).toFixed(2)
  })
}

// Computed properties
const overallGWA = computed(() => {
  if (academicRecords.value.length === 0) return '0.00'
  
  let totalGradePoints = 0
  let totalUnits = 0
  
  academicRecords.value.forEach(record => {
    record.subjects.forEach(subject => {
      totalGradePoints += subject.finalGrade * subject.units
      totalUnits += subject.units
    })
  })
  
  return (totalGradePoints / totalUnits).toFixed(2)
})

const totalUnitsEarned = computed(() => {
  return academicRecords.value.reduce((total, record) => total + record.totalUnits, 0)
})

const overallStatus = computed(() => {
  const gwa = parseFloat(overallGWA.value)
  if (gwa >= 90) return 'With Highest Honors'
  if (gwa >= 85) return 'With High Honors'
  if (gwa >= 80) return 'With Honors'
  if (gwa >= 75) return 'Satisfactory'
  return 'Needs Improvement'
})

// Helper functions
const getStudentInitials = () => {
  const names = student.value.fullName.split(' ')
  return names.map(name => name.charAt(0)).join('').substring(0, 3)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCurrentDateTime = () => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getGradeDescription = (grade) => {
  const gwa = parseFloat(grade)
  if (gwa >= 98) return 'Outstanding'
  if (gwa >= 95) return 'Very Satisfactory'
  if (gwa >= 90) return 'Satisfactory'
  if (gwa >= 85) return 'Fairly Satisfactory'
  if (gwa >= 80) return 'Did Not Meet Expectations'
  if (gwa >= 75) return 'Beginning'
  return 'Below Beginning'
}

// Print function (simplified since we don't need PDF generation for DB storage)
const printTranscript = () => {
  window.print()
}

// Simplified download function
const downloadPDF = async () => {
  // This could be implemented later with dynamic import of html2canvas and jsPDF
  alert('PDF download functionality would be implemented with dynamic imports')
}

// Initialize with sample data if no props provided
if (academicRecords.value.length === 0) {
  generateSampleData()
}
</script>

<style>
/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body * {
    visibility: hidden;
  }
  
  #transcript-content,
  #transcript-content * {
    visibility: visible;
  }
  
  #transcript-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .transcript-container {
    padding: 10px !important;
  }
  
  .transcript-document {
    padding: 20px !important;
  }
  
  .school-details {
    margin-left: 0 !important;
    margin-top: 20px !important;
  }
  
  .student-info-grid {
    flex-direction: column !important;
  }
  
  .student-photo-section {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
  }
  
  .summary-grid {
    flex-direction: column !important;
    gap: 20px !important;
  }
  
  .signatures-section {
    flex-direction: column !important;
    gap: 30px !important;
    align-items: center !important;
  }
}
</style>

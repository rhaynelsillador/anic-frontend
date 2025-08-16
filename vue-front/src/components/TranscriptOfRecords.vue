<template>
  <div class="transcript-container">
    <!-- Action buttons -->
    <div class="flex justify-end gap-3 mb-4 no-print">
      <Button 
        label="Generate Sample Data" 
        icon="pi pi-refresh" 
        severity="info" 
        @click="generateSampleData"
      />
      <Button 
        label="Print Transcript" 
        icon="pi pi-print" 
        severity="primary" 
        @click="printTranscript"
      />
      <Button 
        label="Download PDF" 
        icon="pi pi-download" 
        severity="success" 
        @click="downloadPDF"
      />
    </div>

    <!-- Transcript Document -->
    <div class="transcript-document" id="transcript-content">
      <!-- Header -->
      <div class="transcript-header">
        <div class="school-logo-section">
          <img 
            v-if="schoolInfo.logo" 
            :src="schoolInfo.logo" 
            alt="School Logo"
            class="school-logo"
          />
          <div v-else class="logo-placeholder">
            <i class="pi pi-building text-4xl text-blue-600"></i>
          </div>
        </div>
        
        <div class="school-details">
          <h1 class="school-name">{{ schoolInfo.name }}</h1>
          <p class="school-address">{{ schoolInfo.address }}</p>
          <p class="school-contact">{{ schoolInfo.contact }}</p>
          <div class="document-title">
            <h2>TRANSCRIPT OF RECORDS</h2>
            <p class="document-subtitle">Official Academic Record</p>
          </div>
        </div>
      </div>

      <!-- Student Information -->
      <div class="student-section">
        <div class="student-info-grid">
          <div class="student-details">
            <div class="info-row">
              <span class="label">Student Name:</span>
              <span class="value">{{ student.fullName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Student ID:</span>
              <span class="value">{{ student.studentId }}</span>
            </div>
            <div class="info-row">
              <span class="label">LRN:</span>
              <span class="value">{{ student.lrn }}</span>
            </div>
            <div class="info-row">
              <span class="label">Date of Birth:</span>
              <span class="value">{{ formatDate(student.birthday) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Gender:</span>
              <span class="value">{{ student.gender }}</span>
            </div>
            <div class="info-row">
              <span class="label">Address:</span>
              <span class="value">{{ student.address }}</span>
            </div>
          </div>
          
          <div class="student-photo-section">
            <div class="photo-container">
              <img 
                v-if="student.photoUrl" 
                :src="student.photoUrl" 
                :alt="student.fullName"
                class="student-photo"
              />
              <div v-else class="photo-placeholder">
                <span class="initials">{{ getStudentInitials() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Academic Records by School Year -->
      <div class="academic-records">
        <div v-for="record in academicRecords" :key="record.schoolYear" class="school-year-section">
          <h3 class="school-year-header">
            School Year {{ record.schoolYear }} - Grade {{ record.gradeLevel }}
          </h3>
          
          <table class="grades-table">
            <thead>
              <tr>
                <th class="subject-code">Subject Code</th>
                <th class="subject-name">Subject Name</th>
                <th class="units">Units</th>
                <th class="q1">Q1</th>
                <th class="q2">Q2</th>
                <th class="q3">Q3</th>
                <th class="q4">Q4</th>
                <th class="final-grade">Final Grade</th>
                <th class="remarks">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in record.subjects" :key="subject.code">
                <td class="subject-code">{{ subject.code }}</td>
                <td class="subject-name">{{ subject.name }}</td>
                <td class="units">{{ subject.units }}</td>
                <td class="q1">{{ subject.quarters.q1 }}</td>
                <td class="q2">{{ subject.quarters.q2 }}</td>
                <td class="q3">{{ subject.quarters.q3 }}</td>
                <td class="q4">{{ subject.quarters.q4 }}</td>
                <td class="final-grade">{{ subject.finalGrade }}</td>
                <td class="remarks">{{ subject.remarks }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="summary-row">
                <td colspan="2" class="summary-label">School Year Average:</td>
                <td class="total-units">{{ record.totalUnits }}</td>
                <td colspan="4"></td>
                <td class="year-average">{{ record.yearAverage }}</td>
                <td class="year-status">{{ record.status }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Overall Summary -->
      <div class="summary-section">
        <div class="summary-grid">
          <div class="gwa-section">
            <h4>General Weighted Average</h4>
            <div class="gwa-value">{{ overallGWA }}</div>
            <div class="gwa-description">{{ getGradeDescription(overallGWA) }}</div>
          </div>
          
          <div class="statistics-section">
            <h4>Academic Statistics</h4>
            <div class="stat-item">
              <span class="stat-label">Total Units Earned:</span>
              <span class="stat-value">{{ totalUnitsEarned }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Years Completed:</span>
              <span class="stat-value">{{ academicRecords.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Academic Status:</span>
              <span class="stat-value">{{ overallStatus }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="transcript-footer">
        <div class="certification-section">
          <p class="certification-text">
            This is to certify that the above is a true and correct transcript of the academic record of the above-named student.
          </p>
          
          <div class="signatures-section">
            <div class="signature-block">
              <div class="signature-line"></div>
              <p class="signature-label">Registrar</p>
              <p class="signature-date">Date: {{ getCurrentDate() }}</p>
            </div>
            
            <div class="signature-block">
              <div class="signature-line"></div>
              <p class="signature-label">Principal</p>
              <p class="signature-date">Date: {{ getCurrentDate() }}</p>
            </div>
          </div>
        </div>
        
        <div class="document-info">
          <p class="generated-date">Generated on: {{ getCurrentDateTime() }}</p>
          <p class="document-id">Document ID: TOR-{{ student.studentId }}-{{ new Date().getTime() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// School information
const schoolInfo = ref({
  name: 'Sample High School',
  address: '123 Education Street, Learning City, Knowledge Province 1234',
  contact: 'Tel: (02) 123-4567 | Email: registrar@samplehs.edu.ph',
  logo: '/demo/images/id_logo.jpeg' // Update with actual school logo path
})

// Student data
const student = ref({
  fullName: 'Juan Pedro Dela Cruz',
  studentId: 'SHS-2024-001',
  lrn: '123456789012',
  birthday: new Date('2008-05-15'),
  gender: 'Male',
  address: '456 Student Avenue, Hometown City, Province 5678',
  photoUrl: null
})

// Academic records data
const academicRecords = ref([])

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

// Print and download functions
const printTranscript = () => {
  window.print()
}

const downloadPDF = async () => {
  try {
    const element = document.getElementById('transcript-content')
    
    // Create canvas with high resolution
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    
    // Create PDF in A4 size
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Add new pages if content exceeds one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Save PDF
    pdf.save(`TOR_${student.value.studentId}_${student.value.fullName.replace(/\s+/g, '_')}.pdf`)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  }
}

// Initialize with sample data
generateSampleData()
</script>

<style scoped>
.transcript-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Times New Roman', serif;
}

.transcript-document {
  background: white;
  padding: 30px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  min-height: 297mm; /* A4 height */
}

/* Header Styles */
.transcript-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 3px solid #2563eb;
  padding-bottom: 20px;
}

.school-logo-section {
  margin-right: 30px;
}

.school-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.logo-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
}

.school-details {
  flex: 1;
  text-align: center;
}

.school-name {
  font-size: 24px;
  font-weight: bold;
  color: #1e40af;
  margin: 0 0 8px 0;
  text-transform: uppercase;
}

.school-address,
.school-contact {
  font-size: 12px;
  margin: 4px 0;
  color: #666;
}

.document-title h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0 5px 0;
  color: #1e40af;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.document-subtitle {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* Student Information Styles */
.student-section {
  margin-bottom: 30px;
}

.student-info-grid {
  display: flex;
  gap: 30px;
}

.student-details {
  flex: 1;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  align-items: baseline;
}

.label {
  font-weight: bold;
  width: 120px;
  flex-shrink: 0;
}

.value {
  flex: 1;
  border-bottom: 1px solid #ccc;
  padding-bottom: 2px;
  margin-left: 10px;
}

.student-photo-section {
  width: 120px;
  flex-shrink: 0;
}

.photo-container {
  width: 120px;
  height: 140px;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
}

.student-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
}

.initials {
  font-size: 24px;
  font-weight: bold;
}

/* Academic Records Styles */
.academic-records {
  margin-bottom: 30px;
}

.school-year-section {
  margin-bottom: 25px;
}

.school-year-header {
  font-size: 16px;
  font-weight: bold;
  background: #f3f4f6;
  padding: 10px;
  border: 1px solid #d1d5db;
  margin-bottom: 0;
  text-align: center;
  color: #1f2937;
}

.grades-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.grades-table th,
.grades-table td {
  border: 1px solid #333;
  padding: 6px 4px;
  text-align: center;
}

.grades-table th {
  background: #f9f9f9;
  font-weight: bold;
  font-size: 10px;
}

.subject-code {
  width: 12%;
}

.subject-name {
  width: 30%;
  text-align: left !important;
}

.units {
  width: 8%;
}

.q1, .q2, .q3, .q4 {
  width: 8%;
}

.final-grade {
  width: 10%;
  font-weight: bold;
}

.remarks {
  width: 12%;
  font-size: 9px;
}

.summary-row {
  background: #f3f4f6;
  font-weight: bold;
}

.summary-label {
  text-align: right !important;
  padding-right: 10px;
}

.total-units,
.year-average {
  font-weight: bold;
  color: #1e40af;
}

.year-status {
  color: #059669;
  font-weight: bold;
}

/* Summary Section Styles */
.summary-section {
  margin-bottom: 30px;
  border: 2px solid #2563eb;
  padding: 20px;
  background: #f8fafc;
}

.summary-grid {
  display: flex;
  gap: 40px;
}

.gwa-section {
  text-align: center;
  flex: 1;
}

.gwa-section h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #1e40af;
}

.gwa-value {
  font-size: 32px;
  font-weight: bold;
  color: #dc2626;
  margin-bottom: 5px;
}

.gwa-description {
  font-size: 14px;
  color: #059669;
  font-weight: bold;
}

.statistics-section {
  flex: 1;
}

.statistics-section h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #1e40af;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px 0;
  border-bottom: 1px dotted #ccc;
}

.stat-label {
  font-weight: bold;
}

.stat-value {
  color: #dc2626;
  font-weight: bold;
}

/* Footer Styles */
.transcript-footer {
  margin-top: 40px;
  border-top: 2px solid #333;
  padding-top: 20px;
}

.certification-section {
  margin-bottom: 20px;
}

.certification-text {
  text-align: center;
  font-style: italic;
  margin-bottom: 30px;
  color: #374151;
}

.signatures-section {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.signature-block {
  text-align: center;
  width: 200px;
}

.signature-line {
  border-bottom: 1px solid #333;
  margin-bottom: 5px;
  height: 40px;
}

.signature-label {
  font-weight: bold;
  margin: 5px 0;
}

.signature-date {
  font-size: 10px;
  color: #666;
}

.document-info {
  text-align: center;
  font-size: 10px;
  color: #666;
}

.generated-date,
.document-id {
  margin: 2px 0;
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .transcript-container {
    margin: 0;
    padding: 0;
    max-width: none;
  }
  
  .transcript-document {
    box-shadow: none;
    padding: 20px;
  }
  
  body * {
    visibility: hidden;
  }
  
  .transcript-document,
  .transcript-document * {
    visibility: visible;
  }
  
  .transcript-document {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .transcript-container {
    padding: 10px;
  }
  
  .transcript-document {
    padding: 20px;
  }
  
  .transcript-header {
    flex-direction: column;
    text-align: center;
  }
  
  .school-logo-section {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .student-info-grid {
    flex-direction: column;
  }
  
  .student-photo-section {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .summary-grid {
    flex-direction: column;
    gap: 20px;
  }
  
  .signatures-section {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
}
</style>

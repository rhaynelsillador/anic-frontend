<script setup lang="ts">
import { ref, nextTick } from 'vue'
import html2canvas from 'html2canvas'

interface Props {
  students: any[] // Changed from Student[] to any[] to handle both enrollment and student objects
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

// School information (you can make this configurable)
const schoolInfo = ref({
  name: 'Your School Name',
  address: '123 School Street, City, Province',
  logo: '/demo/images/id_logo.jpeg', // Update with actual school logo path
  schoolYear: '2024-2025'
})

// Generate and download ID as image
const generateIDImage = async () => {
  try {
    // Hide action buttons and print instructions temporarily
    const actionButtons = document.querySelector('.no-print') as HTMLElement
    const printInstructions = document.querySelector('.print-instructions') as HTMLElement
    
    if (actionButtons) actionButtons.style.display = 'none'
    if (printInstructions) printInstructions.style.display = 'none'
    
    // Wait for DOM update
    await nextTick()
    
    // Get the ID card container
    const idCardElement = document.querySelector('.id-card')
    
    if (!idCardElement) {
      throw new Error('ID card element not found')
    }
    
    // Generate canvas from the ID card
    const canvas = await html2canvas(idCardElement as HTMLElement, {
      useCORS: true,
      allowTaint: true,
      logging: false,
      scale: 20, // Higher resolution - 20x the original size
      width: idCardElement.offsetWidth,
      height: idCardElement.offsetHeight,
      backgroundColor: '#ffffff',
      removeContainer: true,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        // Enhance text rendering in the cloned document
        const clonedElement = clonedDoc.querySelector('.id-card') as HTMLElement
        if (clonedElement) {
          clonedElement.style.transform = 'scale(1)'
          clonedElement.style.transformOrigin = 'top left'
        }
      }
    })
    
    // Convert canvas to blob with maximum quality
    canvas.toBlob((blob) => {
      if (blob) {
        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        
        // Generate filename with student name
        const student = getStudent(props.students[0])
        const fileName = `ID_${student.firstName}_${student.lastName}_${student.studentId || 'Unknown'}.png`
        
        link.href = url
        link.download = fileName
        link.click()
        
        // Clean up
        URL.revokeObjectURL(url)
      }
    }, 'image/png', 1.0) // Maximum quality (1.0)
    
    // Show action buttons and print instructions again
    if (actionButtons) actionButtons.style.display = 'flex'
    if (printInstructions) printInstructions.style.display = 'block'
    
  } catch (error) {
    console.error('Error generating ID image:', error)
    alert('Failed to generate ID image. Please try again.')
  }
}

// Get student photo or generate initials
const getStudentPhoto = (studentData: any) => {
  const student = studentData.student || studentData
  if (student.photoUrl) {
    return student.photoUrl
  }
  return null
}

// Get student initials for avatar
const getStudentInitials = (studentData: any) => {
  const student = studentData.student || studentData
  const firstName = student.firstName || ''
  const lastName = student.lastName || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Get grade level display
const getGradeLevel = (studentData: any) => {
  const student = studentData.student || studentData
  // Try enrollment data first, then student data
  return studentData.yearLevel || student.yearLevelData?.name || student.yearLevel?.name || 'N/A'
}

// Get section display
const getSection = (studentData: any) => {
  const student = studentData.student || studentData
  // Try enrollment data first, then student data
  return studentData.section || student.sectionData?.name || student.section?.name || 'N/A'
}

// Get student data (handles both direct student objects and enrollment objects)
const getStudent = (studentData: any) => {
  return studentData.student || studentData
}

// Close dialog
const closeDialog = () => {
  emit('close')
}
</script>

<template>
  <div class="id-preview-container">
    <!-- Action buttons -->
    <div class="flex justify-end gap-3 mb-4 no-print">
      <Button 
        label="Close" 
        icon="pi pi-times" 
        severity="secondary" 
        @click="closeDialog"
      />
      <Button 
        label="Print IDs" 
        icon="pi pi-print" 
        severity="primary" 
        @click="generateIDImage"
      />
    </div>

    <!-- ID Cards Grid -->
    <div class="ids-grid">
      <div 
        v-for="studentData in students" 
        :key="studentData.id || studentData.student?.id" 
        class="id-card"
      >
        <!-- Front side of ID -->
        <div class="id-front">
          <!-- Header -->
          <div class="id-header">
            <div class="school-logo">
              <img 
                v-if="schoolInfo.logo" 
                :src="schoolInfo.logo" 
                alt="School Logo"
                class="logo-img"
              />
              <div v-else class="logo-placeholder">
                <i class="pi pi-building text-2xl"></i>
              </div>
            </div>
            <div class="school-info">
              <h3 class="school-name">{{ schoolInfo.name }}</h3>
              <p class="school-address">{{ schoolInfo.address }}</p>
              <p class="school-year">S.Y. {{ schoolInfo.schoolYear }}</p>
            </div>
          </div>

          <!-- Student Photo -->
          <div class="student-photo-section">
            <div class="photo-container">
              <img 
                v-if="getStudentPhoto(studentData)" 
                :src="getStudentPhoto(studentData)" 
                :alt="`${getStudent(studentData).firstName} ${getStudent(studentData).lastName}`"
                class="student-photo"
              />
              <div v-else class="photo-placeholder">
                <span class="initials">{{ getStudentInitials(studentData) }}</span>
              </div>
            </div>
          </div>

          <!-- Student Information -->
          <div class="student-info">
            <div class="student-name">
              {{ getStudent(studentData).firstName }} {{ getStudent(studentData).middleName ? getStudent(studentData).middleName.charAt(0) + '.' : '' }} {{ getStudent(studentData).lastName }}
            </div>
            
            <div class="student-details">
              <div class="detail-row">
                <span class="label">Student ID:</span>
                <span class="value">{{ getStudent(studentData).studentId || 'N/A' }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">LRN:</span>
                <span class="value">{{ getStudent(studentData).lrn || 'N/A' }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Grade:</span>
                <span class="value">{{ getGradeLevel(studentData) }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Section:</span>
                <span class="value">{{ getSection(studentData) }}</span>
              </div>
            </div>
          </div>

          <!-- ID Footer -->
          <div class="id-footer">
            <div class="signature-line">
              <div class="line"></div>
              <p class="signature-label">Principal's Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Print Instructions -->
    <div class="print-instructions no-print">
      <Card>
        <template #title>Print Instructions</template>
        <template #content>
          <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Click "Print IDs" to open the print dialog</li>
            <li>Ensure your printer is set to A4 or Letter size</li>
            <li>Use the highest quality print setting for best results</li>
            <li>Consider using cardstock paper for durability</li>
            <li>Each ID is designed to fit standard ID card dimensions</li>
          </ul>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.id-preview-container {
  max-width: 100%;
}

.ids-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.id-card {
  width: 204px;
  height: 324px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  /* Improve rendering quality */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.id-front {
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  position: relative;
}

.id-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 50px;
}

.school-logo {
  flex-shrink: 0;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.logo-placeholder {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.school-info {
  flex: 1;
  min-width: 0;
}

.school-name {
  font-size: 12px;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.school-address {
  font-size: 9px;
  margin: 2px 0;
  opacity: 0.9;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.school-year {
  font-size: 9px;
  margin: 0;
  opacity: 0.9;
}

.student-photo-section {
  display: flex;
  justify-content: center;
  padding: 12px 0 8px 0;
}

.photo-container {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border: 3px solid #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.initials {
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.student-info {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.student-name {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.2;
  /* Improve text quality for export */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  /* Improve text quality for export */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  font-weight: 500;
  color: #333;
}

.id-footer {
  padding: 8px 12px;
  border-top: 1px solid #e5e7eb;
}

.signature-line {
  text-align: center;
}

.line {
  width: 80px;
  height: 1px;
  background: #333;
  margin: 0 auto 2px auto;
}

.signature-label {
  font-size: 8px;
  color: #666;
  margin: 0;
}

.print-instructions {
  margin-top: 20px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .id-preview-container {
    margin: 0;
    padding: 0;
  }
  
  .ids-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10mm;
    margin: 0;
    page-break-inside: avoid;
  }
  
  .id-card {
    width: 85mm;
    height: 54mm;
    margin: 0;
    page-break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  /* Ensure proper printing colors */
  .id-header,
  .photo-placeholder {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ids-grid {
    grid-template-columns: 1fr;
  }
  
  .id-card {
    width: 100%;
    max-width: 350px;
  }
}
</style>

<template>
  <div class="transcript-generator-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">
            <i class="pi pi-home"></i>
            Home
          </router-link>
          <i class="pi pi-angle-right breadcrumb-separator"></i>
          <span class="current-page">Transcript Generator</span>
        </div>
        
        <h1 class="page-title">Transcript of Records Generator</h1>
        <p class="page-description">
          Generate sample transcript of records for students. This tool creates professional-looking 
          transcripts with academic records, grades, and certification information.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <Card class="transcript-card">
        <template #title>
          <div class="card-title-section">
            <i class="pi pi-file-text text-2xl text-blue-600 mr-3"></i>
            Sample Transcript of Records
          </div>
        </template>
        
        <template #content>
          <div class="transcript-info mb-4">
            <Message severity="info" :closable="false">
              <div class="info-content">
                <strong>Features:</strong>
                <ul class="feature-list">
                  <li>Professional transcript format with school branding</li>
                  <li>Complete student information with photo placeholder</li>
                  <li>Academic records by school year with quarterly grades</li>
                  <li>General Weighted Average (GWA) calculation</li>
                  <li>Academic honors and status determination</li>
                  <li>Official certification and signature sections</li>
                  <li>Print-ready layout with PDF download option</li>
                </ul>
              </div>
            </Message>
          </div>

          <!-- Transcript Component -->
          <TranscriptOfRecords />
        </template>
      </Card>
    </div>

    <!-- Instructions Panel -->
    <Card class="instructions-card mt-4">
      <template #title>
        <div class="card-title-section">
          <i class="pi pi-question-circle text-xl text-green-600 mr-2"></i>
          How to Use
        </div>
      </template>
      
      <template #content>
        <div class="instructions-grid">
          <div class="instruction-item">
            <div class="instruction-icon">
              <i class="pi pi-refresh text-blue-500"></i>
            </div>
            <div class="instruction-content">
              <h4>Generate Sample Data</h4>
              <p>Click "Generate Sample Data" to create random academic records with realistic grades and subjects.</p>
            </div>
          </div>

          <div class="instruction-item">
            <div class="instruction-icon">
              <i class="pi pi-print text-purple-500"></i>
            </div>
            <div class="instruction-content">
              <h4>Print Transcript</h4>
              <p>Use "Print Transcript" to open your browser's print dialog for immediate printing.</p>
            </div>
          </div>

          <div class="instruction-item">
            <div class="instruction-icon">
              <i class="pi pi-download text-green-500"></i>
            </div>
            <div class="instruction-content">
              <h4>Download PDF</h4>
              <p>Click "Download PDF" to save the transcript as a high-quality PDF file.</p>
            </div>
          </div>

          <div class="instruction-item">
            <div class="instruction-icon">
              <i class="pi pi-cog text-orange-500"></i>
            </div>
            <div class="instruction-content">
              <h4>Customize</h4>
              <p>Modify the component code to include your school's information, logo, and specific grading system.</p>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Technical Details -->
    <Card class="technical-card mt-4">
      <template #title>
        <div class="card-title-section">
          <i class="pi pi-code text-xl text-gray-600 mr-2"></i>
          Technical Information
        </div>
      </template>
      
      <template #content>
        <div class="technical-info">
          <div class="tech-section">
            <h4>Component Features</h4>
            <ul class="tech-list">
              <li><strong>Responsive Design:</strong> Adapts to different screen sizes while maintaining print quality</li>
              <li><strong>Print Optimization:</strong> Special CSS media queries for clean printing</li>
              <li><strong>PDF Generation:</strong> Uses html2canvas and jsPDF for high-quality PDF output</li>
              <li><strong>Grade Calculations:</strong> Automatic GWA computation and academic status determination</li>
              <li><strong>Professional Layout:</strong> Follows standard transcript formatting guidelines</li>
            </ul>
          </div>

          <div class="tech-section">
            <h4>Customization Options</h4>
            <ul class="tech-list">
              <li>Update school information in the <code>schoolInfo</code> reactive object</li>
              <li>Modify student data structure in the <code>student</code> ref</li>
              <li>Customize subjects and grading system in <code>generateSampleData()</code></li>
              <li>Adjust styling through the component's scoped CSS</li>
              <li>Add integration with your school's student management system</li>
            </ul>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import TranscriptOfRecords from '@/components/TranscriptOfRecords.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Page metadata
defineOptions({
  name: 'TranscriptGeneratorPage'
})
</script>

<style scoped>
.transcript-generator-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.page-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
}

.header-content {
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: white;
}

.breadcrumb-separator {
  margin: 0 12px;
  color: rgba(255, 255, 255, 0.6);
}

.current-page {
  color: white;
  font-weight: 500;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-description {
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  max-width: 800px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.transcript-card,
.instructions-card,
.technical-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card-title-section {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.transcript-info {
  margin-bottom: 24px;
}

.info-content {
  font-size: 14px;
}

.feature-list {
  margin: 12px 0 0 20px;
  padding: 0;
}

.feature-list li {
  margin-bottom: 6px;
  color: #374151;
}

.instructions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.instruction-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.instruction-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.instruction-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.instruction-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.instruction-content p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.technical-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
}

.tech-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.tech-list {
  margin: 0;
  padding: 0 0 0 20px;
}

.tech-list li {
  margin-bottom: 12px;
  color: #374151;
  line-height: 1.6;
}

.tech-list code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #dc2626;
  font-family: 'Courier New', monospace;
}

/* Responsive Design */
@media (max-width: 768px) {
  .transcript-generator-page {
    padding: 16px;
  }

  .header-content {
    padding: 24px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-description {
    font-size: 14px;
  }

  .instructions-grid {
    grid-template-columns: 1fr;
  }

  .technical-info {
    grid-template-columns: 1fr;
  }

  .instruction-item {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .breadcrumb {
    flex-wrap: wrap;
  }

  .instruction-item {
    flex-direction: column;
    text-align: center;
  }

  .instruction-icon {
    align-self: center;
  }
}
</style>

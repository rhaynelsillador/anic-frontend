<template>
  <div class="setup-wizard-container min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <Card class="setup-wizard-card w-full max-w-2xl">
      <template #title>
        <div class="text-center">
          <i class="pi pi-cog text-4xl text-primary mb-3"></i>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">School Setup Wizard</h1>
          <p class="text-gray-600">Welcome! Let's set up your school management system.</p>
        </div>
      </template>
      
      <template #content>
        <div class="setup-content">
          <!-- Progress Steps -->
          <div class="steps-container mb-8">
            <Steps :model="steps" :readonly="false" :activeStep="activeStep" />
          </div>

          <!-- Step 1: School Information -->
          <div v-if="activeStep === 0" class="step-content">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">School Information</h3>
            
            <div class="form-grid grid grid-cols-1 gap-6">
              <div class="field">
                <label for="schoolName" class="block text-sm font-medium text-gray-700 mb-2">
                  School Name *
                </label>
                <InputText 
                  id="schoolName"
                  v-model="setupData.schoolName" 
                  placeholder="Enter school name"
                  class="w-full"
                  :class="{ 'p-invalid': !setupData.schoolName && showValidation }"
                />
                <small v-if="!setupData.schoolName && showValidation" class="p-error">
                  School name is required
                </small>
              </div>

              <div class="field">
                <label for="systemName" class="block text-sm font-medium text-gray-700 mb-2">
                  System Name *
                </label>
                <InputText 
                  id="systemName"
                  v-model="setupData.systemName" 
                  placeholder="Enter system name (e.g., EduTrack, SchoolPro)"
                  class="w-full"
                  :class="{ 'p-invalid': !setupData.systemName && showValidation }"
                />
                <small v-if="!setupData.systemName && showValidation" class="p-error">
                  System name is required
                </small>
                <small class="text-xs text-gray-500 mt-1">
                  This name will appear on the login page and throughout the system
                </small>
              </div>

              <div class="field">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <Textarea 
                  id="address"
                  v-model="setupData.address" 
                  placeholder="Enter school address"
                  rows="3"
                  class="w-full"
                />
              </div>

              <div class="field">
                <label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information
                </label>
                <Textarea 
                  id="contactInfo"
                  v-model="setupData.contactInformation" 
                  placeholder="Enter contact information (phone, email, etc.)"
                  rows="3"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Step 2: Logo Upload -->
          <div v-if="activeStep === 1" class="step-content">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">School Logo (Optional)</h3>
            
            <div class="logo-upload-container text-center">
              <div class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 mb-4">Upload your school logo</p>
                <FileUpload 
                  mode="basic" 
                  name="logo"
                  :maxFileSize="5000000"
                  accept="image/*"
                  chooseLabel="Choose Logo"
                  class="p-button-outlined"
                  @upload="onLogoUpload"
                  @select="onLogoSelect"
                />
              </div>
              
              <div v-if="setupData.logoPath" class="preview-container">
                <p class="text-sm text-gray-600 mb-2">Logo Preview:</p>
                <img :src="setupData.logoPath" alt="School Logo Preview" class="max-h-32 mx-auto rounded-lg shadow-md" />
              </div>
            </div>
          </div>

          <!-- Step 3: Review & Complete -->
          <div v-if="activeStep === 2" class="step-content">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Review & Complete Setup</h3>
            
            <div class="review-container bg-gray-50 rounded-lg p-6 mb-6">
              <div class="review-item mb-4">
                <label class="font-medium text-gray-700">School Name:</label>
                <p class="text-gray-900">{{ setupData.schoolName || 'Not provided' }}</p>
              </div>
              
              <div class="review-item mb-4">
                <label class="font-medium text-gray-700">System Name:</label>
                <p class="text-gray-900">{{ setupData.systemName || 'Not provided' }}</p>
              </div>
              
              <div class="review-item mb-4">
                <label class="font-medium text-gray-700">Address:</label>
                <p class="text-gray-900">{{ setupData.address || 'Not provided' }}</p>
              </div>
              
              <div class="review-item mb-4">
                <label class="font-medium text-gray-700">Contact Information:</label>
                <p class="text-gray-900">{{ setupData.contactInformation || 'Not provided' }}</p>
              </div>
              
              <div class="review-item mb-4">
                <label class="font-medium text-gray-700">Logo:</label>
                <p class="text-gray-900">{{ setupData.logoPath ? 'Uploaded' : 'No logo uploaded' }}</p>
              </div>
            </div>

            <div class="admin-info bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="pi pi-info-circle text-blue-400"></i>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-blue-800">Admin Account Creation</h4>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>An administrator account will be automatically created with the following credentials:</p>
                    <ul class="list-disc ml-5 mt-2">
                      <li><strong>Username:</strong> admin</li>
                      <li><strong>Password:</strong> admin1234</li>
                    </ul>
                    <p class="mt-2 text-xs text-blue-600">
                      <strong>Important:</strong> Please change the password after your first login for security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="actions-container flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button 
              v-if="activeStep > 0"
              label="Back" 
              icon="pi pi-arrow-left"
              severity="secondary"
              @click="previousStep"
              :disabled="isLoading"
            />
            
            <div class="flex gap-3 ml-auto">
              <Button 
                v-if="activeStep < 2"
                label="Next" 
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="nextStep"
                :disabled="isLoading"
              />
              
              <Button 
                v-if="activeStep === 2"
                label="Complete Setup" 
                icon="pi pi-check"
                severity="success"
                @click="completeSetup"
                :loading="isLoading"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Steps from 'primevue/steps'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import SchoolSetupService, { type SchoolSetupRequest, type SchoolSetupResponse } from '@/types/school_setup'

const router = useRouter()
const toast = useToast()

// Component state
const activeStep = ref(0)
const isLoading = ref(false)
const showValidation = ref(false)

// Setup form data
const setupData = ref<SchoolSetupRequest>({
  schoolName: '',
  systemName: '',
  address: '',
  contactInformation: '',
  logoPath: ''
})

// Steps configuration
const steps = ref([
  { label: 'School Info' },
  { label: 'Logo' },
  { label: 'Review' }
])

// Navigation methods
const nextStep = () => {
  if (activeStep.value === 0) {
    // Validate required fields for step 1
    if (!setupData.value.schoolName.trim() || !setupData.value.systemName.trim()) {
      showValidation.value = true
      toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please enter the school name before proceeding.',
        life: 3000
      })
      return
    }
  }
  
  if (activeStep.value < 2) {
    activeStep.value++
    showValidation.value = false
  }
}

const previousStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
    showValidation.value = false
  }
}

// File upload handlers
const onLogoSelect = (event: any) => {
  const file = event.files[0]
  if (file) {
    // Create a preview URL for the selected image
    const reader = new FileReader()
    reader.onload = (e) => {
      setupData.value.logoPath = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const onLogoUpload = (event: any) => {
  // Handle actual upload if needed
}

// Setup completion
const completeSetup = async () => {
  if (!setupData.value.schoolName.trim() || !setupData.value.systemName.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'School name and system name are required to complete setup.',
      life: 3000
    })
    return
  }

  isLoading.value = true

  try {
    const setupService = new SchoolSetupService()
    
    // Step 1: Create/save setup data
    await new Promise<void>((resolve, reject) => {
      setupService.createSetup(
        setupData.value,
        (response) => {
          if (response.status === 'SUCCESS' && response.data) {
            const setupResponse = response.data as SchoolSetupResponse
            if (setupResponse.id) {
              // Step 2: Complete the setup and create admin account
              setupService.completeSetup(
                setupResponse.id,
                (completeResponse) => {
                  if (completeResponse.status === 'SUCCESS') {
                    toast.add({
                      severity: 'success',
                      summary: 'Setup Complete!',
                      detail: 'School setup completed successfully. Admin account created.',
                      life: 5000
                    })
                    
                    // Redirect to login page after a short delay
                    setTimeout(() => {
                      router.push('/login')
                    }, 2000)
                    
                    resolve()
                  } else {
                    reject(new Error(completeResponse.message || 'Failed to complete setup'))
                  }
                },
                (error) => {
                  reject(error)
                }
              )
            } else {
              reject(new Error('Setup ID not returned'))
            }
          } else {
            reject(new Error(response.message || 'Failed to create setup'))
          }
        },
        (error) => {
          reject(error)
        }
      )
    })

  } catch (error: any) {
    console.error('Setup completion error:', error)
    toast.add({
      severity: 'error',
      summary: 'Setup Failed',
      detail: error.message || 'Failed to complete setup. Please try again.',
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}

// Check if setup is already complete on component mount
onMounted(() => {
  const setupService = new SchoolSetupService()
  
  setupService.checkSetupStatus(
    (response) => {
      if (response.status === 'SUCCESS' && response.data) {
        const setupResponse = response.data as SchoolSetupResponse
        if (setupResponse.isSetupComplete) {
          // Setup is already complete, redirect to login
          router.push('/login')
        }
      }
    },
    (error) => {
      console.warn('Could not check setup status:', error)
      // Continue with setup wizard
    }
  )
})
</script>

<style scoped>
.setup-wizard-container {
  font-family: 'Inter', sans-serif;
}

.setup-wizard-card {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.step-content {
  min-height: 300px;
}

.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.review-item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.admin-info {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

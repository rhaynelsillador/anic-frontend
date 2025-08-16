<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import SchoolSetupService, { type SchoolSetupRequest, type SchoolSetupResponse } from '@/types/school_setup';

const toast = useToast();
const globalStore = useGlobalStore();

const isLoading = ref(false);
const isSaving = ref(false);
const showValidation = ref(false);

// Form data
const schoolInfo = ref<SchoolSetupRequest>({
  schoolName: '',
  systemName: '',
  address: '',
  contactInformation: '',
  logoPath: ''
});

const originalLogo = ref('');

// Load current school information
onMounted(() => {
  loadSchoolInfo();
});

const loadSchoolInfo = () => {
  isLoading.value = true;
  const setupService = new SchoolSetupService();
  
  setupService.getCurrentSetup(
    (response) => {
      if (response.status === 'SUCCESS' && response.data) {
        const data = response.data as SchoolSetupResponse;
        schoolInfo.value = {
          schoolName: data.schoolName || '',
          systemName: data.systemName || '',
          address: data.address || '',
          contactInformation: data.contactInformation || '',
          logoPath: data.logoPath || ''
        };
        originalLogo.value = data.logoPath || '';
      }
      isLoading.value = false;
    },
    (error) => {
      console.error('Failed to load school information:', error);
      toast.add({
        severity: 'error',
        summary: 'Load Error',
        detail: 'Failed to load school information',
        life: 3000
      });
      isLoading.value = false;
    }
  );
};

const validateForm = () => {
  let isValid = true;
  
  if (!schoolInfo.value.schoolName.trim()) {
    isValid = false;
  }
  
  if (!schoolInfo.value.systemName.trim()) {
    isValid = false;
  }
  
  return isValid;
};

const saveSchoolInfo = () => {
  showValidation.value = true;
  
  if (!validateForm()) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields',
      life: 3000
    });
    return;
  }

  isSaving.value = true;
  const setupService = new SchoolSetupService();
  
  setupService.updateSchoolInfo(
    schoolInfo.value,
    (response) => {
      if (response.status === 'SUCCESS') {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'School information updated successfully',
          life: 3000
        });
        originalLogo.value = schoolInfo.value.logoPath;
      } else {
        toast.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: response.message || 'Failed to update school information',
          life: 3000
        });
      }
      isSaving.value = false;
    },
    (error) => {
      console.error('Failed to update school information:', error);
      toast.add({
        severity: 'error',
        summary: 'Update Error',
        detail: error.response?.data?.message || 'Failed to update school information',
        life: 5000
      });
      isSaving.value = false;
    }
  );
};

const onLogoSelect = (event: any) => {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      schoolInfo.value.logoPath = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const resetLogo = () => {
  schoolInfo.value.logoPath = originalLogo.value;
};

const removeLogo = () => {
  schoolInfo.value.logoPath = '';
};
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">School Information Settings</h1>
      <Button 
        label="Save Changes" 
        icon="pi pi-save"
        :loading="isSaving"
        :disabled="isLoading || isSaving"
        @click="saveSchoolInfo"
        class="p-button-success"
      />
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Basic Information -->
      <div class="space-y-6">
        <div class="card">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
          
          <div class="space-y-4">
            <div class="field">
              <label for="schoolName" class="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <InputText 
                id="schoolName"
                v-model="schoolInfo.schoolName" 
                placeholder="Enter school name"
                class="w-full"
                :class="{ 'p-invalid': !schoolInfo.schoolName && showValidation }"
                :disabled="isSaving"
              />
              <small v-if="!schoolInfo.schoolName && showValidation" class="p-error">
                School name is required
              </small>
            </div>

            <div class="field">
              <label for="systemName" class="block text-sm font-medium text-gray-700 mb-2">
                System Name *
              </label>
              <InputText 
                id="systemName"
                v-model="schoolInfo.systemName" 
                placeholder="Enter system name (e.g., EduTrack, SchoolPro)"
                class="w-full"
                :class="{ 'p-invalid': !schoolInfo.systemName && showValidation }"
                :disabled="isSaving"
              />
              <small v-if="!schoolInfo.systemName && showValidation" class="p-error">
                System name is required
              </small>
              <small class="text-xs text-gray-500 mt-1">
                This name appears on the login page and throughout the system
              </small>
            </div>

            <div class="field">
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <Textarea 
                id="address"
                v-model="schoolInfo.address" 
                placeholder="Enter school address"
                rows="3"
                class="w-full"
                :disabled="isSaving"
              />
            </div>

            <div class="field">
              <label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </label>
              <Textarea 
                id="contactInfo"
                v-model="schoolInfo.contactInformation" 
                placeholder="Enter contact information (phone, email, website)"
                rows="3"
                class="w-full"
                :disabled="isSaving"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Logo Management -->
      <div class="space-y-6">
        <div class="card">
          <h3 class="text-lg font-medium text-gray-800 mb-4">School Logo</h3>
          
          <div class="space-y-4">
            <!-- Current Logo Display -->
            <div v-if="schoolInfo.logoPath" class="text-center">
              <div class="mb-3">
                <label for="logoPath" class="block text-sm font-medium text-gray-700 mb-2">Current Logo</label>
                <div class="flex justify-center">
                  <img 
                    :src="schoolInfo.logoPath" 
                    alt="School Logo" 
                    class="max-h-32 max-w-48 object-contain border border-gray-200 rounded-lg shadow-sm"
                  />
                </div>
              </div>
              
              <div class="flex justify-center gap-2">
                <Button 
                  label="Change Logo" 
                  icon="pi pi-upload" 
                  severity="secondary" 
                  size="small"
                  :disabled="isSaving"
                />
                <Button 
                  label="Reset" 
                  icon="pi pi-refresh" 
                  severity="secondary" 
                  size="small"
                  :disabled="isSaving"
                  @click="resetLogo"
                  v-if="schoolInfo.logoPath !== originalLogo"
                />
                <Button 
                  label="Remove" 
                  icon="pi pi-trash" 
                  severity="danger" 
                  size="small"
                  :disabled="isSaving"
                  @click="removeLogo"
                />
              </div>
            </div>

            <!-- Upload Area -->
            <div v-else class="text-center">
              <FileUpload 
                mode="basic" 
                name="logo"
                :multiple="false"
                accept="image/*"
                :maxFileSize="5000000"
                @select="onLogoSelect"
                :disabled="isSaving"
                class="w-full"
              >
                <template #empty>
                  <div class="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600 mb-2">Click to upload school logo</p>
                    <p class="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </template>
              </FileUpload>
            </div>

            <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div class="flex">
                <i class="pi pi-info-circle text-blue-400 mt-1"></i>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-blue-800">Logo Guidelines</h4>
                  <div class="mt-2 text-sm text-blue-700">
                    <ul class="list-disc ml-5">
                      <li>Recommended size: 256x256 pixels or larger</li>
                      <li>Square format works best</li>
                      <li>PNG format with transparent background preferred</li>
                      <li>Maximum file size: 5MB</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Save Button at Bottom for Mobile -->
    <div class="mt-8 lg:hidden">
      <Button 
        label="Save Changes" 
        icon="pi pi-save"
        :loading="isSaving"
        :disabled="isLoading || isSaving"
        @click="saveSchoolInfo"
        class="w-full p-button-success p-button-lg"
      />
    </div>
  </div>
</template>

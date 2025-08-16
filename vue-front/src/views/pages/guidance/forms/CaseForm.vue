<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">
          {{ isEdit ? 'Edit Guidance Case' : 'New Guidance Case' }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ isEdit ? 'Update case information' : 'Create a new guidance case for student counseling' }}
        </p>
      </div>
      <Button 
        label="Back to Cases" 
        icon="pi pi-arrow-left"
        @click="$router.push('/guidance/cases')"
        severity="secondary"
      />
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Student Information -->
      <Card>
        <template #title>Student Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="studentId" class="block text-sm font-medium mb-2">Student ID *</label>
              <InputText 
                id="studentId"
                v-model="form.studentId" 
                placeholder="Enter student ID"
                :class="{ 'p-invalid': errors.studentId }"
                required
              />
              <small v-if="errors.studentId" class="p-error">{{ errors.studentId }}</small>
            </div>
            
            <div class="field">
              <label for="studentName" class="block text-sm font-medium mb-2">Student Name *</label>
              <InputText 
                id="studentName"
                v-model="form.studentName" 
                placeholder="Enter student name"
                :class="{ 'p-invalid': errors.studentName }"
                required
              />
              <small v-if="errors.studentName" class="p-error">{{ errors.studentName }}</small>
            </div>
            
            <div class="field">
              <label for="yearLevel" class="block text-sm font-medium mb-2">Grade/Year Level</label>
              <InputText 
                id="section"
                v-model="form.yearLevel" 
                placeholder="Enter year level"
              />
            </div>
            
            <div class="field">
              <label for="section" class="block text-sm font-medium mb-2">Section</label>
              <InputText 
                id="section"
                v-model="form.section" 
                placeholder="Enter section"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Case Information -->
      <Card>
        <template #title>Case Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="category" class="block text-sm font-medium mb-2">Case Category *</label>
              <Dropdown 
                id="category"
                v-model="form.category" 
                :options="caseCategoryOptions"
                option-label="label"
                option-value="value"
                placeholder="Select case category"
                :class="{ 'p-invalid': errors.category }"
                required
              />
              <small v-if="errors.category" class="p-error">{{ errors.category }}</small>
            </div>
            
            <div class="field">
              <label for="priority" class="block text-sm font-medium mb-2">Priority Level *</label>
              <Dropdown 
                id="priority"
                v-model="form.priority" 
                :options="priorityOptions"
                option-label="label"
                option-value="value"
                placeholder="Select priority"
                :class="{ 'p-invalid': errors.priority }"
                required
              />
              <small v-if="errors.priority" class="p-error">{{ errors.priority }}</small>
            </div>

            <div class="field">
              <label for="assignedCounselorName" class="block text-sm font-medium mb-2">Assigned Counselor</label>
              <Dropdown 
                id="assignedCounselorId"
                v-model="form.assignedCounselor" 
                :options="counselorOptions"
                option-label="fullName"
                placeholder="Select assigned counselor"
                @change="() => {
                  form.assignedCounselorName = form.assignedCounselor ? form.assignedCounselor.fullName : ''
                  form.assignedCounselorId = form.assignedCounselor ? form.assignedCounselor.id : ''
            
                }"
              />
            </div>

            <div class="field">
              <label for="dateReported" class="block text-sm font-medium mb-2">Date Reported *</label>
              <Calendar 
                id="dateReported"
                v-model="form.dateReported" 
                show-icon
                date-format="mm/dd/yy"
                :class="{ 'p-invalid': errors.dateReported }"
                required
              />
              <small v-if="errors.dateReported" class="p-error">{{ errors.dateReported }}</small>
            </div>
          </div>
          
          <div class="field mt-4">
            <label for="subject" class="block text-sm font-medium mb-2">Case Subject/Title *</label>
            <InputText 
              id="subject"
              v-model="form.subject" 
              placeholder="Brief description of the case"
              :class="{ 'p-invalid': errors.subject }"
              class="w-full"
              required
            />
            <small v-if="errors.subject" class="p-error">{{ errors.subject }}</small>
          </div>
          
          <div class="field mt-4">
            <label for="description" class="block text-sm font-medium mb-2">Detailed Description *</label>
            <Textarea 
              id="description"
              v-model="form.description" 
              placeholder="Provide detailed information about the case..."
              :class="{ 'p-invalid': errors.description }"
              rows="5"
              class="w-full"
              required
            />
            <small v-if="errors.description" class="p-error">{{ errors.description }}</small>
          </div>
        </template>
      </Card>

      <!-- Additional Information -->
      <Card>
        <template #title>Additional Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="parentNotified" class="block text-sm font-medium mb-2">Parent/Guardian Notified</label>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <RadioButton 
                    id="parentNotifiedYes" 
                    v-model="form.parentNotified" 
                    name="parentNotified" 
                    value="yes" 
                  />
                  <label for="parentNotifiedYes" class="ml-2">Yes</label>
                </div>
                <div class="flex items-center">
                  <RadioButton 
                    id="parentNotifiedNo" 
                    v-model="form.parentNotified" 
                    name="parentNotified" 
                    value="no" 
                  />
                  <label for="parentNotifiedNo" class="ml-2">No</label>
                </div>
              </div>
            </div>
            
            <div class="field">
              <label for="urgentFollowUp" class="block text-sm font-medium mb-2">Requires Urgent Follow-up</label>
              <Checkbox 
                id="urgentFollowUp"
                v-model="form.urgentFollowUp" 
                binary
              />
            </div>
          </div>
          
          <div class="field mt-4">
            <label for="notes" class="block text-sm font-medium mb-2">Additional Notes</label>
            <Textarea 
              id="notes"
              v-model="form.notes" 
              placeholder="Any additional information..."
              rows="3"
              class="w-full"
            />
          </div>
        </template>
      </Card>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <Button 
          label="Cancel" 
          @click="$router.push('/guidance/cases')"
          severity="secondary"
          type="button"
        />
        <Button 
          :label="isEdit ? 'Update Case' : 'Create Case'" 
          type="submit"
          :loading="loading"
          severity="success"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import GuidanceService from '@/service/guidance';
import AccountResponse from '../../setting/types/accounts';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const guidanceService = new GuidanceService();
const accountService = new AccountResponse();

// Data
const isEdit = ref(false);
const loading = ref(false);
const errors = ref({});
const counselorOptions = ref([]);

const form = ref({
  studentId: '',
  studentName: '',
  yearLevel: '',
  section: '',
  caseType: '',
  priority: '',
  referredBy: '',
  dateReported: new Date(),
  subject: '',
  description: '',
  parentNotified: 'no',
  urgentFollowUp: false,
  notes: ''
});

// Options
const gradeOptions = ref([
  { label: 'Grade 1', value: '1' },
  { label: 'Grade 2', value: '2' },
  { label: 'Grade 3', value: '3' },
  { label: 'Grade 4', value: '4' },
  { label: 'Grade 5', value: '5' },
  { label: 'Grade 6', value: '6' },
  { label: 'Grade 7', value: '7' },
  { label: 'Grade 8', value: '8' },
  { label: 'Grade 9', value: '9' },
  { label: 'Grade 10', value: '10' },
  { label: 'Grade 11', value: '11' },
  { label: 'Grade 12', value: '12' }
]);

const caseCategoryOptions = ref([
  { label: 'Academic Concern', value: 'ACADEMIC' },
  { label: 'Behavioral Issue', value: 'BEHAVIORAL' },
  { label: 'Mental Health Support', value: 'MENTAL_HEALTH' },
  { label: 'Family/Social Issue', value: 'FAMILY_SOCIAL' },
  { label: 'Career Guidance', value: 'CAREER' },
  { label: 'Peer Relationship', value: 'PEER_RELATIONSHIP' },
  { label: 'Other', value: 'OTHER' }
]);

const priorityOptions = ref([
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' }
]);

// Methods
const validateForm = () => {
  errors.value = {};
  
  if (!form.value.studentId) {
    errors.value.studentId = 'Student ID is required';
  }
  
  if (!form.value.studentName) {
    errors.value.studentName = 'Student name is required';
  }

  if (!form.value.category) {
    errors.value.category = 'Case category is required';
  }
  
  if (!form.value.priority) {
    errors.value.priority = 'Priority level is required';
  }
  
  if (!form.value.dateReported) {
    errors.value.dateReported = 'Date reported is required';
  }
  
  if (!form.value.subject) {
    errors.value.subject = 'Case subject is required';
  }
  
  if (!form.value.description) {
    errors.value.description = 'Description is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const submitForm = () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  
  const submitData = {
    ...form.value,
    dateReported: form.value.dateReported.toISOString()
  };
  
  if (isEdit.value) {
    guidanceService.updateCase(route.params.id, submitData, (response) => {
      loading.value = false;
      if (response.success) {
        toast.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Case updated successfully',
          life: 3000
        });
        router.push('/guidance/cases');
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error || 'Failed to update case',
          life: 5000
        });
      }
    });
  } else {
    guidanceService.createCase(submitData, (response) => {
      loading.value = false;
      if (response.success) {
        toast.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Case created successfully',
          life: 3000
        });
        router.push('/guidance/cases');
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error || 'Failed to create case',
          life: 5000
        });
      }
    });
  }
};

const loadCase = () => {
  if (route.params.id) {
    isEdit.value = true;
    guidanceService.getCaseById(route.params.id, (response) => {
      if (response.success) {
        const caseData = response.data.data;
        form.value = {
          ...caseData,
          assignedCounselor: {
            id: caseData.assignedCounselorId,
            fullName: caseData.assignedCounselorName
          },
          dateReported: new Date(caseData.dateReported)
        };
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load case data',
          life: 5000
        });
        router.push('/guidance/cases');
      }
    });
  }
};

const loadCounselorsList = () => {
  accountService.getCounselorsList((response) => {
    if (response.status === "SUCCESS") {
      // Assuming response.data is an array of counselors
      counselorOptions.value = response.data.map(item => ({
        id: item.id,
        fullName: item.teacher?.fullName || null
      }));
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load counselors list',
        life: 5000
      });
    }
  });

};

// Lifecycle
onMounted(() => {
  loadCase();
  loadCounselorsList();
});
</script>

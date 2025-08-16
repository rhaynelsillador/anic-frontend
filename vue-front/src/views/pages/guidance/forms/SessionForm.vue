<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Schedule Guidance Session</h1>
        <p class="text-gray-600 mt-1">Schedule a counseling session with a student</p>
      </div>
      <Button 
        label="Back to Sessions" 
        icon="pi pi-arrow-left"
        @click="$router.push('/guidance/sessions')"
        severity="secondary"
      />
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Session Information -->
      <Card>
        <template #title>Session Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              {{ form.caseId }}
              <label for="caseId" class="block text-sm font-medium mb-2">Related Case</label>
              <Dropdown 
                id="caseId"
                v-model="form.caseId" 
                :options="caseOptions"
                option-label="label"
                option-value="value"
                placeholder="Select related case (optional)"
                filter
                @change="onCaseSelected"
              />
            </div>
            
            <div class="field">
              <label for="type" class="block text-sm font-medium mb-2">Session Type *</label>
              <Dropdown 
                id="type"
                v-model="form.sessionType" 
                :options="sessionTypeOptions"
                option-label="label"
                option-value="value"
                placeholder="Select session type"
                :class="{ 'p-invalid': errors.type }"
                required
              />
              <small v-if="errors.type" class="p-error">{{ errors.type }}</small>
            </div>
            
            <div class="field">
              <label for="sessionDate" class="block text-sm font-medium mb-2">Session Date *</label>
              <Calendar 
                id="sessionDate"
                v-model="form.sessionDate" 
                show-icon
                date-format="mm/dd/yy"
                :class="{ 'p-invalid': errors.sessionDate }"
                :min-date="new Date()"
                required
              />
              <small v-if="errors.sessionDate" class="p-error">{{ errors.sessionDate }}</small>
            </div>
            
            <div class="field">
              <label for="sessionTime" class="block text-sm font-medium mb-2">Session Time *</label>
              <Calendar 
                id="sessionTime"
                v-model="form.sessionTime" 
                time-only
                hour-format="12"
                :class="{ 'p-invalid': errors.sessionTime }"
                required
              />
              <small v-if="errors.sessionTime" class="p-error">{{ errors.sessionTime }}</small>
            </div>
            
            <div class="field">
              <label for="duration" class="block text-sm font-medium mb-2">Duration (minutes) *</label>
              <Dropdown 
                id="duration"
                v-model="form.duration" 
                :options="durationOptions"
                option-label="label"
                option-value="value"
                placeholder="Select duration"
                :class="{ 'p-invalid': errors.duration }"
                required
              />
              <small v-if="errors.duration" class="p-error">{{ errors.duration }}</small>
            </div>
            
            <div class="field">
              <label for="location" class="block text-sm font-medium mb-2">Location</label>
              <InputText 
                id="location"
                v-model="form.location" 
                placeholder="Guidance office, classroom, etc."
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Session Details -->
      <Card>
        <template #title>Session Details</template>
        <template #content>
          <div class="field">
            <label for="purpose" class="block text-sm font-medium mb-2">Session Purpose *</label>
            <InputText 
              id="purpose"
              v-model="form.purpose" 
              placeholder="Brief description of session purpose"
              :class="{ 'p-invalid': errors.purpose }"
              class="w-full"
              required
            />
            <small v-if="errors.purpose" class="p-error">{{ errors.purpose }}</small>
          </div>
          
          <div class="field mt-4">
            <label for="description" class="block text-sm font-medium mb-2">Session Description</label>
            <Textarea 
              id="description"
              v-model="form.description" 
              placeholder="Detailed description of session goals and activities..."
              rows="4"
              class="w-full"
            />
          </div>
          
          <div class="field mt-4">
            <label for="notes" class="block text-sm font-medium mb-2">Pre-session Notes</label>
            <Textarea 
              id="notes"
              v-model="form.notes" 
              placeholder="Any preparation notes or background information..."
              rows="3"
              class="w-full"
            />
          </div>
          
          <div class="field mt-4">
            <label class="block text-sm font-medium mb-2">Session Options</label>
            <div class="space-y-2">
              <div class="flex items-center">
                <Checkbox 
                  id="notifyParent"
                  v-model="form.notifyParent" 
                  binary
                />
                <label for="notifyParent" class="ml-2">Notify parent/guardian</label>
              </div>
              <div class="flex items-center">
                <Checkbox 
                  id="followUpRequired"
                  v-model="form.followUpRequired" 
                  binary
                />
                <label for="followUpRequired" class="ml-2">Follow-up session required</label>
              </div>
              <div class="flex items-center">
                <Checkbox 
                  id="priority"
                  v-model="form.priority" 
                  binary
                />
                <label for="priority" class="ml-2">High priority session</label>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <Button 
          label="Cancel" 
          @click="$router.push('/guidance/sessions')"
          severity="secondary"
          type="button"
        />
        <Button 
          label="Schedule Session" 
          type="submit"
          :loading="loading"
          icon="pi pi-calendar-plus"
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

const router = useRouter();
const toast = useToast();
const route = useRoute()

const guidanceService = new GuidanceService();

// Data
const loading = ref(false);
const errors = ref({});
const caseOptions = ref([]);
const studentFound = ref(false);

const form = ref({
  caseId: null,
  type: '',
  scheduledDate: null,
  scheduledTime: null,
  duration: 60,
  location: 'Guidance Office',
  studentNumber: '',
  studentName: '',
  grade: '',
  section: '',
  purpose: '',
  description: '',
  notes: '',
  notifyParent: false,
  followUpRequired: false,
  priority: false,
  status: 'SCHEDULED'
});

// Options
const sessionTypeOptions = ref([
  { label: 'Individual Counseling', value: 'INDIVIDUAL' },
  { label: 'Group Counseling', value: 'GROUP' },
  { label: 'Academic Support', value: 'ACADEMIC' },
  { label: 'Behavioral Intervention', value: 'BEHAVIORAL' },
  { label: 'Career Guidance', value: 'CAREER' },
  { label: 'Crisis Intervention', value: 'CRISIS' },
  { label: 'Follow-up Session', value: 'FOLLOWUP' },
  { label: 'Parent Conference', value: 'PARENT_CONFERENCE' },
  { label: 'Assessment', value: 'ASSESSMENT' },
  { label: 'Follow-up', value: 'FOLLOWUP' }
]);

const durationOptions = ref([
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '60 minutes', value: 60 },
  { label: '90 minutes', value: 90 },
  { label: '120 minutes', value: 120 }
]);

// Methods
const loadCases = () => {
  guidanceService.getCases(0, 100, (response) => {
    if (response.success) {
      caseOptions.value = response.data.data.content.map(caseItem => ({
        label: `${caseItem.caseNumber} - ${caseItem.studentName} (${caseItem.status})`,
        value: caseItem.id,
        case: caseItem
      }));

      if(route.params.id){
        form.value.caseId = route.params.id;
      }
    }
  });
};


// Methods
const loadSessionDetails = () => {
  if(route.params.sessionId){
    guidanceService.getSessionsById(route.params.sessionId, (response) => {
      if (response.success) {
        const session = response.data.data;
        form.value.caseId = session.caseId || null;
        form.value.sessionType = session.sessionType || '';
        form.value.sessionDate = new Date(session.sessionDate);
        form.value.sessionTime = new Date(session.sessionDate);
        form.value.duration = session.duration || 60;
        form.value.location = session.location || 'Guidance Office';
        form.value.purpose = session.purpose || '';
        form.value.description = session.description || '';
        form.value.notes = session.notes || '';
        form.value.notifyParent = session.notifyParent || false;
        form.value.followUpRequired = session.followUpRequired || false;
        form.value.priority = session.priority || false;
        form.value.status = session.status || 'SCHEDULED';
        
        // If caseId is set, load student info
        if (form.value.caseId) {
          onCaseSelected();
        }
      } else {
        console.error('Error loading session details:', response);
      }
    });
  }
  form.value.sessionType = route.query.type || '';
};

const onCaseSelected = () => {
  if (form.value.caseId) {
    const selectedCase = caseOptions.value.find(opt => opt.value === form.value.caseId);
    if (selectedCase) {
      form.value.studentNumber = selectedCase.case.studentNumber || '';
      form.value.studentName = selectedCase.case.studentName || '';
      form.value.grade = selectedCase.case.grade || '';
      form.value.section = selectedCase.case.section || '';
      studentFound.value = true;
    }
  } else {
    // Reset student fields
    form.value.studentNumber = '';
    form.value.studentName = '';
    form.value.grade = '';
    form.value.section = '';
    studentFound.value = false;
  }
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.sessionType) {
    errors.value.sessionType = 'Session type is required';
  }

  if (!form.value.sessionDate) {
    errors.value.sessionDate = 'Session date is required';
  }
  
  if (!form.value.sessionTime) {
    errors.value.sessionTime = 'Session time is required';
  }
  
  if (!form.value.duration) {
    errors.value.duration = 'Duration is required';
  }
  
  if (!form.value.purpose) {
    errors.value.purpose = 'Session purpose is required';
  }
  
  // If no case is selected, student info is required
  if (!form.value.caseId) {
    if (!form.value.studentNumber) {
      errors.value.studentNumber = 'Student number is required';
    }
    
    if (!form.value.studentName) {
      errors.value.studentName = 'Student name is required';
    }
  }
  
  return Object.keys(errors.value).length === 0;
};

const submitForm = () => {
  if (!validateForm()) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields',
      life: 3000
    });
    return;
  }
  
  loading.value = true;
  
  // Combine date and time
  const sessionDateTime = new Date(form.value.sessionDate);
  const timeValue = new Date(form.value.sessionTime);
  sessionDateTime.setHours(timeValue.getHours(), timeValue.getMinutes());
  
  const submitData = {
    caseId: form.value.caseId,
    sessionType: form.value.sessionType,
    sessionDate: sessionDateTime.toISOString(),
    duration: form.value.duration,
    location: form.value.location,
    purpose: form.value.purpose,
    description: form.value.description,
    notes: form.value.notes,
    status: form.value.status,
    notifyParent: form.value.notifyParent,
    followUpRequired: form.value.followUpRequired,
    priority: form.value.priority
  };
  
  // Add student info if no case selected
  if (!form.value.caseId) {
    submitData.studentNumber = form.value.studentNumber;
    submitData.studentName = form.value.studentName;
    submitData.grade = form.value.grade;
    submitData.section = form.value.section;
  }
  
  if(route.params.sessionId){
    // Update existing session
    guidanceService.updateSession(route.params.sessionId, submitData, (response) => {
      loading.value = false;
      if (response.success) {
        toast.add({
          severity: 'success',
          summary: 'Session Updated',
          detail: 'Guidance session updated successfully',
          life: 3000
        });
        router.push('/guidance/sessions');
      } else {
        console.error('Error updating session:', response);
        toast.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: response.message || 'Failed to update session',
          life: 3000
        });
      }
    });
  } else {
    // Create new session
    guidanceService.createSession(submitData, (response) => {
      loading.value = false;
      if (response.success) {
        toast.add({
          severity: 'success',
          summary: 'Session Scheduled',
          detail: 'Guidance session scheduled successfully',
          life: 3000
        });
        router.push('/guidance/sessions');
      } else {
        console.error('Error scheduling session:', response);
        toast.add({
          severity: 'error',
          summary: 'Scheduling Failed',
          detail: response.message || 'Failed to schedule session',
          life: 3000
        });
      }
    });
  }
};

// Lifecycle
onMounted(() => {
  loadCases();
  loadSessionDetails();
});
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Schedule Guidance Session</h1>
        <p class="text-gray-600 mt-1">Schedule a counseling session with a student</p>
      </div>
      
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Session Details -->
      <Card>
        <template #title>Session Details</template>
        <template #content>
          <div class="field">
            <label for="purpose" class="block text-sm font-medium mb-2">Session Purpose *</label>
            <p>{{ form.purpose }}</p>
            <small v-if="errors.purpose" class="p-error">{{ errors.purpose }}</small>
          </div>
          
          <div class="field mt-4">
            <label for="description" class="block text-sm font-medium mb-2">Session Description</label>
            <p>{{ form.description }}</p>
          </div>
          
          <div class="field mt-4">
            <label for="notes" class="block text-sm font-medium mb-2">Pre-session Notes</label>
            <p>{{ form.notes }}</p>
          </div>

          <div class="field mt-4">
            <label for="recommendedInterventions" class="block text-sm font-medium mb-2">Recommended Interventions</label>
            <Textarea 
              id="recommendedInterventions"
              v-model="form.recommendedInterventions" 
              placeholder="Any preparation notes or background information..."
              rows="3"
              class="w-full"
            />
          </div>

          <div class="field mt-4">
            <label for="studentResponse" class="block text-sm font-medium mb-2">Student Response</label>
            <Textarea 
              id="studentResponse"
              v-model="form.studentResponse" 
              placeholder="Any preparation notes or background information..."
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
          @click="$router.push('/guidance/sessions')"
          severity="secondary"
          type="button"
        />
        <Button 
          label="Complete Session" 
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

// Methods
const loadSessionDetails = () => {
  if(route.params.id){
    guidanceService.getSessionsById(route.params.id, (response) => {
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
        
      } else {
        console.error('Error loading session details:', response);
      }
    });
  }
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.recommendedInterventions) {
    errors.value.recommendedInterventions = 'Recommended interventions are required';
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
  
  const submitData = {
    recommendedInterventions: form.value.recommendedInterventions,
    studentResponse: form.value.studentResponse
  };

  // Complete session
  guidanceService.completeSession(route.params.id, submitData, (response) => {
    loading.value = false;
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Session Completed',
        detail: 'Guidance session completed successfully',
        life: 3000
      });
      router.push('/guidance/sessions');
    } else {
      console.error('Error completing session:', response);
      toast.add({
        severity: 'error',
        summary: 'Completion Failed',
        detail: response.message || 'Failed to complete session',
        life: 3000
      });
    }
  })
};

// Lifecycle
onMounted(() => {
  loadSessionDetails();
});
</script>

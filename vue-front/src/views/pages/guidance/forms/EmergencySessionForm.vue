<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-red-600">Emergency Session</h1>
        <p class="text-gray-600 mt-1">Schedule an immediate emergency counseling session</p>
      </div>
      <Button 
        label="Back to Sessions" 
        icon="pi pi-arrow-left"
        @click="$router.push('/guidance/sessions')"
        severity="secondary"
      />
    </div>

    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-500 text-xl mr-3"></i>
        <div>
          <h3 class="text-red-800 font-medium">Emergency Session Notice</h3>
          <p class="text-red-700 text-sm mt-1">
            This form is for urgent situations requiring immediate intervention. 
            For life-threatening emergencies, contact emergency services immediately.
          </p>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Emergency Information -->
      <Card>
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-exclamation-circle text-red-500 mr-2"></i>
            Emergency Information
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="urgencyLevel" class="block text-sm font-medium mb-2">Urgency Level *</label>
              <Dropdown 
                id="urgencyLevel"
                v-model="form.urgencyLevel" 
                :options="urgencyOptions"
                option-label="label"
                option-value="value"
                placeholder="Select urgency level"
                :class="{ 'p-invalid': errors.urgencyLevel }"
                required
              />
              <small v-if="errors.urgencyLevel" class="p-error">{{ errors.urgencyLevel }}</small>
            </div>
            
            <div class="field">
              <label for="emergencyType" class="block text-sm font-medium mb-2">Emergency Type *</label>
              <Dropdown 
                id="emergencyType"
                v-model="form.emergencyType" 
                :options="emergencyTypeOptions"
                option-label="label"
                option-value="value"
                placeholder="Select emergency type"
                :class="{ 'p-invalid': errors.emergencyType }"
                required
              />
              <small v-if="errors.emergencyType" class="p-error">{{ errors.emergencyType }}</small>
            </div>
            
            <div class="field">
              <label for="reportedBy" class="block text-sm font-medium mb-2">Reported By *</label>
              <InputText 
                id="reportedBy"
                v-model="form.reportedBy" 
                placeholder="Name of person reporting"
                :class="{ 'p-invalid': errors.reportedBy }"
                required
              />
              <small v-if="errors.reportedBy" class="p-error">{{ errors.reportedBy }}</small>
            </div>
            
            <div class="field">
              <label for="reporterRole" class="block text-sm font-medium mb-2">Reporter Role</label>
              <Dropdown 
                id="reporterRole"
                v-model="form.reporterRole" 
                :options="reporterRoleOptions"
                option-label="label"
                option-value="value"
                placeholder="Select role"
              />
            </div>
          </div>
        </template>
      </Card>

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
              <label for="currentLocation" class="block text-sm font-medium mb-2">Current Location *</label>
              <InputText 
                id="currentLocation"
                v-model="form.currentLocation" 
                placeholder="Where is the student now?"
                :class="{ 'p-invalid': errors.currentLocation }"
                required
              />
              <small v-if="errors.currentLocation" class="p-error">{{ errors.currentLocation }}</small>
            </div>
            
            <div class="field">
              <label for="studentCondition" class="block text-sm font-medium mb-2">Student Condition</label>
              <Dropdown 
                id="studentCondition"
                v-model="form.studentCondition" 
                :options="conditionOptions"
                option-label="label"
                option-value="value"
                placeholder="Select current condition"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Incident Details -->
      <Card>
        <template #title>Incident Details</template>
        <template #content>
          <div class="field">
            <label for="incidentDescription" class="block text-sm font-medium mb-2">What Happened? *</label>
            <Textarea 
              id="incidentDescription"
              v-model="form.incidentDescription" 
              placeholder="Describe the incident in detail..."
              :class="{ 'p-invalid': errors.incidentDescription }"
              rows="4"
              class="w-full"
              required
            />
            <small v-if="errors.incidentDescription" class="p-error">{{ errors.incidentDescription }}</small>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="field">
              <label for="witnessesPresent" class="block text-sm font-medium mb-2">Witnesses Present</label>
              <InputText 
                id="witnessesPresent"
                v-model="form.witnessesPresent" 
                placeholder="Names of witnesses (if any)"
              />
            </div>
            
            <div class="field">
              <label for="immediateActions" class="block text-sm font-medium mb-2">Immediate Actions Taken</label>
              <InputText 
                id="immediateActions"
                v-model="form.immediateActions" 
                placeholder="What was done immediately?"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Safety and Notifications -->
      <Card>
        <template #title>Safety and Notifications</template>
        <template #content>
          <div class="space-y-4">
            <div class="field">
              <label class="block text-sm font-medium mb-2">Safety Concerns</label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <Checkbox 
                    id="selfHarm"
                    v-model="form.selfHarm" 
                    binary
                  />
                  <label for="selfHarm" class="ml-2">Risk of self-harm</label>
                </div>
                <div class="flex items-center">
                  <Checkbox 
                    id="harmToOthers"
                    v-model="form.harmToOthers" 
                    binary
                  />
                  <label for="harmToOthers" class="ml-2">Risk of harm to others</label>
                </div>
                <div class="flex items-center">
                  <Checkbox 
                    id="substanceUse"
                    v-model="form.substanceUse" 
                    binary
                  />
                  <label for="substanceUse" class="ml-2">Substance use involved</label>
                </div>
                <div class="flex items-center">
                  <Checkbox 
                    id="medicalAttention"
                    v-model="form.medicalAttention" 
                    binary
                  />
                  <label for="medicalAttention" class="ml-2">Medical attention needed</label>
                </div>
              </div>
            </div>
            
            <div class="field">
              <label class="block text-sm font-medium mb-2">Notifications</label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <Checkbox 
                    id="notifyParents"
                    v-model="form.notifyParents" 
                    binary
                  />
                  <label for="notifyParents" class="ml-2">Notify parents/guardians immediately</label>
                </div>
                <div class="flex items-center">
                  <Checkbox 
                    id="notifyAdmin"
                    v-model="form.notifyAdmin" 
                    binary
                  />
                  <label for="notifyAdmin" class="ml-2">Notify school administration</label>
                </div>
                <div class="flex items-center">
                  <Checkbox 
                    id="notifyAuthorities"
                    v-model="form.notifyAuthorities" 
                    binary
                  />
                  <label for="notifyAuthorities" class="ml-2">Notify authorities (if required)</label>
                </div>
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
          label="Create Emergency Session" 
          type="submit"
          :loading="loading"
          severity="danger"
          icon="pi pi-exclamation-triangle"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import GuidanceService from '@/service/guidance';

const router = useRouter();
const toast = useToast();
const guidanceService = new GuidanceService();

// Data
const loading = ref(false);
const errors = ref({});

const form = ref({
  urgencyLevel: '',
  emergencyType: '',
  reportedBy: '',
  reporterRole: '',
  studentId: '',
  studentName: '',
  currentLocation: '',
  studentCondition: '',
  incidentDescription: '',
  witnessesPresent: '',
  immediateActions: '',
  selfHarm: false,
  harmToOthers: false,
  substanceUse: false,
  medicalAttention: false,
  notifyParents: true,
  notifyAdmin: true,
  notifyAuthorities: false
});

// Options
const urgencyOptions = ref([
  { label: 'Critical - Immediate Danger', value: 'CRITICAL' },
  { label: 'High - Urgent Response Needed', value: 'HIGH' },
  { label: 'Medium - Prompt Response', value: 'MEDIUM' }
]);

const emergencyTypeOptions = ref([
  { label: 'Mental Health Crisis', value: 'MENTAL_HEALTH_CRISIS' },
  { label: 'Suicidal Ideation', value: 'SUICIDAL_IDEATION' },
  { label: 'Violence/Aggression', value: 'VIOLENCE_AGGRESSION' },
  { label: 'Substance Abuse', value: 'SUBSTANCE_ABUSE' },
  { label: 'Domestic Violence', value: 'DOMESTIC_VIOLENCE' },
  { label: 'Sexual Assault', value: 'SEXUAL_ASSAULT' },
  { label: 'Severe Emotional Distress', value: 'EMOTIONAL_DISTRESS' },
  { label: 'Other Emergency', value: 'OTHER' }
]);

const reporterRoleOptions = ref([
  { label: 'Teacher', value: 'TEACHER' },
  { label: 'Administrator', value: 'ADMINISTRATOR' },
  { label: 'Staff Member', value: 'STAFF' },
  { label: 'Student', value: 'STUDENT' },
  { label: 'Parent/Guardian', value: 'PARENT' },
  { label: 'Other', value: 'OTHER' }
]);

const conditionOptions = ref([
  { label: 'Calm/Stable', value: 'STABLE' },
  { label: 'Agitated', value: 'AGITATED' },
  { label: 'Distressed', value: 'DISTRESSED' },
  { label: 'Confused', value: 'CONFUSED' },
  { label: 'Unresponsive', value: 'UNRESPONSIVE' },
  { label: 'Combative', value: 'COMBATIVE' }
]);

// Methods
const validateForm = () => {
  errors.value = {};
  
  if (!form.value.urgencyLevel) {
    errors.value.urgencyLevel = 'Urgency level is required';
  }
  
  if (!form.value.emergencyType) {
    errors.value.emergencyType = 'Emergency type is required';
  }
  
  if (!form.value.reportedBy) {
    errors.value.reportedBy = 'Reporter name is required';
  }
  
  if (!form.value.studentId) {
    errors.value.studentId = 'Student ID is required';
  }
  
  if (!form.value.studentName) {
    errors.value.studentName = 'Student name is required';
  }
  
  if (!form.value.currentLocation) {
    errors.value.currentLocation = 'Current location is required';
  }
  
  if (!form.value.incidentDescription) {
    errors.value.incidentDescription = 'Incident description is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const submitForm = () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  
  const submitData = {
    sessionType: 'CRISIS_INTERVENTION',
    sessionDate: new Date().toISOString(),
    duration: 60,
    location: form.value.currentLocation,
    studentId: form.value.studentId,
    studentName: form.value.studentName,
    purpose: `Emergency Session - ${form.value.emergencyType}`,
    notes: form.value.incidentDescription,
    parentNotification: form.value.notifyParents,
    followUpRequired: true,
    // Emergency specific fields
    isEmergency: true,
    urgencyLevel: form.value.urgencyLevel,
    emergencyType: form.value.emergencyType,
    reportedBy: form.value.reportedBy,
    reporterRole: form.value.reporterRole,
    studentCondition: form.value.studentCondition,
    witnessesPresent: form.value.witnessesPresent,
    immediateActions: form.value.immediateActions,
    safetyFlags: {
      selfHarm: form.value.selfHarm,
      harmToOthers: form.value.harmToOthers,
      substanceUse: form.value.substanceUse,
      medicalAttention: form.value.medicalAttention
    },
    notifications: {
      parents: form.value.notifyParents,
      administration: form.value.notifyAdmin,
      authorities: form.value.notifyAuthorities
    }
  };
  
  guidanceService.createSession(submitData, (response) => {
    loading.value = false;
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Emergency Session Created',
        detail: 'Emergency session has been created and notifications sent',
        life: 5000
      });
      router.push('/guidance/sessions');
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.error || 'Failed to create emergency session',
        life: 5000
      });
    }
  });
};
</script>

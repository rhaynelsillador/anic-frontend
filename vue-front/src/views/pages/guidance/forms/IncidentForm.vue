<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Report Incident</h1>
        <p class="text-gray-600 mt-1">Document and report a student incident</p>
      </div>
      <Button 
        label="Back to Incidents" 
        icon="pi pi-arrow-left"
        @click="$router.push('/guidance/incidents')"
        severity="secondary"
      />
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Incident Information -->
      <Card>
        <template #title>Incident Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="incidentDate" class="block text-sm font-medium mb-2">Incident Date *</label>
              <Calendar 
                id="incidentDate"
                v-model="form.incidentDate" 
                show-icon
                date-format="mm/dd/yy"
                :class="{ 'p-invalid': errors.incidentDate }"
                :max-date="new Date()"
                required
              />
              <small v-if="errors.incidentDate" class="p-error">{{ errors.incidentDate }}</small>
            </div>
            
            <div class="field">
              <label for="incidentTime" class="block text-sm font-medium mb-2">Incident Time</label>
              <Calendar 
                id="incidentTime"
                v-model="form.incidentTime" 
                time-only
                hour-format="12"
              />
            </div>
            
            <div class="field">
              <label for="location" class="block text-sm font-medium mb-2">Location *</label>
              <InputText 
                id="location"
                v-model="form.location" 
                placeholder="Where did the incident occur?"
                :class="{ 'p-invalid': errors.location }"
                required
              />
              <small v-if="errors.location" class="p-error">{{ errors.location }}</small>
            </div>
            
            <div class="field">
              <label for="incidentType" class="block text-sm font-medium mb-2">Incident Type *</label>
              <Dropdown 
                id="incidentType"
                v-model="form.incidentType" 
                :options="incidentTypeOptions"
                option-label="label"
                option-value="value"
                placeholder="Select incident type"
                :class="{ 'p-invalid': errors.incidentType }"
                required
              />
              <small v-if="errors.incidentType" class="p-error">{{ errors.incidentType }}</small>
            </div>
            
            <div class="field">
              <label for="severity" class="block text-sm font-medium mb-2">Severity Level *</label>
              <Dropdown 
                id="severity"
                v-model="form.severity" 
                :options="severityOptions"
                option-label="label"
                option-value="value"
                placeholder="Select severity"
                :class="{ 'p-invalid': errors.severity }"
                required
              />
              <small v-if="errors.severity" class="p-error">{{ errors.severity }}</small>
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
          </div>
        </template>
      </Card>

      <!-- Student Information -->
      <Card>
        <template #title>Student(s) Involved</template>
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
              <label for="additionalStudents" class="block text-sm font-medium mb-2">Other Students Involved</label>
              <Textarea 
                id="additionalStudents"
                v-model="form.additionalStudents" 
                placeholder="Names/IDs of other students involved (if any)"
                rows="2"
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="witnesses" class="block text-sm font-medium mb-2">Witnesses</label>
              <Textarea 
                id="witnesses"
                v-model="form.witnesses" 
                placeholder="Names of witnesses to the incident"
                rows="2"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Incident Details -->
      <Card>
        <template #title>Incident Description</template>
        <template #content>
          <div class="field">
            <label for="description" class="block text-sm font-medium mb-2">What Happened? *</label>
            <Textarea 
              id="description"
              v-model="form.description" 
              placeholder="Provide a detailed description of the incident..."
              :class="{ 'p-invalid': errors.description }"
              rows="5"
              class="w-full"
              required
            />
            <small v-if="errors.description" class="p-error">{{ errors.description }}</small>
          </div>
          
          <div class="field mt-4">
            <label for="antecedent" class="block text-sm font-medium mb-2">What Led to the Incident?</label>
            <Textarea 
              id="antecedent"
              v-model="form.antecedent" 
              placeholder="Describe what happened before the incident..."
              rows="3"
              class="w-full"
            />
          </div>
          
          <div class="field mt-4">
            <label for="immediateActions" class="block text-sm font-medium mb-2">Immediate Actions Taken</label>
            <Textarea 
              id="immediateActions"
              v-model="form.immediateActions" 
              placeholder="What was done immediately after the incident?"
              rows="3"
              class="w-full"
            />
          </div>
        </template>
      </Card>

      <!-- Consequences and Follow-up -->
      <Card>
        <template #title>Consequences and Follow-up</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="disciplinaryAction" class="block text-sm font-medium mb-2">Disciplinary Action</label>
              <Dropdown 
                id="disciplinaryAction"
                v-model="form.disciplinaryAction" 
                :options="disciplinaryOptions"
                option-label="label"
                option-value="value"
                placeholder="Select action taken"
              />
            </div>
            
            <div class="field">
              <label for="followUpRequired" class="block text-sm font-medium mb-2">Follow-up Required</label>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <RadioButton 
                    id="followUpYes" 
                    v-model="form.followUpRequired" 
                    name="followUpRequired" 
                    value="yes" 
                  />
                  <label for="followUpYes" class="ml-2">Yes</label>
                </div>
                <div class="flex items-center">
                  <RadioButton 
                    id="followUpNo" 
                    v-model="form.followUpRequired" 
                    name="followUpRequired" 
                    value="no" 
                  />
                  <label for="followUpNo" class="ml-2">No</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="field mt-4">
            <label for="parentNotification" class="block text-sm font-medium mb-2">Parent/Guardian Notification</label>
            <div class="space-y-2">
              <div class="flex items-center">
                <Checkbox 
                  id="parentCalled"
                  v-model="form.parentCalled" 
                  binary
                />
                <label for="parentCalled" class="ml-2">Parent/Guardian called</label>
              </div>
              <div class="flex items-center">
                <Checkbox 
                  id="parentMeeting"
                  v-model="form.parentMeeting" 
                  binary
                />
                <label for="parentMeeting" class="ml-2">Parent meeting scheduled</label>
              </div>
              <div class="flex items-center">
                <Checkbox 
                  id="writtenNotice"
                  v-model="form.writtenNotice" 
                  binary
                />
                <label for="writtenNotice" class="ml-2">Written notice sent home</label>
              </div>
            </div>
          </div>
          
          <div class="field mt-4">
            <label for="additionalNotes" class="block text-sm font-medium mb-2">Additional Notes</label>
            <Textarea 
              id="additionalNotes"
              v-model="form.additionalNotes" 
              placeholder="Any additional information or recommendations..."
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
          @click="$router.push('/guidance/incidents')"
          severity="secondary"
          type="button"
        />
        <Button 
          label="Submit Report" 
          type="submit"
          :loading="loading"
          severity="warning"
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
  incidentDate: new Date(),
  incidentTime: null,
  location: '',
  incidentType: '',
  severity: '',
  reportedBy: '',
  studentId: '',
  studentName: '',
  additionalStudents: '',
  witnesses: '',
  description: '',
  antecedent: '',
  immediateActions: '',
  disciplinaryAction: '',
  followUpRequired: 'no',
  parentCalled: false,
  parentMeeting: false,
  writtenNotice: false,
  additionalNotes: ''
});

// Options
const incidentTypeOptions = ref([
  { label: 'Physical Aggression', value: 'PHYSICAL_AGGRESSION' },
  { label: 'Verbal Aggression', value: 'VERBAL_AGGRESSION' },
  { label: 'Bullying', value: 'BULLYING' },
  { label: 'Disruptive Behavior', value: 'DISRUPTIVE_BEHAVIOR' },
  { label: 'Defiance/Disrespect', value: 'DEFIANCE' },
  { label: 'Property Damage', value: 'PROPERTY_DAMAGE' },
  { label: 'Substance Use', value: 'SUBSTANCE_USE' },
  { label: 'Truancy/Tardiness', value: 'TRUANCY' },
  { label: 'Academic Dishonesty', value: 'ACADEMIC_DISHONESTY' },
  { label: 'Technology Misuse', value: 'TECHNOLOGY_MISUSE' },
  { label: 'Safety Violation', value: 'SAFETY_VIOLATION' },
  { label: 'Other', value: 'OTHER' }
]);

const severityOptions = ref([
  { label: 'Minor', value: 'MINOR' },
  { label: 'Major', value: 'MAJOR' },
  { label: 'Critical', value: 'CRITICAL' }
]);

const disciplinaryOptions = ref([
  { label: 'Verbal Warning', value: 'VERBAL_WARNING' },
  { label: 'Written Warning', value: 'WRITTEN_WARNING' },
  { label: 'Detention', value: 'DETENTION' },
  { label: 'In-School Suspension', value: 'IN_SCHOOL_SUSPENSION' },
  { label: 'Out-of-School Suspension', value: 'OUT_OF_SCHOOL_SUSPENSION' },
  { label: 'Parent Conference', value: 'PARENT_CONFERENCE' },
  { label: 'Counseling Required', value: 'COUNSELING_REQUIRED' },
  { label: 'Behavior Plan', value: 'BEHAVIOR_PLAN' },
  { label: 'Restitution', value: 'RESTITUTION' },
  { label: 'No Action', value: 'NO_ACTION' },
  { label: 'Other', value: 'OTHER' }
]);

// Methods
const validateForm = () => {
  errors.value = {};
  
  if (!form.value.incidentDate) {
    errors.value.incidentDate = 'Incident date is required';
  }
  
  if (!form.value.location) {
    errors.value.location = 'Location is required';
  }
  
  if (!form.value.incidentType) {
    errors.value.incidentType = 'Incident type is required';
  }
  
  if (!form.value.severity) {
    errors.value.severity = 'Severity level is required';
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
  
  if (!form.value.description) {
    errors.value.description = 'Incident description is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const submitForm = () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  
  // Combine date and time if time is provided
  let incidentDateTime = new Date(form.value.incidentDate);
  if (form.value.incidentTime) {
    const timeValue = new Date(form.value.incidentTime);
    incidentDateTime.setHours(timeValue.getHours(), timeValue.getMinutes());
  }
  
  const submitData = {
    ...form.value,
    incidentDate: incidentDateTime.toISOString(),
    // Remove time field as it's now combined with date
    incidentTime: undefined,
    // Combine parent notification flags
    parentNotified: form.value.parentCalled || form.value.parentMeeting || form.value.writtenNotice
  };
  
  guidanceService.createIncident(submitData, (response) => {
    loading.value = false;
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Report Submitted',
        detail: 'Incident report has been submitted successfully',
        life: 3000
      });
      router.push('/guidance/incidents');
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.error || 'Failed to submit incident report',
        life: 5000
      });
    }
  });
};
</script>

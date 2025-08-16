<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Parent Contact</h1>
        <p class="text-gray-600 mt-1">Document communication with parent/guardian</p>
      </div>
      <Button 
        label="Back to Contacts" 
        icon="pi pi-arrow-left"
        @click="$router.push('/guidance/parent-contacts')"
        severity="secondary"
      />
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Contact Information -->
      <Card>
        <template #title>Contact Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="contactDate" class="block text-sm font-medium mb-2">Contact Date *</label>
              <Calendar 
                id="contactDate"
                v-model="form.contactDate" 
                show-icon
                date-format="mm/dd/yy"
                :class="{ 'p-invalid': errors.contactDate }"
                :max-date="new Date()"
                required
              />
              <small v-if="errors.contactDate" class="p-error">{{ errors.contactDate }}</small>
            </div>
            
            <div class="field">
              <label for="contactTime" class="block text-sm font-medium mb-2">Contact Time</label>
              <Calendar 
                id="contactTime"
                v-model="form.contactTime" 
                time-only
                hour-format="12"
              />
            </div>
            
            <div class="field">
              <label for="contactMethod" class="block text-sm font-medium mb-2">Contact Method *</label>
              <Dropdown 
                id="contactMethod"
                v-model="form.contactMethod" 
                :options="contactMethodOptions"
                option-label="label"
                option-value="value"
                placeholder="Select contact method"
                :class="{ 'p-invalid': errors.contactMethod }"
                required
              />
              <small v-if="errors.contactMethod" class="p-error">{{ errors.contactMethod }}</small>
            </div>
            
            <div class="field">
              <label for="contactType" class="block text-sm font-medium mb-2">Contact Type *</label>
              <Dropdown 
                id="contactType"
                v-model="form.contactType" 
                :options="contactTypeOptions"
                option-label="label"
                option-value="value"
                placeholder="Select contact type"
                :class="{ 'p-invalid': errors.contactType }"
                required
              />
              <small v-if="errors.contactType" class="p-error">{{ errors.contactType }}</small>
            </div>
            
            <div class="field">
              <label for="initiatedBy" class="block text-sm font-medium mb-2">Initiated By *</label>
              <Dropdown 
                id="initiatedBy"
                v-model="form.initiatedBy" 
                :options="initiatedByOptions"
                option-label="label"
                option-value="value"
                placeholder="Who initiated contact?"
                :class="{ 'p-invalid': errors.initiatedBy }"
                required
              />
              <small v-if="errors.initiatedBy" class="p-error">{{ errors.initiatedBy }}</small>
            </div>
            
            <div class="field">
              <label for="duration" class="block text-sm font-medium mb-2">Duration (minutes)</label>
              <InputNumber 
                id="duration"
                v-model="form.duration" 
                placeholder="Contact duration"
                :min="1"
                :max="480"
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
              <label for="relatedCaseId" class="block text-sm font-medium mb-2">Related Case</label>
              <Dropdown 
                id="relatedCaseId"
                v-model="form.relatedCaseId" 
                :options="caseOptions"
                option-label="label"
                option-value="value"
                placeholder="Select related case (optional)"
                filter
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Parent/Guardian Information -->
      <Card>
        <template #title>Parent/Guardian Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="parentName" class="block text-sm font-medium mb-2">Parent/Guardian Name *</label>
              <InputText 
                id="parentName"
                v-model="form.parentName" 
                placeholder="Enter parent/guardian name"
                :class="{ 'p-invalid': errors.parentName }"
                required
              />
              <small v-if="errors.parentName" class="p-error">{{ errors.parentName }}</small>
            </div>
            
            <div class="field">
              <label for="parentRelationship" class="block text-sm font-medium mb-2">Relationship to Student</label>
              <Dropdown 
                id="parentRelationship"
                v-model="form.parentRelationship" 
                :options="relationshipOptions"
                option-label="label"
                option-value="value"
                placeholder="Select relationship"
              />
            </div>
            
            <div class="field">
              <label for="parentPhone" class="block text-sm font-medium mb-2">Phone Number</label>
              <InputText 
                id="parentPhone"
                v-model="form.parentPhone" 
                placeholder="Parent phone number"
              />
            </div>
            
            <div class="field">
              <label for="parentEmail" class="block text-sm font-medium mb-2">Email Address</label>
              <InputText 
                id="parentEmail"
                v-model="form.parentEmail" 
                placeholder="Parent email address"
                type="email"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Contact Details -->
      <Card>
        <template #title>Contact Details</template>
        <template #content>
          <div class="field">
            <label for="purpose" class="block text-sm font-medium mb-2">Purpose of Contact *</label>
            <InputText 
              id="purpose"
              v-model="form.purpose" 
              placeholder="Brief description of contact purpose"
              :class="{ 'p-invalid': errors.purpose }"
              class="w-full"
              required
            />
            <small v-if="errors.purpose" class="p-error">{{ errors.purpose }}</small>
          </div>
          
          <div class="field mt-4">
            <label for="discussionPoints" class="block text-sm font-medium mb-2">Discussion Points *</label>
            <Textarea 
              id="discussionPoints"
              v-model="form.discussionPoints" 
              placeholder="What was discussed during the contact?"
              :class="{ 'p-invalid': errors.discussionPoints }"
              rows="4"
              class="w-full"
              required
            />
            <small v-if="errors.discussionPoints" class="p-error">{{ errors.discussionPoints }}</small>
          </div>
          
          <div class="field mt-4">
            <label for="parentResponse" class="block text-sm font-medium mb-2">Parent Response</label>
            <Textarea 
              id="parentResponse"
              v-model="form.parentResponse" 
              placeholder="How did the parent/guardian respond?"
              rows="3"
              class="w-full"
            />
          </div>
          
          <div class="field mt-4">
            <label for="actionPlan" class="block text-sm font-medium mb-2">Action Plan/Agreements</label>
            <Textarea 
              id="actionPlan"
              v-model="form.actionPlan" 
              placeholder="What actions were agreed upon?"
              rows="3"
              class="w-full"
            />
          </div>
        </template>
      </Card>

      <!-- Follow-up -->
      <Card>
        <template #title>Follow-up</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div class="field" v-if="form.followUpRequired === 'yes'">
              <label for="followUpDate" class="block text-sm font-medium mb-2">Follow-up Date</label>
              <Calendar 
                id="followUpDate"
                v-model="form.followUpDate" 
                show-icon
                date-format="mm/dd/yy"
                :min-date="new Date()"
              />
            </div>
          </div>
          
          <div class="field mt-4" v-if="form.followUpRequired === 'yes'">
            <label for="followUpNotes" class="block text-sm font-medium mb-2">Follow-up Notes</label>
            <Textarea 
              id="followUpNotes"
              v-model="form.followUpNotes" 
              placeholder="Notes about follow-up requirements..."
              rows="3"
              class="w-full"
            />
          </div>
          
          <div class="field mt-4">
            <label class="block text-sm font-medium mb-2">Contact Outcome</label>
            <div class="space-y-2">
              <div class="flex items-center">
                <Checkbox 
                  id="parentCooperative"
                  v-model="form.parentCooperative" 
                  binary
                />
                <label for="parentCooperative" class="ml-2">Parent was cooperative</label>
              </div>
              <div class="flex items-center">
                <Checkbox 
                  id="concernsResolved"
                  v-model="form.concernsResolved" 
                  binary
                />
                <label for="concernsResolved" class="ml-2">Concerns were resolved</label>
              </div>
              <div class="flex items-center">
                <Checkbox 
                  id="additionalSupportNeeded"
                  v-model="form.additionalSupportNeeded" 
                  binary
                />
                <label for="additionalSupportNeeded" class="ml-2">Additional support needed</label>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <Button 
          label="Cancel" 
          @click="$router.push('/guidance/parent-contacts')"
          severity="secondary"
          type="button"
        />
        <Button 
          label="Save Contact" 
          type="submit"
          :loading="loading"
          severity="info"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import GuidanceService from '@/service/guidance';

const router = useRouter();
const toast = useToast();
const guidanceService = new GuidanceService();

// Data
const loading = ref(false);
const errors = ref({});
const caseOptions = ref([]);

const form = ref({
  contactDate: new Date(),
  contactTime: null,
  contactMethod: '',
  contactType: '',
  initiatedBy: '',
  duration: 30,
  studentId: '',
  studentName: '',
  relatedCaseId: null,
  parentName: '',
  parentRelationship: '',
  parentPhone: '',
  parentEmail: '',
  purpose: '',
  discussionPoints: '',
  parentResponse: '',
  actionPlan: '',
  followUpRequired: 'no',
  followUpDate: null,
  followUpNotes: '',
  parentCooperative: true,
  concernsResolved: false,
  additionalSupportNeeded: false
});

// Options
const contactMethodOptions = ref([
  { label: 'Phone Call', value: 'PHONE_CALL' },
  { label: 'Email', value: 'EMAIL' },
  { label: 'In-Person Meeting', value: 'IN_PERSON' },
  { label: 'Video Conference', value: 'VIDEO_CONFERENCE' },
  { label: 'Text Message', value: 'TEXT_MESSAGE' },
  { label: 'Letter/Note', value: 'LETTER' }
]);

const contactTypeOptions = ref([
  { label: 'Academic Concern', value: 'ACADEMIC_CONCERN' },
  { label: 'Behavioral Issue', value: 'BEHAVIORAL_ISSUE' },
  { label: 'Attendance Issue', value: 'ATTENDANCE_ISSUE' },
  { label: 'Progress Update', value: 'PROGRESS_UPDATE' },
  { label: 'Disciplinary Matter', value: 'DISCIPLINARY_MATTER' },
  { label: 'Health/Medical Issue', value: 'HEALTH_MEDICAL' },
  { label: 'Social/Emotional Support', value: 'SOCIAL_EMOTIONAL' },
  { label: 'Parent Request', value: 'PARENT_REQUEST' },
  { label: 'Follow-up', value: 'FOLLOW_UP' },
  { label: 'Other', value: 'OTHER' }
]);

const initiatedByOptions = ref([
  { label: 'School/Counselor', value: 'SCHOOL' },
  { label: 'Parent/Guardian', value: 'PARENT' },
  { label: 'Student', value: 'STUDENT' },
  { label: 'Teacher', value: 'TEACHER' },
  { label: 'Administrator', value: 'ADMINISTRATOR' }
]);

const relationshipOptions = ref([
  { label: 'Mother', value: 'MOTHER' },
  { label: 'Father', value: 'FATHER' },
  { label: 'Guardian', value: 'GUARDIAN' },
  { label: 'Grandmother', value: 'GRANDMOTHER' },
  { label: 'Grandfather', value: 'GRANDFATHER' },
  { label: 'Aunt', value: 'AUNT' },
  { label: 'Uncle', value: 'UNCLE' },
  { label: 'Sibling', value: 'SIBLING' },
  { label: 'Foster Parent', value: 'FOSTER_PARENT' },
  { label: 'Other Relative', value: 'OTHER_RELATIVE' },
  { label: 'Other', value: 'OTHER' }
]);

// Methods
const loadCases = () => {
  guidanceService.getCases(0, 100, (response) => {
    if (response.success) {
      caseOptions.value = response.data.content.map(caseItem => ({
        label: `${caseItem.caseNumber} - ${caseItem.studentName}`,
        value: caseItem.id,
        case: caseItem
      }));
    }
  });
};

const validateForm = () => {
  errors.value = {};
  
  if (!form.value.contactDate) {
    errors.value.contactDate = 'Contact date is required';
  }
  
  if (!form.value.contactMethod) {
    errors.value.contactMethod = 'Contact method is required';
  }
  
  if (!form.value.contactType) {
    errors.value.contactType = 'Contact type is required';
  }
  
  if (!form.value.initiatedBy) {
    errors.value.initiatedBy = 'Initiated by is required';
  }
  
  if (!form.value.studentId) {
    errors.value.studentId = 'Student ID is required';
  }
  
  if (!form.value.studentName) {
    errors.value.studentName = 'Student name is required';
  }
  
  if (!form.value.parentName) {
    errors.value.parentName = 'Parent/guardian name is required';
  }
  
  if (!form.value.purpose) {
    errors.value.purpose = 'Purpose of contact is required';
  }
  
  if (!form.value.discussionPoints) {
    errors.value.discussionPoints = 'Discussion points are required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const submitForm = () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  
  // Combine date and time if time is provided
  let contactDateTime = new Date(form.value.contactDate);
  if (form.value.contactTime) {
    const timeValue = new Date(form.value.contactTime);
    contactDateTime.setHours(timeValue.getHours(), timeValue.getMinutes());
  }
  
  const submitData = {
    ...form.value,
    contactDate: contactDateTime.toISOString(),
    followUpDate: form.value.followUpDate ? form.value.followUpDate.toISOString() : null,
    // Remove time field as it's now combined with date
    contactTime: undefined
  };
  
  guidanceService.createParentContact(submitData, (response) => {
    loading.value = false;
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Contact Saved',
        detail: 'Parent contact has been documented successfully',
        life: 3000
      });
      router.push('/guidance/parent-contacts');
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.error || 'Failed to save parent contact',
        life: 5000
      });
    }
  });
};

// Lifecycle
onMounted(() => {
  loadCases();
});
</script>

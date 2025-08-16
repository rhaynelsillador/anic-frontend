<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Intervention Plan</h1>
        <p class="text-gray-600 mt-1">Create a new intervention plan for student support</p>
      </div>
      <Button 
        label="Back to Interventions" 
        icon="pi pi-arrow-left"
        @click="$router.push('/guidance/interventions')"
        severity="secondary"
      />
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Plan Information -->
      <Card>
        <template #title>Intervention Plan Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="planTitle" class="block text-sm font-medium mb-2">Plan Title *</label>
              <InputText 
                id="planTitle"
                v-model="form.planTitle" 
                placeholder="Enter intervention plan title"
                :class="{ 'p-invalid': errors.planTitle }"
                required
              />
              <small v-if="errors.planTitle" class="p-error">{{ errors.planTitle }}</small>
            </div>
            
            <div class="field">
              <label for="interventionType" class="block text-sm font-medium mb-2">Intervention Type *</label>
              <Dropdown 
                id="interventionType"
                v-model="form.interventionType" 
                :options="interventionTypeOptions"
                option-label="label"
                option-value="value"
                placeholder="Select intervention type"
                :class="{ 'p-invalid': errors.interventionType }"
                required
              />
              <small v-if="errors.interventionType" class="p-error">{{ errors.interventionType }}</small>
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
              <label for="tier" class="block text-sm font-medium mb-2">Intervention Tier</label>
              <Dropdown 
                id="tier"
                v-model="form.tier" 
                :options="tierOptions"
                option-label="label"
                option-value="value"
                placeholder="Select tier"
              />
            </div>
            
            <div class="field">
              <label for="startDate" class="block text-sm font-medium mb-2">Start Date *</label>
              <Calendar 
                id="startDate"
                v-model="form.startDate" 
                show-icon
                date-format="mm/dd/yy"
                :class="{ 'p-invalid': errors.startDate }"
                :min-date="new Date()"
                required
              />
              <small v-if="errors.startDate" class="p-error">{{ errors.startDate }}</small>
            </div>
            
            <div class="field">
              <label for="expectedEndDate" class="block text-sm font-medium mb-2">Expected End Date</label>
              <Calendar 
                id="expectedEndDate"
                v-model="form.expectedEndDate" 
                show-icon
                date-format="mm/dd/yy"
                :min-date="form.startDate"
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
            
            <div class="field">
              <label for="targetBehaviors" class="block text-sm font-medium mb-2">Target Behaviors</label>
              <MultiSelect 
                id="targetBehaviors"
                v-model="form.targetBehaviors" 
                :options="behaviorOptions"
                option-label="label"
                option-value="value"
                placeholder="Select target behaviors"
                display="chip"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Problem Definition -->
      <Card>
        <template #title>Problem Definition</template>
        <template #content>
          <div class="field">
            <label for="problemDescription" class="block text-sm font-medium mb-2">Problem Description *</label>
            <Textarea 
              id="problemDescription"
              v-model="form.problemDescription" 
              placeholder="Describe the specific problem or behaviors to be addressed..."
              :class="{ 'p-invalid': errors.problemDescription }"
              rows="4"
              class="w-full"
              required
            />
            <small v-if="errors.problemDescription" class="p-error">{{ errors.problemDescription }}</small>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="field">
              <label for="frequency" class="block text-sm font-medium mb-2">Current Frequency</label>
              <InputText 
                id="frequency"
                v-model="form.frequency" 
                placeholder="How often does this occur?"
              />
            </div>
            
            <div class="field">
              <label for="intensity" class="block text-sm font-medium mb-2">Intensity Level</label>
              <Dropdown 
                id="intensity"
                v-model="form.intensity" 
                :options="intensityOptions"
                option-label="label"
                option-value="value"
                placeholder="Select intensity"
              />
            </div>
          </div>
          
          <div class="field mt-4">
            <label for="antecedents" class="block text-sm font-medium mb-2">Antecedents/Triggers</label>
            <Textarea 
              id="antecedents"
              v-model="form.antecedents" 
              placeholder="What typically happens before the problem behavior occurs?"
              rows="3"
              class="w-full"
            />
          </div>
          
          <div class="field mt-4">
            <label for="consequences" class="block text-sm font-medium mb-2">Consequences/Function</label>
            <Textarea 
              id="consequences"
              v-model="form.consequences" 
              placeholder="What happens after the behavior? What function does it serve?"
              rows="3"
              class="w-full"
            />
          </div>
        </template>
      </Card>

      <!-- Intervention Strategies -->
      <Card>
        <template #title>Intervention Strategies</template>
        <template #content>
          <div class="field">
            <label for="interventionGoals" class="block text-sm font-medium mb-2">Intervention Goals *</label>
            <Textarea 
              id="interventionGoals"
              v-model="form.interventionGoals" 
              placeholder="What are the specific, measurable goals for this intervention?"
              :class="{ 'p-invalid': errors.interventionGoals }"
              rows="4"
              class="w-full"
              required
            />
            <small v-if="errors.interventionGoals" class="p-error">{{ errors.interventionGoals }}</small>
          </div>
          
          <div class="field mt-4">
            <label for="strategies" class="block text-sm font-medium mb-2">Specific Strategies *</label>
            <Textarea 
              id="strategies"
              v-model="form.strategies" 
              placeholder="Describe the specific intervention strategies to be implemented..."
              :class="{ 'p-invalid': errors.strategies }"
              rows="5"
              class="w-full"
              required
            />
            <small v-if="errors.strategies" class="p-error">{{ errors.strategies }}</small>
          </div>
          
          <div class="field mt-4">
            <label for="reinforcement" class="block text-sm font-medium mb-2">Reinforcement Plan</label>
            <Textarea 
              id="reinforcement"
              v-model="form.reinforcement" 
              placeholder="How will positive behavior be reinforced?"
              rows="3"
              class="w-full"
            />
          </div>
          
          <div class="field mt-4">
            <label for="resources" class="block text-sm font-medium mb-2">Resources Needed</label>
            <Textarea 
              id="resources"
              v-model="form.resources" 
              placeholder="What resources, materials, or support are needed?"
              rows="3"
              class="w-full"
            />
          </div>
        </template>
      </Card>

      <!-- Implementation and Monitoring -->
      <Card>
        <template #title>Implementation and Monitoring</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="responsiblePersons" class="block text-sm font-medium mb-2">Responsible Persons *</label>
              <Textarea 
                id="responsiblePersons"
                v-model="form.responsiblePersons" 
                placeholder="Who will implement this intervention?"
                :class="{ 'p-invalid': errors.responsiblePersons }"
                rows="3"
                class="w-full"
                required
              />
              <small v-if="errors.responsiblePersons" class="p-error">{{ errors.responsiblePersons }}</small>
            </div>
            
            <div class="field">
              <label for="dataCollection" class="block text-sm font-medium mb-2">Data Collection Method</label>
              <Textarea 
                id="dataCollection"
                v-model="form.dataCollection" 
                placeholder="How will progress be measured and documented?"
                rows="3"
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="reviewFrequency" class="block text-sm font-medium mb-2">Review Frequency</label>
              <Dropdown 
                id="reviewFrequency"
                v-model="form.reviewFrequency" 
                :options="reviewFrequencyOptions"
                option-label="label"
                option-value="value"
                placeholder="Select review frequency"
              />
            </div>
            
            <div class="field">
              <label for="nextReviewDate" class="block text-sm font-medium mb-2">Next Review Date</label>
              <Calendar 
                id="nextReviewDate"
                v-model="form.nextReviewDate" 
                show-icon
                date-format="mm/dd/yy"
                :min-date="new Date()"
              />
            </div>
          </div>
          
          <div class="field mt-4">
            <label for="successCriteria" class="block text-sm font-medium mb-2">Success Criteria</label>
            <Textarea 
              id="successCriteria"
              v-model="form.successCriteria" 
              placeholder="How will you know if the intervention is successful?"
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
          @click="$router.push('/guidance/interventions')"
          severity="secondary"
          type="button"
        />
        <Button 
          label="Save Intervention Plan" 
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
  planTitle: '',
  interventionType: '',
  priority: '',
  tier: 'TIER_1',
  startDate: null,
  expectedEndDate: null,
  studentId: '',
  studentName: '',
  relatedCaseId: null,
  targetBehaviors: [],
  problemDescription: '',
  frequency: '',
  intensity: '',
  antecedents: '',
  consequences: '',
  interventionGoals: '',
  strategies: '',
  reinforcement: '',
  resources: '',
  responsiblePersons: '',
  dataCollection: '',
  reviewFrequency: 'WEEKLY',
  nextReviewDate: null,
  successCriteria: ''
});

// Options
const interventionTypeOptions = ref([
  { label: 'Academic Support', value: 'ACADEMIC_SUPPORT' },
  { label: 'Behavioral Intervention', value: 'BEHAVIORAL_INTERVENTION' },
  { label: 'Social Skills Training', value: 'SOCIAL_SKILLS' },
  { label: 'Mental Health Support', value: 'MENTAL_HEALTH' },
  { label: 'Crisis Intervention', value: 'CRISIS_INTERVENTION' },
  { label: 'Peer Mediation', value: 'PEER_MEDIATION' },
  { label: 'Family Support', value: 'FAMILY_SUPPORT' },
  { label: 'Multi-Component', value: 'MULTI_COMPONENT' }
]);

const priorityOptions = ref([
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' }
]);

const tierOptions = ref([
  { label: 'Tier 1 - Universal Support', value: 'TIER_1' },
  { label: 'Tier 2 - Targeted Support', value: 'TIER_2' },
  { label: 'Tier 3 - Intensive Support', value: 'TIER_3' }
]);

const behaviorOptions = ref([
  { label: 'Aggression', value: 'AGGRESSION' },
  { label: 'Disruptive Behavior', value: 'DISRUPTIVE' },
  { label: 'Non-compliance', value: 'NON_COMPLIANCE' },
  { label: 'Social Withdrawal', value: 'SOCIAL_WITHDRAWAL' },
  { label: 'Academic Avoidance', value: 'ACADEMIC_AVOIDANCE' },
  { label: 'Attention Seeking', value: 'ATTENTION_SEEKING' },
  { label: 'Anxiety/Fear', value: 'ANXIETY' },
  { label: 'Depression/Mood', value: 'DEPRESSION' },
  { label: 'Attendance Issues', value: 'ATTENDANCE' },
  { label: 'Peer Conflicts', value: 'PEER_CONFLICTS' }
]);

const intensityOptions = ref([
  { label: 'Mild', value: 'MILD' },
  { label: 'Moderate', value: 'MODERATE' },
  { label: 'Severe', value: 'SEVERE' }
]);

const reviewFrequencyOptions = ref([
  { label: 'Daily', value: 'DAILY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Bi-weekly', value: 'BI_WEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' }
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
  
  if (!form.value.planTitle) {
    errors.value.planTitle = 'Plan title is required';
  }
  
  if (!form.value.interventionType) {
    errors.value.interventionType = 'Intervention type is required';
  }
  
  if (!form.value.priority) {
    errors.value.priority = 'Priority level is required';
  }
  
  if (!form.value.startDate) {
    errors.value.startDate = 'Start date is required';
  }
  
  if (!form.value.studentId) {
    errors.value.studentId = 'Student ID is required';
  }
  
  if (!form.value.studentName) {
    errors.value.studentName = 'Student name is required';
  }
  
  if (!form.value.problemDescription) {
    errors.value.problemDescription = 'Problem description is required';
  }
  
  if (!form.value.interventionGoals) {
    errors.value.interventionGoals = 'Intervention goals are required';
  }
  
  if (!form.value.strategies) {
    errors.value.strategies = 'Intervention strategies are required';
  }
  
  if (!form.value.responsiblePersons) {
    errors.value.responsiblePersons = 'Responsible persons are required';
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
    startDate: form.value.startDate ? form.value.startDate.toISOString() : null,
    expectedEndDate: form.value.expectedEndDate ? form.value.expectedEndDate.toISOString() : null,
    nextReviewDate: form.value.nextReviewDate ? form.value.nextReviewDate.toISOString() : null
  };
  
  // Note: This would need to be implemented in the guidance service
  // For now, using a placeholder
  toast.add({
    severity: 'info',
    summary: 'Feature Coming Soon',
    detail: 'Intervention plan creation will be available soon',
    life: 3000
  });
  
  loading.value = false;
  
  // Uncomment when service method is implemented:
  /*
  guidanceService.createInterventionPlan(submitData, (response) => {
    loading.value = false;
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Plan Created',
        detail: 'Intervention plan has been created successfully',
        life: 3000
      });
      router.push('/guidance/interventions');
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.error || 'Failed to create intervention plan',
        life: 5000
      });
    }
  });
  */
};

// Lifecycle
onMounted(() => {
  loadCases();
});
</script>

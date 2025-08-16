<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Intervention Plans</h1>
        <p class="text-gray-600 mt-1">Manage student intervention strategies and action plans</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="New Intervention" 
          icon="pi pi-plus"
          @click="$router.push('/guidance/interventions/create')"
          severity="success"
        />
        <Button 
          label="Templates" 
          icon="pi pi-file"
          @click="showTemplates"
          severity="secondary"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card bg-blue-50 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-blue-600">Active Plans</h3>
            <p class="text-2xl font-bold text-blue-700">{{ statistics.active || 0 }}</p>
          </div>
          <i class="pi pi-play text-2xl text-blue-500"></i>
        </div>
      </div>
      
      <div class="card bg-yellow-50 border border-yellow-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-yellow-600">Planned</h3>
            <p class="text-2xl font-bold text-yellow-700">{{ statistics.planned || 0 }}</p>
          </div>
          <i class="pi pi-calendar text-2xl text-yellow-500"></i>
        </div>
      </div>
      
      <div class="card bg-green-50 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-green-600">Completed</h3>
            <p class="text-2xl font-bold text-green-700">{{ statistics.completed || 0 }}</p>
          </div>
          <i class="pi pi-check text-2xl text-green-500"></i>
        </div>
      </div>
      
      <div class="card bg-red-50 border border-red-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-red-600">Overdue</h3>
            <p class="text-2xl font-bold text-red-700">{{ statistics.overdue || 0 }}</p>
          </div>
          <i class="pi pi-exclamation-triangle text-2xl text-red-500"></i>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Search</span>
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search"></i>
          <InputText 
            v-model="searchTerm" 
            placeholder="Search interventions..."
            class="w-full"
            @keyup.enter="searchInterventions"
          />
        </span>
      </div>
      
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Status</span>
        <Dropdown 
          v-model="selectedStatus" 
          :options="statusOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Statuses"
          class="w-full"
          @change="filterInterventions"
        />
      </div>
      
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Type</span>
        <Dropdown 
          v-model="selectedType" 
          :options="typeOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Types"
          class="w-full"
          @change="filterInterventions"
        />
      </div>
      
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Assigned To</span>
        <Dropdown 
          v-model="selectedAssignee" 
          :options="assigneeOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Assignees"
          class="w-full"
          @change="filterInterventions"
        />
      </div>
    </div>

    <!-- Interventions Table -->
    <DataTable 
      :value="interventions" 
      :loading="loading"
      :paginator="true" 
      :rows="pageSize"
      :totalRecords="totalRecords"
      :lazy="true"
      @page="onPageChange"
      sortMode="single"
      class="p-datatable-sm"
    >
      <Column field="planNumber" header="Plan #" sortable>
        <template #body="{ data }">
          <router-link 
            :to="`/guidance/interventions/${data.id}`"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            {{ data.planNumber }}
          </router-link>
        </template>
      </Column>
      
      <Column field="studentName" header="Student" sortable />
      
      <Column field="caseNumber" header="Case #" sortable>
        <template #body="{ data }">
          <router-link 
            :to="`/guidance/cases/${data.caseId}`"
            class="text-blue-600 hover:text-blue-800"
          >
            {{ data.caseNumber }}
          </router-link>
        </template>
      </Column>
      
      <Column field="interventionType" header="Type" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.interventionType" 
            :severity="getTypeSeverity(data.interventionType)"
          />
        </template>
      </Column>
      
      <Column field="startDate" header="Start Date" sortable>
        <template #body="{ data }">
          {{ formatDate(data.startDate) }}
        </template>
      </Column>
      
      <Column field="targetDate" header="Target Date" sortable>
        <template #body="{ data }">
          <div :class="isOverdue(data.targetDate) ? 'text-red-600 font-medium' : ''">
            {{ formatDate(data.targetDate) }}
          </div>
        </template>
      </Column>
      
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.status" 
            :severity="getStatusSeverity(data.status)"
          />
        </template>
      </Column>
      
      <Column field="assignedTo" header="Assigned To" sortable />
      
      <Column field="progress" header="Progress" sortable>
        <template #body="{ data }">
          <ProgressBar 
            :value="data.progress || 0" 
            :showValue="true"
            style="height: 0.5rem"
          />
        </template>
      </Column>
      
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-eye" 
              size="small"
              severity="info"
              @click="viewIntervention(data)"
              v-tooltip="'View Details'"
            />
            <Button 
              icon="pi pi-pencil" 
              size="small"
              severity="warning"
              @click="editIntervention(data)"
              v-tooltip="'Edit Plan'"
              v-if="data.status !== 'COMPLETED'"
            />
            <Button 
              icon="pi pi-chart-line" 
              size="small"
              severity="success"
              @click="updateProgress(data)"
              v-tooltip="'Update Progress'"
              v-if="data.status === 'ACTIVE'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Create Intervention Dialog -->
    <Dialog 
      v-model:visible="showCreateDialog" 
      :modal="true" 
      header="Create Intervention Plan"
      :style="{ width: '50rem' }"
    >
      <CreateInterventionForm 
        @intervention-created="onInterventionCreated"
        @cancel="showCreateDialog = false"
      />
    </Dialog>

    <!-- Update Progress Dialog -->
    <Dialog 
      v-model:visible="showProgressDialog" 
      :modal="true" 
      header="Update Progress"
      :style="{ width: '40rem' }"
    >
      <UpdateProgressForm 
        :intervention="selectedIntervention"
        @progress-updated="onProgressUpdated"
        @cancel="showProgressDialog = false"
      />
    </Dialog>

    <!-- Templates Dialog -->
    <Dialog 
      v-model:visible="showTemplatesDialog" 
      :modal="true" 
      header="Intervention Templates"
      :style="{ width: '60rem' }"
    >
      <InterventionTemplates 
        @template-selected="onTemplateSelected"
        @cancel="showTemplatesDialog = false"
      />
    </Dialog>
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
const interventions = ref([]);
const statistics = ref({});
const loading = ref(false);
const showCreateDialog = ref(false);
const showProgressDialog = ref(false);
const showTemplatesDialog = ref(false);
const selectedIntervention = ref(null);

// Pagination
const pageSize = ref(10);
const currentPage = ref(0);
const totalRecords = ref(0);

// Filters
const searchTerm = ref('');
const selectedStatus = ref(null);
const selectedType = ref(null);
const selectedAssignee = ref(null);

// Options
const statusOptions = [
  { label: 'Planned', value: 'PLANNED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' }
];

const typeOptions = [
  { label: 'Academic Support', value: 'ACADEMIC_SUPPORT' },
  { label: 'Behavioral Modification', value: 'BEHAVIORAL_MODIFICATION' },
  { label: 'Counseling Therapy', value: 'COUNSELING_THERAPY' },
  { label: 'Social Skills Training', value: 'SOCIAL_SKILLS_TRAINING' },
  { label: 'Family Involvement', value: 'FAMILY_INVOLVEMENT' },
  { label: 'Peer Mediation', value: 'PEER_MEDIATION' },
  { label: 'Crisis Response', value: 'CRISIS_RESPONSE' },
  { label: 'Mentoring Program', value: 'MENTORING_PROGRAM' }
];

const assigneeOptions = ref([]);

// Methods
const loadInterventions = (page = 0) => {
  loading.value = true;
  
  const params = {
    page,
    size: pageSize.value,
    sortBy: 'startDate',
    sortDir: 'desc'
  };

  guidanceService.getAllInterventions(params,
    (response) => {
      if (response.success) {
        interventions.value = response.data.content;
        totalRecords.value = response.data.totalElements;
      }
      loading.value = false;
    },
    (error) => {
      console.error('Error loading interventions:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load interventions',
        life: 3000
      });
      loading.value = false;
    }
  );
};

const loadStatistics = () => {
  guidanceService.getInterventionStatistics(
    (response) => {
      if (response.success) {
        statistics.value = response.data;
      }
    },
    (error) => {
      console.error('Error loading statistics:', error);
    }
  );
};

const loadAssignees = () => {
  // Mock data - replace with actual API call
  assigneeOptions.value = [
    { label: 'Dr. Jane Smith', value: 'jane.smith' },
    { label: 'Ms. Mary Johnson', value: 'mary.johnson' },
    { label: 'Mr. Robert Brown', value: 'robert.brown' }
  ];
};

const searchInterventions = () => {
  if (searchTerm.value.trim()) {
    loading.value = true;
    guidanceService.searchInterventions(searchTerm.value, { page: 0, size: pageSize.value },
      (response) => {
        if (response.success) {
          interventions.value = response.data.content;
          totalRecords.value = response.data.totalElements;
        }
        loading.value = false;
      },
      (error) => {
        console.error('Error searching interventions:', error);
        loading.value = false;
      }
    );
  } else {
    loadInterventions();
  }
};

const filterInterventions = () => {
  loadInterventions();
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadInterventions(event.page);
};

const viewIntervention = (intervention) => {
  router.push(`/guidance/interventions/${intervention.id}`);
};

const editIntervention = (intervention) => {
  router.push(`/guidance/interventions/${intervention.id}/edit`);
};

const updateProgress = (intervention) => {
  selectedIntervention.value = { ...intervention };
  showProgressDialog.value = true;
};

const showTemplates = () => {
  showTemplatesDialog.value = true;
};

const onInterventionCreated = (newIntervention) => {
  showCreateDialog.value = false;
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Intervention plan created successfully',
    life: 3000
  });
  loadInterventions();
  loadStatistics();
};

const onProgressUpdated = (updatedIntervention) => {
  showProgressDialog.value = false;
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Progress updated successfully',
    life: 3000
  });
  loadInterventions();
};

const onTemplateSelected = (template) => {
  showTemplatesDialog.value = false;
  // Pre-fill create form with template data
  showCreateDialog.value = true;
};

// Utility methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const isOverdue = (targetDate) => {
  if (!targetDate) return false;
  return new Date(targetDate) < new Date();
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'PLANNED': return 'info';
    case 'ACTIVE': return 'warning';
    case 'COMPLETED': return 'success';
    case 'CANCELLED': return 'danger';
    default: return 'secondary';
  }
};

const getTypeSeverity = (type) => {
  switch (type) {
    case 'ACADEMIC_SUPPORT': return 'info';
    case 'BEHAVIORAL_MODIFICATION': return 'warning';
    case 'COUNSELING_THERAPY': return 'secondary';
    case 'SOCIAL_SKILLS_TRAINING': return 'success';
    case 'FAMILY_INVOLVEMENT': return 'info';
    case 'PEER_MEDIATION': return 'secondary';
    case 'CRISIS_RESPONSE': return 'danger';
    case 'MENTORING_PROGRAM': return 'success';
    default: return 'info';
  }
};

// Lifecycle
onMounted(() => {
  loadInterventions();
  loadStatistics();
  loadAssignees();
});
</script>

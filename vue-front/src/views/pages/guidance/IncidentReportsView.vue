<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Incident Reports</h1>
        <p class="text-gray-600 mt-1">Track and manage behavioral incidents and violations</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="New Incident" 
          icon="pi pi-exclamation-triangle"
          @click="$router.push('/guidance/incidents/create')"
          severity="danger"
        />
        <Button 
          label="Generate Report" 
          icon="pi pi-file-pdf"
          @click="generateReport"
          severity="secondary"
        />
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card bg-red-50 border border-red-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-red-600">Critical Incidents</h3>
            <p class="text-2xl font-bold text-red-700">{{ statistics.critical || 0 }}</p>
          </div>
          <i class="pi pi-exclamation-circle text-2xl text-red-500"></i>
        </div>
      </div>
      
      <div class="card bg-orange-50 border border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-orange-600">Major Incidents</h3>
            <p class="text-2xl font-bold text-orange-700">{{ statistics.major || 0 }}</p>
          </div>
          <i class="pi pi-exclamation-triangle text-2xl text-orange-500"></i>
        </div>
      </div>
      
      <div class="card bg-yellow-50 border border-yellow-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-yellow-600">Moderate Incidents</h3>
            <p class="text-2xl font-bold text-yellow-700">{{ statistics.moderate || 0 }}</p>
          </div>
          <i class="pi pi-exclamation text-2xl text-yellow-500"></i>
        </div>
      </div>
      
      <div class="card bg-blue-50 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-blue-600">Minor Incidents</h3>
            <p class="text-2xl font-bold text-blue-700">{{ statistics.minor || 0 }}</p>
          </div>
          <i class="pi pi-info-circle text-2xl text-blue-500"></i>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Search</span>
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search"></i>
          <InputText 
            v-model="searchTerm" 
            placeholder="Search incidents..."
            class="w-full"
            @keyup.enter="searchIncidents"
          />
        </span>
      </div>
      
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Date Range</span>
        <Calendar 
          v-model="dateRange" 
          selectionMode="range" 
          :manualInput="false"
          class="w-full"
          @date-select="filterIncidents"
        />
      </div>
      
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Severity</span>
        <Dropdown 
          v-model="selectedSeverity" 
          :options="severityOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Severities"
          class="w-full"
          @change="filterIncidents"
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
          @change="filterIncidents"
        />
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
          @change="filterIncidents"
        />
      </div>
    </div>

    <!-- Incidents Table -->
    <DataTable 
      :value="incidents" 
      :loading="loading"
      :paginator="true" 
      :rows="pageSize"
      :totalRecords="totalRecords"
      :lazy="true"
      @page="onPageChange"
      sortMode="single"
      class="p-datatable-sm"
    >
      <Column field="incidentNumber" header="Incident #" sortable>
        <template #body="{ data }">
          <router-link 
            :to="`/guidance/incidents/${data.id}`"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            {{ data.incidentNumber }}
          </router-link>
        </template>
      </Column>
      
      <Column field="studentName" header="Student" sortable />
      
      <Column field="incidentDate" header="Date & Time" sortable>
        <template #body="{ data }">
          <div>
            <div>{{ formatDate(data.incidentDate) }}</div>
            <small class="text-gray-500">{{ formatTime(data.incidentDate) }}</small>
          </div>
        </template>
      </Column>
      
      <Column field="incidentType" header="Type" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.incidentType" 
            :severity="getTypeSeverity(data.incidentType)"
          />
        </template>
      </Column>
      
      <Column field="severity" header="Severity" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.severity" 
            :severity="getSeveritySeverity(data.severity)"
          />
        </template>
      </Column>
      
      <Column field="location" header="Location" sortable />
      
      <Column field="reportedBy" header="Reported By" sortable />
      
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.status" 
            :severity="getStatusSeverity(data.status)"
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
              @click="viewIncident(data)"
              v-tooltip="'View Details'"
            />
            <Button 
              icon="pi pi-pencil" 
              size="small"
              severity="warning"
              @click="editIncident(data)"
              v-tooltip="'Edit Incident'"
              v-if="data.status !== 'RESOLVED'"
            />
            <Button 
              icon="pi pi-users" 
              size="small"
              severity="success"
              @click="createCase(data)"
              v-tooltip="'Create Guidance Case'"
              v-if="!data.guidanceCaseId"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- No dialogs needed - using router navigation -->
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
const incidents = ref([]);
const statistics = ref({});
const loading = ref(false);

// Pagination
const pageSize = ref(10);
const currentPage = ref(0);
const totalRecords = ref(0);

// Filters
const searchTerm = ref('');
const dateRange = ref(null);
const selectedSeverity = ref(null);
const selectedType = ref(null);
const selectedStatus = ref(null);

// Options
const severityOptions = [
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'Major', value: 'MAJOR' },
  { label: 'Moderate', value: 'MODERATE' },
  { label: 'Minor', value: 'MINOR' }
];

const typeOptions = [
  { label: 'Physical Violence', value: 'PHYSICAL_VIOLENCE' },
  { label: 'Verbal Abuse', value: 'VERBAL_ABUSE' },
  { label: 'Bullying', value: 'BULLYING' },
  { label: 'Cyberbullying', value: 'CYBERBULLYING' },
  { label: 'Substance Abuse', value: 'SUBSTANCE_ABUSE' },
  { label: 'Theft', value: 'THEFT' },
  { label: 'Vandalism', value: 'VANDALISM' },
  { label: 'Disruption', value: 'DISRUPTION' },
  { label: 'Truancy', value: 'TRUANCY' },
  { label: 'Other', value: 'OTHER' }
];

const statusOptions = [
  { label: 'Reported', value: 'REPORTED' },
  { label: 'Under Investigation', value: 'UNDER_INVESTIGATION' },
  { label: 'Action Required', value: 'ACTION_REQUIRED' },
  { label: 'Resolved', value: 'RESOLVED' }
];

// Methods
const loadIncidents = (page = 0) => {
  loading.value = true;
  
  const params = {
    page,
    size: pageSize.value,
    sortBy: 'incidentDate',
    sortDir: 'desc'
  };

  guidanceService.getAllIncidents(params,
    (response) => {
      if (response.success) {
        incidents.value = response.data.content;
        totalRecords.value = response.data.totalElements;
      }
      loading.value = false;
    },
    (error) => {
      console.error('Error loading incidents:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load incidents',
        life: 3000
      });
      loading.value = false;
    }
  );
};

const loadStatistics = () => {
  guidanceService.getIncidentStatistics(
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

const searchIncidents = () => {
  if (searchTerm.value.trim()) {
    loading.value = true;
    guidanceService.searchIncidents(searchTerm.value, { page: 0, size: pageSize.value },
      (response) => {
        if (response.success) {
          incidents.value = response.data.content;
          totalRecords.value = response.data.totalElements;
        }
        loading.value = false;
      },
      (error) => {
        console.error('Error searching incidents:', error);
        loading.value = false;
      }
    );
  } else {
    loadIncidents();
  }
};

const filterIncidents = () => {
  loadIncidents();
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadIncidents(event.page);
};

const viewIncident = (incident) => {
  router.push(`/guidance/incidents/${incident.id}`);
};

const editIncident = (incident) => {
  router.push(`/guidance/incidents/${incident.id}/edit`);
};

const createCase = (incident) => {
  router.push(`/guidance/cases/create?incidentId=${incident.id}`);
};

const generateReport = () => {
  toast.add({
    severity: 'info',
    summary: 'Generate Report',
    detail: 'Report generation functionality coming soon',
    life: 3000
  });
};

// Methods continue...

// Utility methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString();
};

const getSeveritySeverity = (severity) => {
  switch (severity) {
    case 'CRITICAL': return 'danger';
    case 'MAJOR': return 'danger';
    case 'MODERATE': return 'warning';
    case 'MINOR': return 'info';
    default: return 'secondary';
  }
};

const getTypeSeverity = (type) => {
  switch (type) {
    case 'PHYSICAL_VIOLENCE': return 'danger';
    case 'VERBAL_ABUSE': return 'warning';
    case 'BULLYING': return 'danger';
    case 'CYBERBULLYING': return 'warning';
    case 'SUBSTANCE_ABUSE': return 'danger';
    case 'THEFT': return 'warning';
    case 'VANDALISM': return 'warning';
    case 'DISRUPTION': return 'info';
    case 'TRUANCY': return 'secondary';
    default: return 'info';
  }
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'REPORTED': return 'danger';
    case 'UNDER_INVESTIGATION': return 'warning';
    case 'ACTION_REQUIRED': return 'warning';
    case 'RESOLVED': return 'success';
    default: return 'info';
  }
};

// Lifecycle
onMounted(() => {
  loadIncidents();
  loadStatistics();
});
</script>

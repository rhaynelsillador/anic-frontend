<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Guidance Cases</h1>
        <p class="text-gray-600 mt-1">Manage student guidance and counseling cases</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="New Case" 
          icon="pi pi-plus"
          @click="$router.push('/guidance/cases/create')"
          severity="success"
        />
        <Button 
          label="Export" 
          icon="pi pi-download"
          @click="exportCases"
          severity="secondary"
        />
      </div>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="field">
        <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <span class="p-input-icon-left w-full">
          <InputText 
            v-model="searchTerm" 
            placeholder="Search cases..."
            class="w-full"
            @keyup.enter="searchCases"
          />
        </span>
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <Dropdown 
          v-model="selectedStatus" 
          :options="statusOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Statuses"
          class="w-full"
          @change="filterCases"
        />
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <Dropdown 
          v-model="selectedCategory" 
          :options="categoryOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Categories"
          class="w-full"
          @change="filterCases"
        />
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <Dropdown 
          v-model="selectedPriority" 
          :options="priorityOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Priorities"
          class="w-full"
          @change="filterCases"
        />
      </div>
    </div>

    <!-- Cases Table -->
    <DataTable 
      :value="cases" 
      :loading="loading"
      :paginator="true" 
      :rows="pageSize"
      :totalRecords="totalRecords"
      :lazy="true"
      @page="onPageChange"
      @sort="onSort"
      sortMode="single"
      class="p-datatable-sm"
    >
      <Column field="caseNumber" header="Case #" sortable>
        <template #body="{ data }">
          <router-link 
            :to="`/guidance/cases/${data.id}`"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            {{ data.caseNumber }}
          </router-link>
        </template>
      </Column>
      
      <Column field="studentName" header="Student" sortable />
      
      <Column field="category" header="Category" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.category" 
            :severity="getCategorySeverity(data.category)"
          />
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
      
      <Column field="priority" header="Priority" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.priority" 
            :severity="getPrioritySeverity(data.priority)"
          />
        </template>
      </Column>
      
      <Column field="assignedCounselorName" header="Counselor" sortable />
      
      <Column field="dateReported" header="Date Reported" sortable>
        <template #body="{ data }">
          {{ formatDate(data.dateReported) }}
        </template>
      </Column>
      
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-eye" 
              size="small"
              severity="info"
              @click="viewCase(data)"
              v-tooltip="'View Details'"
            />
            <Button 
              icon="pi pi-pencil" 
              size="small"
              severity="warning"
              @click="editCase(data)"
              v-tooltip="'Edit Case'"
            />
            <Button 
              icon="pi pi-calendar-plus" 
              size="small"
              severity="success"
              @click="scheduleSession(data)"
              v-tooltip="'Schedule Session'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Create Case Dialog -->
    <!-- No dialogs needed - using router navigation -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import GuidanceService from '@/service/guidance';

const toast = useToast();
const router = useRouter();
const guidanceService = new GuidanceService();

// Data
const cases = ref([]);
const loading = ref(false);

// Pagination
const pageSize = ref(10);
const currentPage = ref(0);
const totalRecords = ref(0);

// Filters
const searchTerm = ref('');
const selectedStatus = ref(null);
const selectedCategory = ref(null);
const selectedPriority = ref(null);

// Options
const statusOptions = [
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Closed', value: 'CLOSED' }
];

const categoryOptions = [
  { label: 'Academic', value: 'ACADEMIC' },
  { label: 'Behavioral', value: 'BEHAVIORAL' },
  { label: 'Mental Health', value: 'MENTAL_HEALTH' },
  { label: 'Family/Social', value: 'FAMILY_SOCIAL' }
];

const priorityOptions = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' }
];

// Methods
const loadCases = (page = 0) => {
  loading.value = true;
  
  guidanceService.getCases(page, pageSize.value, 
    (response) => {
      if (response.success) {
        cases.value = response.data.data.content;
        totalRecords.value = response.data.data.totalElements;
      }
      loading.value = false;
    }
  );
};

const searchCases = () => {
  if (searchTerm.value.trim()) {
    loading.value = true;
    guidanceService.searchCases(searchTerm.value, 0, pageSize.value,
      (response) => {
        if (response.success) {
          cases.value = response.data.data.content;
          totalRecords.value = response.data.data.totalElements;
        }
        loading.value = false;
      }
    );
  } else {
    loadCases();
  }
};

const filterCases = () => {
  // Implement filtering logic
  loadCases();
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadCases(event.page);
};

const onSort = (event) => {
  // Implement sorting
  loadCases();
};

const viewCase = (caseData) => {
  router.push(`/guidance/cases/${caseData.id}`);
};

const editCase = (caseData) => {
  router.push(`/guidance/cases/${caseData.id}/edit`);
};

const scheduleSession = (caseData) => {
  router.push(`/guidance/cases/${caseData.id}/schedule-session`);
};

const exportCases = () => {
  // Implement export functionality
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Export functionality coming soon',
    life: 3000
  });
};

// Utility methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const getCategorySeverity = (category) => {
  switch (category) {
    case 'ACADEMIC': return 'info';
    case 'BEHAVIORAL': return 'warning';
    case 'MENTAL_HEALTH': return 'danger';
    case 'FAMILY_SOCIAL': return 'secondary';
    default: return 'info';
  }
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'OPEN': return 'danger';
    case 'IN_PROGRESS': return 'warning';
    case 'RESOLVED': return 'success';
    case 'CLOSED': return 'secondary';
    default: return 'info';
  }
};

const getPrioritySeverity = (priority) => {
  switch (priority) {
    case 'URGENT': return 'danger';
    case 'HIGH': return 'warning';
    case 'MEDIUM': return 'info';
    case 'LOW': return 'secondary';
    default: return 'info';
  }
};

// Lifecycle
onMounted(() => {
  loadCases();
});
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Guidance Sessions</h1>
        <p class="text-gray-600 mt-1">Manage counseling and guidance sessions</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="Schedule Session" 
          icon="pi pi-calendar-plus"
          @click="scheduleNewSession"
          severity="success"
        />
        <Button 
          label="Today's Sessions" 
          icon="pi pi-calendar"
          @click="showTodaySessions"
          severity="info"
        />
      </div>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="field">
        <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
        <Calendar 
          v-model="dateRange" 
          selectionMode="range" 
          :manualInput="false"
          class="w-full"
          @date-select="filterSessions"
        />
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
          @change="filterSessions"
        />
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
        <Dropdown 
          v-model="selectedType" 
          :options="typeOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Types"
          class="w-full"
          @change="filterSessions"
        />
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium text-gray-700 mb-2">Counselor</label>
        <Dropdown 
          v-model="selectedCounselor" 
          :options="counselorOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Counselors"
          class="w-full"
          @change="filterSessions"
        />
      </div>
    </div>

    <!-- Sessions Table -->
    <DataTable 
      :value="sessions" 
      :loading="loading"
      :paginator="true" 
      :rows="pageSize"
      :totalRecords="totalRecords"
      :lazy="true"
      @page="onPageChange"
      sortMode="single"
      class="p-datatable-sm"
    >
      <Column field="sessionNumber" header="Session #" sortable />
      
      <Column field="caseNumber" header="Case #" sortable>
        <template #body="{ data }">
          <router-link 
            :to="`/guidance/cases/${data.caseId}`"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            {{ data.caseNumber }}
          </router-link>
        </template>
      </Column>
      
      <Column field="studentName" header="Student" sortable />
      
      <Column field="sessionDate" header="Date & Time" sortable>
        <template #body="{ data }">
          <div>
            <div>{{ formatDate(data.sessionDate) }}</div>
            <small class="text-gray-500">{{ formatTime(data.sessionDate) }}</small>
          </div>
        </template>
      </Column>
      
      <Column field="sessionType" header="Type" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.sessionType" 
            :severity="getTypeSeverity(data.sessionType)"
          />
        </template>
      </Column>
      
      <Column field="duration" header="Duration" sortable />
      
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.status" 
            :severity="getStatusSeverity(data.status)"
          />
        </template>
      </Column>
      
      <Column field="counselorName" header="Counselor" sortable />
      
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-eye" 
              size="small"
              severity="info"
              @click="viewSession(data)"
              v-tooltip="'View Details'"
            />
            <Button 
              icon="pi pi-pencil" 
              size="small"
              severity="warning"
              @click="editSession(data)"
              v-tooltip="'Edit Session'"
              v-if="data.status !== 'COMPLETED'"
            />
            <Button 
              icon="pi pi-play" 
              size="small"
              severity="success"
              @click="startSession(data)"
              v-tooltip="'Start Session'"
              v-if="data.status === 'SCHEDULED'"
            />
            <Button 
              icon="pi pi-check" 
              size="small"
              severity="success"
              @click="completeSession(data)"
              v-tooltip="'Complete Session'"
              v-if="data.status === 'IN_PROGRESS'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Schedule Session Dialog -->
    <Dialog 
      v-model:visible="showScheduleDialog" 
      :modal="true" 
      header="Schedule New Session"
      :style="{ width: '50rem' }"
    >
      <ScheduleSessionForm 
        @session-scheduled="onSessionScheduled"
        @cancel="showScheduleDialog = false"
      />
    </Dialog>

    <!-- Today's Sessions Dialog -->
    <Dialog 
      v-model:visible="showTodayDialog" 
      :modal="true" 
      header="Today's Sessions"
      :style="{ width: '60rem' }"
    >
      <TodaySessionsList />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import GuidanceService from '@/service/guidance';

const router = useRouter();
const toast = useToast();
const guidanceService = new GuidanceService();

// Data
const sessions = ref([]);
const loading = ref(false);
const showScheduleDialog = ref(false);
const showTodayDialog = ref(false);

// Pagination
const pageSize = ref(10);
const currentPage = ref(0);
const totalRecords = ref(0);

// Filters
const dateRange = ref(null);
const selectedStatus = ref(null);
const selectedType = ref(null);
const selectedCounselor = ref(null);

// Options
const statusOptions = [
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' }
];

const typeOptions = [
  { label: 'Individual Counseling', value: 'INDIVIDUAL_COUNSELING' },
  { label: 'Group Counseling', value: 'GROUP_COUNSELING' },
  { label: 'Academic Guidance', value: 'ACADEMIC_GUIDANCE' },
  { label: 'Career Guidance', value: 'CAREER_GUIDANCE' },
  { label: 'Crisis Intervention', value: 'CRISIS_INTERVENTION' }
];

const counselorOptions = ref([]);

// Methods
const loadSessions = (page = 0) => {
  loading.value = true;
  
  const params = {
    page,
    size: pageSize.value,
    sortBy: 'sessionDate',
    sortDir: 'desc'
  };

  guidanceService.getSessions(params.page, params.size, (response) => {
    if (response.success) {
      sessions.value = response.data.data.content;
      totalRecords.value = response.data.totalElements;
    }
      loading.value = false;
    }
  );
};

const loadCounselors = () => {
  // Mock data - replace with actual API call
  counselorOptions.value = [
    { label: 'Dr. Jane Smith', value: 'jane.smith' },
    { label: 'Ms. Mary Johnson', value: 'mary.johnson' },
    { label: 'Mr. Robert Brown', value: 'robert.brown' }
  ];
};

const filterSessions = () => {
  loadSessions();
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadSessions(event.page);
};

const scheduleNewSession = () => {
  showScheduleDialog.value = true;
};

const showTodaySessions = () => {
  showTodayDialog.value = true;
};

const viewSession = (session) => {
  router.push(`/guidance/sessions/${session.id}`);
};

const editSession = (session) => {
  router.push(`/guidance/cases/${session.caseId}/sessions/${session.id}/edit`);
};

const startSession = (session) => {
  loading.value = true;
  
  guidanceService.updateSessionStatus(session.id, 'IN_PROGRESS',
    (response) => {
      if (response.success) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Session started successfully',
          life: 3000
        });
        loadSessions();
      }
      loading.value = false;
    }
  );
};

const completeSession = (session) => {
  router.push(`/guidance/sessions/${session.id}/complete`);
};

const onSessionScheduled = (newSession) => {
  showScheduleDialog.value = false;
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Session scheduled successfully',
    life: 3000
  });
  loadSessions();
};

// Utility methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString();
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'SCHEDULED': return 'info';
    case 'IN_PROGRESS': return 'warning';
    case 'COMPLETED': return 'success';
    case 'CANCELLED': return 'danger';
    default: return 'secondary';
  }
};

const getTypeSeverity = (type) => {
  switch (type) {
    case 'INDIVIDUAL_COUNSELING': return 'info';
    case 'GROUP_COUNSELING': return 'secondary';
    case 'ACADEMIC_GUIDANCE': return 'success';
    case 'CAREER_GUIDANCE': return 'warning';
    case 'CRISIS_INTERVENTION': return 'danger';
    default: return 'info';
  }
};

// Lifecycle
onMounted(() => {
  loadSessions();
  loadCounselors();
});
</script>

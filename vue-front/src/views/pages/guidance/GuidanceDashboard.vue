<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Guidance Dashboard</h1>
        <p class="text-gray-600 mt-1">Overview of student guidance and counseling activities</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="Quick Actions" 
          icon="pi pi-bolt"
          @click="showQuickActions = true"
          severity="info"
        />
        <Button 
          label="Export Report" 
          icon="pi pi-download"
          @click="exportReport"
          severity="secondary"
        />
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card bg-blue-50 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-blue-600">Open Cases</h3>
            <p class="text-2xl font-bold text-blue-700">{{ metrics.openCases || 0 }}</p>
            <p class="text-xs text-blue-500 mt-1">{{ metrics.newCasesThisWeek || 0 }} new this week</p>
          </div>
          <i class="pi pi-folder-open text-2xl text-blue-500"></i>
        </div>
      </div>
      
      <div class="card bg-green-50 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-green-600">Sessions in 7 Days</h3>
            <p class="text-2xl font-bold text-green-700">{{ metrics.sessionsThisWeek || 0 }}</p>
            <p class="text-xs text-green-500 mt-1">{{ metrics.completedSessions || 0 }} completed</p>
          </div>
          <i class="pi pi-calendar text-2xl text-green-500"></i>
        </div>
      </div>
      
      <div class="card bg-orange-50 border border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-orange-600">Critical Incidents</h3>
            <p class="text-2xl font-bold text-orange-700">{{ metrics.criticalIncidents || 0 }}</p>
            <p class="text-xs text-orange-500 mt-1">{{ metrics.pendingIncidents || 0 }} pending review</p>
          </div>
          <i class="pi pi-exclamation-triangle text-2xl text-orange-500"></i>
        </div>
      </div>
      
      <div class="card bg-purple-50 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-purple-600">Active Interventions</h3>
            <p class="text-2xl font-bold text-purple-700">{{ metrics.activeInterventions || 0 }}</p>
            <p class="text-xs text-purple-500 mt-1">{{ metrics.overdueInterventions || 0 }} overdue</p>
          </div>
          <i class="pi pi-chart-line text-2xl text-purple-500"></i>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Recent Cases -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Recent Cases</h3>
          <router-link to="/guidance/cases" class="text-blue-600 hover:text-blue-800 text-sm">
            View All →
          </router-link>
        </div>
        
        <DataTable :value="recentCases" class="p-datatable-sm">
          <Column field="caseNumber" header="Case #">
            <template #body="{ data }">
              <router-link 
                :to="`/guidance/cases/${data.id}`"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                {{ data.caseNumber }}
              </router-link>
            </template>
          </Column>
          <Column field="studentName" header="Student" />
          <Column field="priority" header="Priority">
            <template #body="{ data }">
              <Tag 
                :value="data.priority" 
                :severity="getPrioritySeverity(data.priority)"
                class="text-xs"
              />
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="getStatusSeverity(data.status)"
                class="text-xs"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Upcoming Sessions -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Today's Sessions</h3>
          <router-link to="/guidance/sessions" class="text-blue-600 hover:text-blue-800 text-sm">
            View All →
          </router-link>
        </div>
        
        <DataTable :value="todaySessions" class="p-datatable-sm">
          <Column field="sessionTime" header="Time">
            <template #body="{ data }">
              {{ formatTime(data.sessionDate) }}
            </template>
          </Column>
          <Column field="studentName" header="Student" />
          <Column field="sessionType" header="Type">
            <template #body="{ data }">
              <Tag 
                :value="data.sessionType" 
                severity="info"
                class="text-xs"
              />
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="getSessionStatusSeverity(data.status)"
                class="text-xs"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Case Statistics Chart -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Case Distribution by Category</h3>
        <Chart type="doughnut" :data="caseDistributionData" :options="chartOptions" />
      </div>

      <!-- Monthly Trends Chart -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Monthly Activity Trends</h3>
        <Chart type="line" :data="monthlyTrendsData" :options="lineChartOptions" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Priority Alerts -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Priority Alerts</h3>
          <Button 
            icon="pi pi-refresh" 
            size="small"
            @click="refreshAlerts"
            severity="secondary"
          />
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="alert in priorityAlerts" 
            :key="alert.id"
            class="flex items-start p-3 border-l-4 rounded"
            :class="getAlertClass(alert.level)"
          >
            <i 
              :class="getAlertIcon(alert.level)"
              class="mr-3 mt-1"
            ></i>
            <div class="flex-1">
              <p class="font-medium text-sm">{{ alert.title }}</p>
              <p class="text-sm text-gray-600">{{ alert.message }}</p>
              <small class="text-gray-500">{{ formatDate(alert.date) }}</small>
            </div>
          </div>
          
          <div v-if="priorityAlerts.length === 0" class="text-center text-gray-500 py-4">
            No priority alerts at this time
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
        
        <div class="grid grid-cols-2 gap-3">
          <Button 
            label="New Case" 
            icon="pi pi-plus"
            @click="$router.push('/guidance/cases/create')"
            severity="success"
            class="w-full justify-start"
          />
          <Button 
            label="Schedule Session" 
            icon="pi pi-calendar-plus"
            @click="$router.push('/guidance/sessions/schedule')"
            severity="info"
            class="w-full justify-start"
          />
          <Button 
            label="Report Incident" 
            icon="pi pi-exclamation-triangle"
            @click="$router.push('/guidance/incidents/create')"
            severity="danger"
            class="w-full justify-start"
          />
          <Button 
            label="Contact Parent" 
            icon="pi pi-phone"
            @click="$router.push('/guidance/parent-contacts/create')"
            severity="warning"
            class="w-full justify-start"
          />
        </div>
        
        <Divider />
        
        <div class="space-y-2">
          <router-link 
            to="/guidance/reports"
            class="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded"
          >
            <i class="pi pi-chart-bar mr-2"></i>
            <span>View Reports</span>
          </router-link>
          <router-link 
            to="/guidance/settings"
            class="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded"
          >
            <i class="pi pi-cog mr-2"></i>
            <span>Settings</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Actions Sidebar -->
    <Sidebar v-model:visible="showQuickActions" header="Quick Actions" position="right">
      <div class="space-y-4">
        <Button 
          label="New Guidance Case" 
          icon="pi pi-plus"
          @click="quickAction('new-case')"
          severity="success"
          class="w-full"
        />
        <Button 
          label="Emergency Session" 
          icon="pi pi-exclamation-circle"
          @click="quickAction('emergency-session')"
          severity="danger"
          class="w-full"
        />
        <Button 
          label="Incident Report" 
          icon="pi pi-exclamation-triangle"
          @click="quickAction('incident-report')"
          severity="warning"
          class="w-full"
        />
        <Button 
          label="Parent Communication" 
          icon="pi pi-phone"
          @click="quickAction('parent-contact')"
          severity="info"
          class="w-full"
        />
      </div>
    </Sidebar>
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
const metrics = ref({});
const recentCases = ref([]);
const todaySessions = ref([]);
const priorityAlerts = ref([]);
const showQuickActions = ref(false);

// Chart data
const caseDistributionData = ref({
  labels: ['Academic', 'Behavioral', 'Mental Health', 'Family/Social'],
  datasets: [{
    data: [30, 25, 20, 25],
    backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981']
  }]
});

const monthlyTrendsData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Cases',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      label: 'Sessions',
      data: [8, 15, 20, 18, 25, 28],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)'
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
});

const lineChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
      position: 'top'
    }
  }
});

// Methods
const loadDashboardData = () => {
  // Load key metrics
  guidanceService.getDashboardMetrics(
    (response) => {
      if (response.success) {
        metrics.value = response.data.data;
        caseDistributionData.value.datasets[0].data = [
          metrics.value.academicCases || 0,
          metrics.value.behavioralCases || 0,
          metrics.value.mentalHealthCases || 0,
          metrics.value.familySocialCases || 0
        ];
      }
    }
  );

  // Load recent cases
  guidanceService.getRecentCases(
    (response) => {
      if (response.success) {
        recentCases.value = response.data.data;
      }
    }
  );

  // Load today's sessions
  guidanceService.getTodaySessions(
    (response) => {
      if (response.success) {
        todaySessions.value = response.data.data;
      }
    }
  );

  // Load priority alerts
  loadPriorityAlerts();
};

const loadPriorityAlerts = () => {
  // Mock data - replace with actual API call
  priorityAlerts.value = [
    {
      id: 1,
      level: 'high',
      title: 'Critical Incident Requires Attention',
      message: 'Case #GC-2024-001 has an unresolved critical incident.',
      date: new Date().toISOString()
    },
    {
      id: 2,
      level: 'medium',
      title: 'Follow-up Required',
      message: '3 parent contacts require follow-up within 24 hours.',
      date: new Date().toISOString()
    },
    {
      id: 3,
      level: 'low',
      title: 'Session Reminder',
      message: 'Tomorrow you have 5 scheduled counseling sessions.',
      date: new Date().toISOString()
    }
  ];
};

const refreshAlerts = () => {
  loadPriorityAlerts();
  toast.add({
    severity: 'success',
    summary: 'Refreshed',
    detail: 'Priority alerts updated',
    life: 2000
  });
};

const quickAction = (action) => {
  showQuickActions.value = false;
  
  switch (action) {
    case 'new-case':
      router.push('/guidance/cases/create');
      break;
    case 'emergency-session':
      router.push('/guidance/sessions/emergency');
      break;
    case 'incident-report':
      router.push('/guidance/incidents/create');
      break;
    case 'parent-contact':
      router.push('/guidance/parent-contacts/create');
      break;
  }
};

const exportReport = () => {
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Dashboard report export functionality coming soon',
    life: 3000
  });
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

const getPrioritySeverity = (priority) => {
  switch (priority) {
    case 'URGENT': return 'danger';
    case 'HIGH': return 'warning';
    case 'MEDIUM': return 'info';
    case 'LOW': return 'secondary';
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

const getSessionStatusSeverity = (status) => {
  switch (status) {
    case 'SCHEDULED': return 'info';
    case 'IN_PROGRESS': return 'warning';
    case 'COMPLETED': return 'success';
    case 'CANCELLED': return 'danger';
    default: return 'secondary';
  }
};

const getAlertClass = (level) => {
  switch (level) {
    case 'high': return 'border-red-400 bg-red-50';
    case 'medium': return 'border-yellow-400 bg-yellow-50';
    case 'low': return 'border-blue-400 bg-blue-50';
    default: return 'border-gray-400 bg-gray-50';
  }
};

const getAlertIcon = (level) => {
  switch (level) {
    case 'high': return 'pi pi-exclamation-triangle text-red-500';
    case 'medium': return 'pi pi-exclamation-circle text-yellow-500';
    case 'low': return 'pi pi-info-circle text-blue-500';
    default: return 'pi pi-info-circle text-gray-500';
  }
};

// Lifecycle
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
  .card:last-child {
      margin-bottom: none!important;
  }
</style>
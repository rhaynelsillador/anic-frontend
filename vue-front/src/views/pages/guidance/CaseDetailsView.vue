<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Case Details</h1>
        <p class="text-gray-600 mt-1">{{ caseData?.caseNumber }} - {{ caseData?.studentName }}</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="Edit Case" 
          icon="pi pi-pencil"
          @click="editCase"
          severity="warning"
        />
        <Button 
          label="Schedule Session" 
          icon="pi pi-calendar-plus"
          @click="scheduleSession"
          severity="success"
        />
        <Button 
          label="Add Incident" 
          icon="pi pi-exclamation-triangle"
          @click="addIncident"
          severity="danger"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Case Information -->
      <div class="lg:col-span-2">
        <div class="card mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Case Information</h3>
            <div class="flex gap-2">
              <Tag 
                :value="caseData?.status" 
                :severity="getStatusSeverity(caseData?.status)"
              />
              <Tag 
                :value="caseData?.priority" 
                :severity="getPrioritySeverity(caseData?.priority)"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Case Number</label>
              <p class="text-gray-900">{{ caseData?.caseNumber }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Tag 
                :value="caseData?.category" 
                :severity="getCategorySeverity(caseData?.category)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Reported</label>
              <p class="text-gray-900">{{ formatDate(caseData?.dateReported) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Assigned Counselor</label>
              <p class="text-gray-900">{{ caseData?.assignedCounselorName }}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p class="text-gray-900 whitespace-pre-wrap">{{ caseData?.description }}</p>
          </div>
        </div>

        <!-- Sessions Tab -->
        <TabView>
          <TabPanel header="Sessions">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-semibold">Counseling Sessions</h4>
              <Button 
                label="Add Session" 
                icon="pi pi-plus"
                size="small"
                @click="addSession"
              />
            </div>
            
            <DataTable :value="sessions" class="p-datatable-sm">
              <Column field="sessionNumber" header="Session #" />
              <Column field="sessionDate" header="Date">
                <template #body="{ data }">
                  {{ formatDate(data.sessionDate) }}
                </template>
              </Column>
              <Column field="duration" header="Duration" />
              <Column field="sessionType" header="Type" />
              <Column field="status" header="Status">
                <template #body="{ data }">
                  <Tag 
                    :value="data.status" 
                    :severity="getSessionStatusSeverity(data.status)"
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
                      @click="viewSession(data)"
                    />
                    <Button 
                      icon="pi pi-pencil" 
                      size="small"
                      severity="warning"
                      @click="editSession(data)"
                      v-if="data.status !== 'COMPLETED'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </TabPanel>

          <TabPanel header="Incidents">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-semibold">Incident Reports</h4>
              <Button 
                label="Add Incident" 
                icon="pi pi-plus"
                size="small"
                severity="danger"
                @click="addIncident"
              />
            </div>
            
            <DataTable :value="incidents" class="p-datatable-sm">
              <Column field="incidentDate" header="Date">
                <template #body="{ data }">
                  {{ formatDate(data.incidentDate) }}
                </template>
              </Column>
              <Column field="incidentType" header="Type" />
              <Column field="severity" header="Severity">
                <template #body="{ data }">
                  <Tag 
                    :value="data.severity" 
                    :severity="getIncidentSeverity(data.severity)"
                  />
                </template>
              </Column>
              <Column field="reportedBy" header="Reported By" />
              <Column header="Actions">
                <template #body="{ data }">
                  <Button 
                    icon="pi pi-eye" 
                    size="small"
                    severity="info"
                    @click="viewIncident(data)"
                  />
                </template>
              </Column>
            </DataTable>
          </TabPanel>

          <TabPanel header="Interventions">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-semibold">Intervention Plans</h4>
              <Button 
                label="Add Intervention" 
                icon="pi pi-plus"
                size="small"
                severity="success"
                @click="addIntervention"
              />
            </div>
            
            <DataTable :value="interventions" class="p-datatable-sm">
              <Column field="interventionType" header="Type" />
              <Column field="startDate" header="Start Date">
                <template #body="{ data }">
                  {{ formatDate(data.startDate) }}
                </template>
              </Column>
              <Column field="targetDate" header="Target Date">
                <template #body="{ data }">
                  {{ formatDate(data.targetDate) }}
                </template>
              </Column>
              <Column field="status" header="Status">
                <template #body="{ data }">
                  <Tag 
                    :value="data.status" 
                    :severity="getInterventionStatusSeverity(data.status)"
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
                    />
                    <Button 
                      icon="pi pi-pencil" 
                      size="small"
                      severity="warning"
                      @click="editIntervention(data)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </TabPanel>

          <TabPanel header="Parent Contacts">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-semibold">Parent/Guardian Contacts</h4>
              <Button 
                label="Add Contact" 
                icon="pi pi-plus"
                size="small"
                @click="addParentContact"
              />
            </div>
            
            <DataTable :value="parentContacts" class="p-datatable-sm">
              <Column field="contactDate" header="Date">
                <template #body="{ data }">
                  {{ formatDate(data.contactDate) }}
                </template>
              </Column>
              <Column field="contactType" header="Type" />
              <Column field="parentName" header="Parent/Guardian" />
              <Column field="contactedBy" header="Contacted By" />
              <Column header="Actions">
                <template #body="{ data }">
                  <Button 
                    icon="pi pi-eye" 
                    size="small"
                    severity="info"
                    @click="viewParentContact(data)"
                  />
                </template>
              </Column>
            </DataTable>
          </TabPanel>
        </TabView>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Student Information -->
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Student Information</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <p class="text-gray-900">{{ caseData?.studentName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Student ID</label>
              <p class="text-gray-900">{{ caseData?.studentId }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Grade/Year</label>
              <p class="text-gray-900">{{ caseData?.yearLevel }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Section</label>
              <p class="text-gray-900">{{ caseData?.section }}</p>
            </div>
          </div>
        </div>

        <!-- Case Statistics -->
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Case Statistics</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Sessions:</span>
              <span class="font-medium">{{ sessions?.length || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Incidents:</span>
              <span class="font-medium">{{ incidents?.length || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Interventions:</span>
              <span class="font-medium">{{ interventions?.length || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Parent Contacts:</span>
              <span class="font-medium">{{ parentContacts?.length || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
          <Timeline :value="recentActivity" class="w-full">
            <template #content="{ item }">
              <div class="p-2">
                <small class="text-gray-500">{{ formatDate(item.date) }}</small>
                <p class="text-sm">{{ item.description }}</p>
              </div>
            </template>
          </Timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import GuidanceService from '@/service/guidance';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const guidanceService = new GuidanceService();

// Data
const caseData = ref(null);
const sessions = ref([]);
const incidents = ref([]);
const interventions = ref([]);
const parentContacts = ref([]);
const recentActivity = ref([]);
const loading = ref(false);

// Methods
const loadCaseDetails = () => {
  const caseId = route.params.id;
  loading.value = true;

  guidanceService.getCaseById(caseId,
    (response) => {
      if (response.success) {
        caseData.value = response.data.data;
        loadCaseRelatedData(caseId);
      }
      loading.value = false;
    }
  );
};

const loadCaseRelatedData = (caseId) => {
  // Load sessions
  guidanceService.getSessionsByCaseId(caseId,
    (response) => {
      if (response.success) {
        sessions.value = response.data.data;
      }
    }
  );

  // Load incidents
  guidanceService.getCaseIncidents(caseId,
    (response) => {
      if (response.success) {
        incidents.value = response.data.data;
      }
    }
  );

  // Load interventions
  guidanceService.getCaseInterventions(caseId,
    (response) => {
      if (response.success) {
        interventions.value = response.data;
      }
    }
  );

  // Load parent contacts
  guidanceService.getCaseParentContacts(caseId,
    (response) => {
      if (response.success) {
        parentContacts.value = response.data;
      }
    }
  );

  // Load recent activity
  loadRecentActivity(caseId);
};

const loadRecentActivity = (caseId) => {
  // Mock data - replace with actual API call
  recentActivity.value = [
    {
      date: new Date().toISOString(),
      description: 'Case status updated to In Progress'
    },
    {
      date: new Date(Date.now() - 86400000).toISOString(),
      description: 'New counseling session scheduled'
    }
  ];
};

// Navigation methods
const editCase = () => {
  router.push(`/guidance/cases/${route.params.id}/edit`);
};

const scheduleSession = () => {
  router.push(`/guidance/cases/${route.params.id}/schedule-session`);
};

const addSession = () => {
  router.push(`/guidance/cases/${route.params.id}/add-session`);
};

const addIncident = () => {
  router.push(`/guidance/cases/${route.params.id}/add-incident`);
};

const addIntervention = () => {
  router.push(`/guidance/cases/${route.params.id}/add-intervention`);
};

const addParentContact = () => {
  router.push(`/guidance/cases/${route.params.id}/add-parent-contact`);
};

// View methods
const viewSession = (session) => {
  router.push(`/guidance/sessions/${session.id}`);
};

const editSession = (session) => {
  router.push(`/guidance/cases/${route.params.id}/sessions/${session.id}/edit`);
};

const viewIncident = (incident) => {
  router.push(`/guidance/incidents/${incident.id}`);
};

const viewIntervention = (intervention) => {
  router.push(`/guidance/interventions/${intervention.id}`);
};

const editIntervention = (intervention) => {
  router.push(`/guidance/interventions/${intervention.id}/edit`);
};

const viewParentContact = (contact) => {
  router.push(`/guidance/parent-contacts/${contact.id}`);
};

// Utility methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
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

const getCategorySeverity = (category) => {
  switch (category) {
    case 'ACADEMIC': return 'info';
    case 'BEHAVIORAL': return 'warning';
    case 'MENTAL_HEALTH': return 'danger';
    case 'FAMILY_SOCIAL': return 'secondary';
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

const getIncidentSeverity = (severity) => {
  switch (severity) {
    case 'MINOR': return 'info';
    case 'MODERATE': return 'warning';
    case 'MAJOR': return 'danger';
    case 'CRITICAL': return 'danger';
    default: return 'secondary';
  }
};

const getInterventionStatusSeverity = (status) => {
  switch (status) {
    case 'PLANNED': return 'info';
    case 'ACTIVE': return 'warning';
    case 'COMPLETED': return 'success';
    case 'CANCELLED': return 'danger';
    default: return 'secondary';
  }
};

// Lifecycle
onMounted(() => {
  loadCaseDetails();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold text-gray-900">Case Session Details</h1>
            <Tag :value="session?.status" :severity="getSessionStatusSeverity(session?.status)" class="text-sm" />
          </div>
          <p class="text-lg text-gray-600">
            <span class="font-medium">{{ caseData?.caseNumber }}</span> - {{ caseData?.studentName }}
          </p>
          <div class="flex items-center gap-2 mt-2">
            <i class="pi pi-calendar text-gray-400"></i>
            <DateTimeComponent :data="session?.sessionDate" formatter="MMMM DD, YYYY [at] hh:mm A" />
          </div>
        </div>
        <div class="flex gap-3">
          <Button 
            label="Back" 
            icon="pi pi-arrow-left" 
            @click="() => $router.go(-1)" 
            severity="secondary" 
            outlined
          />
          <Button 
            label="Edit Session" 
            icon="pi pi-pencil" 
            :disabled="session?.status === 'COMPLETED'"
            @click="editSession" 
            severity="warning" 
            outlined
          />
          <Button 
            label="Add Incident" 
            icon="pi pi-exclamation-triangle" 
            @click="addIncident" 
            severity="danger" 
            :disabled="session?.status === 'COMPLETED'"
            outlined
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Main Content -->
      <div class="xl:col-span-3 space-y-6">
        <!-- Case Information Card -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="border-b border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <i class="pi pi-folder text-blue-500"></i>
                Case Information
              </h2>
              <div class="flex gap-2">
                <Tag :value="caseData?.status" :severity="getStatusSeverity(caseData?.status)" />
                <Tag :value="caseData?.priority" :severity="getPrioritySeverity(caseData?.priority)" />
                <Tag :value="caseData?.category" :severity="getCategorySeverity(caseData?.category)" />
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Case Number</label>
                <p class="text-lg font-semibold text-gray-900">{{ caseData?.caseNumber }}</p>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Date Reported</label>
                <p class="text-gray-900">
                  <DateTimeComponent :data="caseData?.dateReported" formatter="MMM DD, YYYY" />
                </p>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Assigned Counselor</label>
                <p class="text-gray-900">{{ caseData?.assignedCounselorName || 'Not assigned' }}</p>
              </div>
            </div>

            <div class="mt-6">
              <label class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 block">Case Description</label>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ caseData?.description || 'No description provided' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Session Details Card -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="border-b border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-users text-green-500"></i>
              Session Details
            </h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Session Number</label>
                <p class="text-lg font-semibold text-gray-900">{{ session?.sessionNumber || 'N/A' }}</p>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Session Type</label>
                <p class="text-gray-900">{{ session?.sessionType || 'Not specified' }}</p>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</label>
                <p class="text-gray-900 flex items-center gap-1">
                  <i class="pi pi-map-marker text-gray-400"></i>
                  {{ session?.location || 'Not specified' }}
                </p>
              </div>
            </div>

            <!-- Session Content Sections -->
            <div class="space-y-6">
              <!-- Purpose -->
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 block">Session Purpose</label>
                <div class="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
                  <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ session?.purpose || 'No purpose specified' }}</p>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 block">Session Description</label>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ session?.description || 'No description provided' }}</p>
                </div>
              </div>

              <!-- Pre-session Notes -->
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 block">Pre-session Notes</label>
                <div class="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
                  <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ session?.notes || 'No notes provided' }}</p>
                </div>
              </div>

              <!-- Completed Session Details -->
              <div v-if="session?.status === 'COMPLETED'" class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="pi pi-check-circle text-green-500"></i>
                  Session Outcomes
                </h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 block">Recommended Interventions</label>
                    <div class="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-4">
                      <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ session?.recommendedInterventions || 'No interventions recommended' }}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 block">Student Response</label>
                    <div class="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-4">
                      <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ session?.studentResponse || 'No response recorded' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Session Options -->
              <div class="border-t pt-6">
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 block">Session Options</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="flex items-center p-3 rounded-lg border" :class="session?.notifyParent ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'">
                    <div class="flex-shrink-0 mr-3">
                      <i :class="session?.notifyParent ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-gray-400'"></i>
                    </div>
                    <span class="text-sm font-medium">Notify Parent/Guardian</span>
                  </div>
                  
                  <div class="flex items-center p-3 rounded-lg border" :class="session?.followUpRequired ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'">
                    <div class="flex-shrink-0 mr-3">
                      <i :class="session?.followUpRequired ? 'pi pi-check-circle text-orange-500' : 'pi pi-times-circle text-gray-400'"></i>
                    </div>
                    <span class="text-sm font-medium">Follow-up Required</span>
                  </div>
                  
                  <div class="flex items-center p-3 rounded-lg border" :class="session?.priority ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'">
                    <div class="flex-shrink-0 mr-3">
                      <i :class="session?.priority ? 'pi pi-check-circle text-red-500' : 'pi pi-times-circle text-gray-400'"></i>
                    </div>
                    <span class="text-sm font-medium">High Priority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Student Information Card -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="border-b border-gray-200 p-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-user text-blue-500"></i>
              Student Information
            </h3>
          </div>
          
          <div class="p-4 space-y-4">
            <div class="text-center pb-4 border-b">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i class="pi pi-user text-2xl text-blue-600"></i>
              </div>
              <h4 class="font-semibold text-gray-900">{{ caseData?.studentName }}</h4>
            </div>
            
            <div class="space-y-3">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Student ID</label>
                <p class="text-sm font-medium text-gray-900">{{ caseData?.studentId || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Grade/Year</label>
                <p class="text-sm text-gray-900">{{ caseData?.yearLevel || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Section</label>
                <p class="text-sm text-gray-900">{{ caseData?.section || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="border-b border-gray-200 p-4">
            <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          
          <div class="p-4 space-y-3">
            <Button 
              label="View Case Details" 
              icon="pi pi-eye" 
              @click="() => router.push(`/guidance/cases/${caseData?.id}`)"
              severity="info" 
              outlined 
              class="w-full justify-center"
            />
            <Button 
              label="Schedule Follow-up" 
              icon="pi pi-calendar-plus" 
              severity="success" 
              outlined 
              class="w-full justify-center"
              @click="() => router.push(`/guidance/cases/${caseData?.id}/add-session?type=FOLLOWUP`)"
            />
            <Button 
              label="Print Session" 
              icon="pi pi-print" 
              severity="secondary" 
              outlined 
              class="w-full justify-center"
            />
          </div>
        </div>

        <!-- Session Timeline -->
        <div class="bg-white rounded-lg shadow-sm border" v-if="session?.status === 'COMPLETED'">
          <div class="border-b border-gray-200 p-4">
            <h3 class="text-lg font-semibold text-gray-900">Session Timeline</h3>
          </div>
          
          <div class="p-4">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div class="text-sm">
                  <p class="font-medium">Session Scheduled</p>
                  <p class="text-gray-500">
                    <DateTimeComponent :data="session?.createdAt" formatter="MMM DD, YYYY" />
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <div class="text-sm">
                  <p class="font-medium">Session Completed</p>
                  <p class="text-gray-500">
                    <DateTimeComponent :data="session?.endOfSession" formatter="MMM DD, YYYY" />
                  </p>
                </div>
              </div>
            </div>
          </div>
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
import DateTimeComponent from '@/components/DateTimeComponent.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const guidanceService = new GuidanceService();

// Data
const caseData = ref(null);
const session = ref({
  description: null,
  purpose: null,
  notes: null,
  sessionNumber: null,
  sessionDate: null,
  sessionType: null,
  location: null,
  status: null,
  caseId: null,
  notifyParent: false,
  followUpRequired: false,
  priority: null
});
const incidents = ref([]);
const interventions = ref([]);
const parentContacts = ref([]);
const recentActivity = ref([]);
const loading = ref(false);

// Methods
const loadCaseSessionDetails = () => {
  const sessionId = route.params.id;
  loading.value = true;

  guidanceService.getSessionsById(sessionId,
    (response) => {
      if (response.success) {
        session.value = response.data.data;
        loadCaseRelatedData(session.value.caseId);
      }
      loading.value = false;
    }
  );
};

const loadCaseRelatedData = (caseId) => {
  // Load sessions
  guidanceService.getCaseById(caseId,
    (response) => {
      if (response.success) {
        caseData.value = response.data.data;
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
};


const addIncident = () => {
  router.push(`/guidance/cases/${route.params.id}/add-incident`);
};

// View methods
const viewSession = (session) => {
  router.push(`/guidance/sessions/${session.id}`);
};

const editSession = (session) => {
  router.push(`/guidance/cases/${caseData.value.id}/sessions/${route.params.id}/edit`);
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
  loadCaseSessionDetails();
});
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border;
}
</style>
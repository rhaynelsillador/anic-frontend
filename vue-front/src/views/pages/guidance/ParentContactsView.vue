<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Parent/Guardian Contacts</h1>
        <p class="text-gray-600 mt-1">Track communication with parents and guardians</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="New Contact" 
          icon="pi pi-phone"
          @click="$router.push('/guidance/contacts/create')"
          severity="success"
        />
        <Button 
          label="Contact Log" 
          icon="pi pi-file-pdf"
          @click="generateContactLog"
          severity="secondary"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card bg-blue-50 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-blue-600">This Week</h3>
            <p class="text-2xl font-bold text-blue-700">{{ statistics.thisWeek || 0 }}</p>
          </div>
          <i class="pi pi-calendar text-2xl text-blue-500"></i>
        </div>
      </div>
      
      <div class="card bg-green-50 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-green-600">This Month</h3>
            <p class="text-2xl font-bold text-green-700">{{ statistics.thisMonth || 0 }}</p>
          </div>
          <i class="pi pi-chart-bar text-2xl text-green-500"></i>
        </div>
      </div>
      
      <div class="card bg-orange-50 border border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-orange-600">Follow-ups Due</h3>
            <p class="text-2xl font-bold text-orange-700">{{ statistics.followupsDue || 0 }}</p>
          </div>
          <i class="pi pi-clock text-2xl text-orange-500"></i>
        </div>
      </div>
      
      <div class="card bg-purple-50 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-purple-600">Total Contacts</h3>
            <p class="text-2xl font-bold text-purple-700">{{ statistics.total || 0 }}</p>
          </div>
          <i class="pi pi-users text-2xl text-purple-500"></i>
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
            placeholder="Search contacts..."
            class="w-full"
            @keyup.enter="searchContacts"
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
          @date-select="filterContacts"
        />
      </div>
      
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Contact Type</span>
        <Dropdown 
          v-model="selectedType" 
          :options="typeOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Types"
          class="w-full"
          @change="filterContacts"
        />
      </div>
      
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Purpose</span>
        <Dropdown 
          v-model="selectedPurpose" 
          :options="purposeOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All Purposes"
          class="w-full"
          @change="filterContacts"
        />
      </div>
      
      <div class="field">
        <span class="block text-sm font-medium text-gray-700 mb-2">Follow-up Status</span>
        <Dropdown 
          v-model="selectedFollowup" 
          :options="followupOptions" 
          optionLabel="label" 
          optionValue="value"
          placeholder="All"
          class="w-full"
          @change="filterContacts"
        />
      </div>
    </div>

    <!-- Contacts Table -->
    <DataTable 
      :value="contacts" 
      :loading="loading"
      :paginator="true" 
      :rows="pageSize"
      :totalRecords="totalRecords"
      :lazy="true"
      @page="onPageChange"
      sortMode="single"
      class="p-datatable-sm"
    >
      <Column field="contactDate" header="Date & Time" sortable>
        <template #body="{ data }">
          <div>
            <div>{{ formatDate(data.contactDate) }}</div>
            <small class="text-gray-500">{{ formatTime(data.contactDate) }}</small>
          </div>
        </template>
      </Column>
      
      <Column field="studentName" header="Student" sortable />
      
      <Column field="parentName" header="Parent/Guardian" sortable>
        <template #body="{ data }">
          <div>
            <div class="font-medium">{{ data.parentName }}</div>
            <small class="text-gray-500">{{ data.relationship }}</small>
          </div>
        </template>
      </Column>
      
      <Column field="contactType" header="Contact Type" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.contactType" 
            :severity="getTypeSeverity(data.contactType)"
          />
        </template>
      </Column>
      
      <Column field="purpose" header="Purpose" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.purpose" 
            :severity="getPurposeSeverity(data.purpose)"
          />
        </template>
      </Column>
      
      <Column field="contactedBy" header="Contacted By" sortable />
      
      <Column field="followupRequired" header="Follow-up" sortable>
        <template #body="{ data }">
          <div v-if="data.followupRequired">
            <Tag 
              :value="data.followupStatus || 'PENDING'" 
              :severity="getFollowupSeverity(data.followupStatus)"
            />
            <div v-if="data.followupDate" class="text-xs text-gray-500 mt-1">
              Due: {{ formatDate(data.followupDate) }}
            </div>
          </div>
          <span v-else class="text-gray-400">None</span>
        </template>
      </Column>
      
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-eye" 
              size="small"
              severity="info"
              @click="viewContact(data)"
              v-tooltip="'View Details'"
            />
            <Button 
              icon="pi pi-pencil" 
              size="small"
              severity="warning"
              @click="editContact(data)"
              v-tooltip="'Edit Contact'"
            />
            <Button 
              icon="pi pi-phone" 
              size="small"
              severity="success"
              @click="createFollowup(data)"
              v-tooltip="'Schedule Follow-up'"
              v-if="!data.followupRequired"
            />
            <Button 
              icon="pi pi-check" 
              size="small"
              severity="success"
              @click="completeFollowup(data)"
              v-tooltip="'Complete Follow-up'"
              v-if="data.followupRequired && data.followupStatus === 'PENDING'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Create Contact Dialog -->
    <Dialog 
      v-model:visible="showCreateDialog" 
      :modal="true" 
      header="Record Parent/Guardian Contact"
      :style="{ width: '50rem' }"
    >
      <CreateContactForm 
        @contact-created="onContactCreated"
        @cancel="showCreateDialog = false"
      />
    </Dialog>

    <!-- Contact Details Dialog -->
    <Dialog 
      v-model:visible="showDetailsDialog" 
      :modal="true" 
      header="Contact Details"
      :style="{ width: '50rem' }"
    >
      <ContactDetails 
        :contact="selectedContact"
        @edit="editFromDetails"
        @close="showDetailsDialog = false"
      />
    </Dialog>

    <!-- Schedule Follow-up Dialog -->
    <Dialog 
      v-model:visible="showFollowupDialog" 
      :modal="true" 
      header="Schedule Follow-up"
      :style="{ width: '40rem' }"
    >
      <ScheduleFollowupForm 
        :contact="selectedContact"
        @followup-scheduled="onFollowupScheduled"
        @cancel="showFollowupDialog = false"
      />
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
const contacts = ref([]);
const statistics = ref({});
const loading = ref(false);
const showCreateDialog = ref(false);
const showDetailsDialog = ref(false);
const showFollowupDialog = ref(false);
const selectedContact = ref(null);

// Pagination
const pageSize = ref(10);
const currentPage = ref(0);
const totalRecords = ref(0);

// Filters
const searchTerm = ref('');
const dateRange = ref(null);
const selectedType = ref(null);
const selectedPurpose = ref(null);
const selectedFollowup = ref(null);

// Options
const typeOptions = [
  { label: 'Phone Call', value: 'PHONE_CALL' },
  { label: 'Email', value: 'EMAIL' },
  { label: 'In-Person Meeting', value: 'IN_PERSON' },
  { label: 'Home Visit', value: 'HOME_VISIT' },
  { label: 'Written Notice', value: 'WRITTEN_NOTICE' },
  { label: 'Video Call', value: 'VIDEO_CALL' }
];

const purposeOptions = [
  { label: 'Academic Concern', value: 'ACADEMIC_CONCERN' },
  { label: 'Behavioral Issue', value: 'BEHAVIORAL_ISSUE' },
  { label: 'Progress Update', value: 'PROGRESS_UPDATE' },
  { label: 'Attendance Issue', value: 'ATTENDANCE_ISSUE' },
  { label: 'Health/Medical', value: 'HEALTH_MEDICAL' },
  { label: 'Parent Conference', value: 'PARENT_CONFERENCE' },
  { label: 'Emergency Contact', value: 'EMERGENCY_CONTACT' },
  { label: 'General Information', value: 'GENERAL_INFORMATION' }
];

const followupOptions = [
  { label: 'Required', value: 'required' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Overdue', value: 'OVERDUE' }
];

// Methods
const loadContacts = (page = 0) => {
  loading.value = true;
  
  const params = {
    page,
    size: pageSize.value,
    sortBy: 'contactDate',
    sortDir: 'desc'
  };

  guidanceService.getAllParentContacts(params,
    (response) => {
      if (response.success) {
        contacts.value = response.data.content;
        totalRecords.value = response.data.totalElements;
      }
      loading.value = false;
    },
    (error) => {
      console.error('Error loading contacts:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load parent contacts',
        life: 3000
      });
      loading.value = false;
    }
  );
};

const loadStatistics = () => {
  guidanceService.getParentContactStatistics(
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

const searchContacts = () => {
  if (searchTerm.value.trim()) {
    loading.value = true;
    guidanceService.searchParentContacts(searchTerm.value, { page: 0, size: pageSize.value },
      (response) => {
        if (response.success) {
          contacts.value = response.data.content;
          totalRecords.value = response.data.totalElements;
        }
        loading.value = false;
      },
      (error) => {
        console.error('Error searching contacts:', error);
        loading.value = false;
      }
    );
  } else {
    loadContacts();
  }
};

const filterContacts = () => {
  loadContacts();
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadContacts(event.page);
};

const viewContact = (contact) => {
  selectedContact.value = { ...contact };
  showDetailsDialog.value = true;
};

const editContact = (contact) => {
  router.push(`/guidance/parent-contacts/${contact.id}/edit`);
};

const editFromDetails = () => {
  showDetailsDialog.value = false;
  editContact(selectedContact.value);
};

const createFollowup = (contact) => {
  selectedContact.value = { ...contact };
  showFollowupDialog.value = true;
};

const completeFollowup = (contact) => {
  loading.value = true;
  
  guidanceService.updateFollowupStatus(contact.id, 'COMPLETED',
    (response) => {
      if (response.success) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Follow-up marked as completed',
          life: 3000
        });
        loadContacts();
        loadStatistics();
      }
      loading.value = false;
    },
    (error) => {
      console.error('Error completing follow-up:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to complete follow-up',
        life: 3000
      });
      loading.value = false;
    }
  );
};

const generateContactLog = () => {
  toast.add({
    severity: 'info',
    summary: 'Generate Log',
    detail: 'Contact log generation functionality coming soon',
    life: 3000
  });
};

const onContactCreated = (newContact) => {
  showCreateDialog.value = false;
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Parent contact recorded successfully',
    life: 3000
  });
  loadContacts();
  loadStatistics();
};

const onFollowupScheduled = (updatedContact) => {
  showFollowupDialog.value = false;
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Follow-up scheduled successfully',
    life: 3000
  });
  loadContacts();
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

const getTypeSeverity = (type) => {
  switch (type) {
    case 'PHONE_CALL': return 'info';
    case 'EMAIL': return 'secondary';
    case 'IN_PERSON': return 'success';
    case 'HOME_VISIT': return 'warning';
    case 'WRITTEN_NOTICE': return 'info';
    case 'VIDEO_CALL': return 'secondary';
    default: return 'info';
  }
};

const getPurposeSeverity = (purpose) => {
  switch (purpose) {
    case 'ACADEMIC_CONCERN': return 'warning';
    case 'BEHAVIORAL_ISSUE': return 'danger';
    case 'PROGRESS_UPDATE': return 'success';
    case 'ATTENDANCE_ISSUE': return 'warning';
    case 'HEALTH_MEDICAL': return 'danger';
    case 'PARENT_CONFERENCE': return 'info';
    case 'EMERGENCY_CONTACT': return 'danger';
    case 'GENERAL_INFORMATION': return 'secondary';
    default: return 'info';
  }
};

const getFollowupSeverity = (status) => {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'COMPLETED': return 'success';
    case 'OVERDUE': return 'danger';
    default: return 'info';
  }
};

// Lifecycle
onMounted(() => {
  loadContacts();
  loadStatistics();
});
</script>

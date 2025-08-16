<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Guidance Settings</h1>
        <p class="text-gray-600 mt-1">Configure guidance and counseling system preferences</p>
      </div>
      <Button 
        label="Back to Dashboard" 
        icon="pi pi-arrow-left"
        @click="$router.push('/guidance')"
        severity="secondary"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <Card>
          <template #title>Settings Categories</template>
          <template #content>
            <div class="space-y-2">
              <div 
                v-for="category in settingsCategories" 
                :key="category.key"
                @click="activeCategory = category.key"
                :class="[
                  'flex items-center p-3 rounded cursor-pointer transition-colors',
                  activeCategory === category.key 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50'
                ]"
              >
                <i :class="category.icon" class="mr-3"></i>
                <span>{{ category.label }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2">
        <!-- General Settings -->
        <Card v-if="activeCategory === 'general'">
          <template #title>General Settings</template>
          <template #content>
            <form @submit.prevent="saveSettings" class="space-y-4">
              <div class="field">
                <label for="schoolName" class="block text-sm font-medium mb-2">School Name</label>
                <InputText 
                  id="schoolName"
                  v-model="settings.general.schoolName" 
                  placeholder="Enter school name"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label for="guidanceOffice" class="block text-sm font-medium mb-2">Guidance Office Location</label>
                <InputText 
                  id="guidanceOffice"
                  v-model="settings.general.guidanceOfficeLocation" 
                  placeholder="e.g., Building A, Room 101"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label for="workingHours" class="block text-sm font-medium mb-2">Office Hours</label>
                <InputText 
                  id="workingHours"
                  v-model="settings.general.workingHours" 
                  placeholder="e.g., 8:00 AM - 5:00 PM"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label for="contactPhone" class="block text-sm font-medium mb-2">Contact Phone</label>
                <InputText 
                  id="contactPhone"
                  v-model="settings.general.contactPhone" 
                  placeholder="Enter contact phone number"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label for="contactEmail" class="block text-sm font-medium mb-2">Contact Email</label>
                <InputText 
                  id="contactEmail"
                  v-model="settings.general.contactEmail" 
                  placeholder="Enter contact email"
                  type="email"
                  class="w-full"
                />
              </div>
              
              <Button 
                label="Save General Settings" 
                type="submit"
                :loading="loading"
                severity="success"
              />
            </form>
          </template>
        </Card>

        <!-- Case Management Settings -->
        <Card v-if="activeCategory === 'cases'">
          <template #title>Case Management Settings</template>
          <template #content>
            <form @submit.prevent="saveSettings" class="space-y-4">
              <div class="field">
                <label for="caseNumberFormat" class="block text-sm font-medium mb-2">Case Number Format</label>
                <Dropdown 
                  id="caseNumberFormat"
                  v-model="settings.cases.caseNumberFormat" 
                  :options="caseNumberFormats"
                  option-label="label"
                  option-value="value"
                  placeholder="Select format"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label for="autoAssignCounselor" class="block text-sm font-medium mb-2">Auto-assign Counselor</label>
                <div class="flex items-center">
                  <Checkbox 
                    id="autoAssignCounselor"
                    v-model="settings.cases.autoAssignCounselor" 
                    binary
                  />
                  <label for="autoAssignCounselor" class="ml-2">Automatically assign cases to available counselors</label>
                </div>
              </div>
              
              <div class="field">
                <label for="requireParentConsent" class="block text-sm font-medium mb-2">Parent Consent</label>
                <div class="flex items-center">
                  <Checkbox 
                    id="requireParentConsent"
                    v-model="settings.cases.requireParentConsent" 
                    binary
                  />
                  <label for="requireParentConsent" class="ml-2">Require parent consent for counseling sessions</label>
                </div>
              </div>
              
              <div class="field">
                <label for="caseFollowUpDays" class="block text-sm font-medium mb-2">Default Follow-up Period (days)</label>
                <InputNumber 
                  id="caseFollowUpDays"
                  v-model="settings.cases.defaultFollowUpDays" 
                  :min="1"
                  :max="365"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label for="priorityEscalation" class="block text-sm font-medium mb-2">Priority Escalation</label>
                <div class="flex items-center">
                  <Checkbox 
                    id="priorityEscalation"
                    v-model="settings.cases.enablePriorityEscalation" 
                    binary
                  />
                  <label for="priorityEscalation" class="ml-2">Automatically escalate case priority after specified days</label>
                </div>
              </div>
              
              <Button 
                label="Save Case Settings" 
                type="submit"
                :loading="loading"
                severity="success"
              />
            </form>
          </template>
        </Card>

        <!-- Notification Settings -->
        <Card v-if="activeCategory === 'notifications'">
          <template #title>Notification Settings</template>
          <template #content>
            <form @submit.prevent="saveSettings" class="space-y-4">
              <h4 class="font-medium text-gray-800">Email Notifications</h4>
              
              <div class="space-y-3">
                <div class="flex items-center">
                  <Checkbox 
                    id="emailNewCase"
                    v-model="settings.notifications.emailNewCase" 
                    binary
                  />
                  <label for="emailNewCase" class="ml-2">New case assignments</label>
                </div>
                
                <div class="flex items-center">
                  <Checkbox 
                    id="emailSessionReminder"
                    v-model="settings.notifications.emailSessionReminder" 
                    binary
                  />
                  <label for="emailSessionReminder" class="ml-2">Session reminders (24 hours before)</label>
                </div>
                
                <div class="flex items-center">
                  <Checkbox 
                    id="emailIncidentReport"
                    v-model="settings.notifications.emailIncidentReport" 
                    binary
                  />
                  <label for="emailIncidentReport" class="ml-2">Critical incident reports</label>
                </div>
                
                <div class="flex items-center">
                  <Checkbox 
                    id="emailOverdueTasks"
                    v-model="settings.notifications.emailOverdueTasks" 
                    binary
                  />
                  <label for="emailOverdueTasks" class="ml-2">Overdue follow-ups and tasks</label>
                </div>
              </div>
              
              <h4 class="font-medium text-gray-800 mt-6">Parent Notifications</h4>
              
              <div class="space-y-3">
                <div class="flex items-center">
                  <Checkbox 
                    id="parentSessionScheduled"
                    v-model="settings.notifications.parentSessionScheduled" 
                    binary
                  />
                  <label for="parentSessionScheduled" class="ml-2">Session scheduled</label>
                </div>
                
                <div class="flex items-center">
                  <Checkbox 
                    id="parentIncidentReport"
                    v-model="settings.notifications.parentIncidentReport" 
                    binary
                  />
                  <label for="parentIncidentReport" class="ml-2">Incident reports involving their child</label>
                </div>
                
                <div class="flex items-center">
                  <Checkbox 
                    id="parentProgressUpdate"
                    v-model="settings.notifications.parentProgressUpdate" 
                    binary
                  />
                  <label for="parentProgressUpdate" class="ml-2">Monthly progress updates</label>
                </div>
              </div>
              
              <Button 
                label="Save Notification Settings" 
                type="submit"
                :loading="loading"
                severity="success"
              />
            </form>
          </template>
        </Card>

        <!-- Privacy Settings -->
        <Card v-if="activeCategory === 'privacy'">
          <template #title>Privacy & Security Settings</template>
          <template #content>
            <form @submit.prevent="saveSettings" class="space-y-4">
              <div class="field">
                <label for="dataRetention" class="block text-sm font-medium mb-2">Data Retention Period (years)</label>
                <InputNumber 
                  id="dataRetention"
                  v-model="settings.privacy.dataRetentionYears" 
                  :min="1"
                  :max="10"
                  class="w-full"
                />
                <small class="text-gray-600">How long to keep closed case records</small>
              </div>
              
              <div class="field">
                <label for="confidentialityLevel" class="block text-sm font-medium mb-2">Default Confidentiality Level</label>
                <Dropdown 
                  id="confidentialityLevel"
                  v-model="settings.privacy.defaultConfidentialityLevel" 
                  :options="confidentialityLevels"
                  option-label="label"
                  option-value="value"
                  placeholder="Select level"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label class="block text-sm font-medium mb-2">Access Controls</label>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <Checkbox 
                      id="requireTwoFactor"
                      v-model="settings.privacy.requireTwoFactorAuth" 
                      binary
                    />
                    <label for="requireTwoFactor" class="ml-2">Require two-factor authentication</label>
                  </div>
                  
                  <div class="flex items-center">
                    <Checkbox 
                      id="logAccess"
                      v-model="settings.privacy.logAllAccess" 
                      binary
                    />
                    <label for="logAccess" class="ml-2">Log all record access attempts</label>
                  </div>
                  
                  <div class="flex items-center">
                    <Checkbox 
                      id="restrictTeacherAccess"
                      v-model="settings.privacy.restrictTeacherAccess" 
                      binary
                    />
                    <label for="restrictTeacherAccess" class="ml-2">Restrict teacher access to case details</label>
                  </div>
                </div>
              </div>
              
              <Button 
                label="Save Privacy Settings" 
                type="submit"
                :loading="loading"
                severity="success"
              />
            </form>
          </template>
        </Card>

        <!-- System Settings -->
        <Card v-if="activeCategory === 'system'">
          <template #title>System Settings</template>
          <template #content>
            <form @submit.prevent="saveSettings" class="space-y-4">
              <div class="field">
                <label for="backupFrequency" class="block text-sm font-medium mb-2">Backup Frequency</label>
                <Dropdown 
                  id="backupFrequency"
                  v-model="settings.system.backupFrequency" 
                  :options="backupFrequencies"
                  option-label="label"
                  option-value="value"
                  placeholder="Select frequency"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label for="sessionTimeout" class="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                <InputNumber 
                  id="sessionTimeout"
                  v-model="settings.system.sessionTimeoutMinutes" 
                  :min="15"
                  :max="480"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label class="block text-sm font-medium mb-2">System Maintenance</label>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <Checkbox 
                      id="autoUpdates"
                      v-model="settings.system.enableAutoUpdates" 
                      binary
                    />
                    <label for="autoUpdates" class="ml-2">Enable automatic system updates</label>
                  </div>
                  
                  <div class="flex items-center">
                    <Checkbox 
                      id="maintenanceMode"
                      v-model="settings.system.maintenanceMode" 
                      binary
                    />
                    <label for="maintenanceMode" class="ml-2">Enable maintenance mode</label>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded">
                <h5 class="font-medium text-gray-800 mb-2">System Information</h5>
                <div class="text-sm text-gray-600 space-y-1">
                  <div>Version: 1.0.0</div>
                  <div>Last Update: August 5, 2025</div>
                  <div>Database Size: 45.2 MB</div>
                  <div>Active Users: 12</div>
                </div>
              </div>
              
              <Button 
                label="Save System Settings" 
                type="submit"
                :loading="loading"
                severity="success"
              />
            </form>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

// Data
const loading = ref(false);
const activeCategory = ref('general');

const settingsCategories = ref([
  { key: 'general', label: 'General', icon: 'pi pi-cog' },
  { key: 'cases', label: 'Case Management', icon: 'pi pi-folder' },
  { key: 'notifications', label: 'Notifications', icon: 'pi pi-bell' },
  { key: 'privacy', label: 'Privacy & Security', icon: 'pi pi-shield' },
  { key: 'system', label: 'System', icon: 'pi pi-server' }
]);

const settings = ref({
  general: {
    schoolName: 'Sample High School',
    guidanceOfficeLocation: 'Building A, Room 101',
    workingHours: '8:00 AM - 5:00 PM',
    contactPhone: '(555) 123-4567',
    contactEmail: 'guidance@school.edu'
  },
  cases: {
    caseNumberFormat: 'GC-YYYY-###',
    autoAssignCounselor: true,
    requireParentConsent: true,
    defaultFollowUpDays: 30,
    enablePriorityEscalation: true
  },
  notifications: {
    emailNewCase: true,
    emailSessionReminder: true,
    emailIncidentReport: true,
    emailOverdueTasks: true,
    parentSessionScheduled: true,
    parentIncidentReport: true,
    parentProgressUpdate: false
  },
  privacy: {
    dataRetentionYears: 7,
    defaultConfidentialityLevel: 'CONFIDENTIAL',
    requireTwoFactorAuth: false,
    logAllAccess: true,
    restrictTeacherAccess: true
  },
  system: {
    backupFrequency: 'DAILY',
    sessionTimeoutMinutes: 60,
    enableAutoUpdates: false,
    maintenanceMode: false
  }
});

// Options
const caseNumberFormats = ref([
  { label: 'GC-YYYY-### (e.g., GC-2025-001)', value: 'GC-YYYY-###' },
  { label: 'YYYY-GC-### (e.g., 2025-GC-001)', value: 'YYYY-GC-###' },
  { label: 'GC### (e.g., GC001)', value: 'GC###' },
  { label: 'Custom Format', value: 'CUSTOM' }
]);

const confidentialityLevels = ref([
  { label: 'Public', value: 'PUBLIC' },
  { label: 'Internal', value: 'INTERNAL' },
  { label: 'Confidential', value: 'CONFIDENTIAL' },
  { label: 'Restricted', value: 'RESTRICTED' }
]);

const backupFrequencies = ref([
  { label: 'Daily', value: 'DAILY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' }
]);

// Methods
const saveSettings = () => {
  loading.value = true;
  
  // Simulate saving settings
  setTimeout(() => {
    loading.value = false;
    toast.add({
      severity: 'success',
      summary: 'Settings Saved',
      detail: 'Your settings have been saved successfully',
      life: 3000
    });
  }, 1000);
};

const loadSettings = () => {
  // Load settings from API or local storage
  // For now, using default values
};

// Lifecycle
onMounted(() => {
  loadSettings();
});
</script>

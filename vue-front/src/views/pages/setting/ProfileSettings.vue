<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import AuthService, { AccountInfo } from '@/types/auth';

const toast = useToast();
const globalStore = useGlobalStore();

const isLoading = ref(false);
const accountInfo = ref<AccountInfo | null>(null);;

onMounted(() => {
  loadUserProfile();
});

const loadUserProfile = () => {
  // Get current user info from global store
  const account = globalStore.loginAccount?.account as any;
  if (!account || !account.id) {
    // If not loaded yet, try to load it
    globalStore.getLoginAccount().then(() => {
      const updatedAccount = globalStore.loginAccount?.account as any;
      if (updatedAccount && updatedAccount.id) {
        fetchUserProfile(updatedAccount.id);
      } else {
        toast.add({
          severity: 'error',
          summary: 'Authentication Error',
          detail: 'Please log in to view profile',
          life: 3000
        });
      }
    }).catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'Unable to determine current user',
        life: 3000
      });
    });
  } else {
    fetchUserProfile(account.id);
  }
};

const fetchUserProfile = (userId: number) => {
  isLoading.value = true;
  const authService = new AuthService();
  
  authService.getUserProfile(
    userId,
    (response) => {
      if (response.status === 'SUCCESS' && response.data) {
        accountInfo.value = response.data as AccountInfo;
      } else {
        toast.add({
          severity: 'error',
          summary: 'Profile Error',
          detail: response.message || 'Failed to load profile',
          life: 3000
        });
      }
      isLoading.value = false;
    },
    (error) => {
      console.error('Failed to load user profile:', error);
      toast.add({
        severity: 'error',
        summary: 'Profile Error',
        detail: 'Failed to load user profile',
        life: 3000
      });
      isLoading.value = false;
    }
  );
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin': return 'p-tag-danger';
    case 'teacher': return 'p-tag-success';
    case 'student': return 'p-tag-info';
    default: return 'p-tag-secondary';
  }
};
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Profile Settings</h1>
      <Button 
        label="Refresh" 
        icon="pi pi-refresh"
        :loading="isLoading"
        @click="loadUserProfile"
        severity="secondary"
      />
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="accountInfo?.account" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Account Information -->
      <div class="space-y-6">
        <div class="card">
          <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <i class="pi pi-user mr-2"></i>
            Account Information
          </h3>
          
          <div class="space-y-4">
            <div class="field">
              <span class="block text-sm font-medium text-gray-700 mb-2">Username</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ accountInfo.account?.username }}
              </div>
            </div>

            <div class="field" v-if="accountInfo.account?.email">
              <span class="block text-sm font-medium text-gray-700 mb-2">Email</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ accountInfo.account?.email }}
              </div>
            </div>

            <div class="field" v-if="accountInfo.account?.fullName">
              <span class="block text-sm font-medium text-gray-700 mb-2">Full Name</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ accountInfo.account?.fullName }}
              </div>
            </div>

            <div class="field">
              <span class="block text-sm font-medium text-gray-700 mb-2">Account Status</span>
              <Tag 
                :value="accountInfo.account?.enabled ? 'Active' : 'Disabled'" 
                :severity="accountInfo.account?.enabled ? 'success' : 'danger'"
              />
            </div>

            <div class="field">
              <span class="block text-sm font-medium text-gray-700 mb-2">Roles</span>
              <div class="flex flex-wrap gap-2">
                <Tag 
                  v-for="role in accountInfo.account?.roles" 
                  :key="role"
                  :value="role"
                  :class="getRoleColor(role)"
                />
              </div>
            </div>

            <div class="field">
              <span class="block text-sm font-medium text-gray-700 mb-2">Member Since</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ formatDate(accountInfo.account?.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Teacher Information (if applicable) -->
      <div class="space-y-6">
        <div v-if="accountInfo?.teacherInfo" class="card">
          <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <i class="pi pi-graduation-cap mr-2"></i>
            Teacher Information
          </h3>
          
          <div class="space-y-4">
            <!-- Teacher Photo -->
            <div v-if="accountInfo?.teacherInfo?.photoUrl" class="text-center mb-4">
              <img 
                :src="accountInfo?.teacherInfo?.photoUrl" 
                :alt="accountInfo?.teacherInfo?.fullName"
                class="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-200 shadow-sm"
              />
            </div>

            <div class="field" v-if="accountInfo?.teacherInfo?.employeeNo">
              <span class="block text-sm font-medium text-gray-700 mb-2">Employee Number</span>
              <div class="p-3 bg-blue-50 border border-blue-200 rounded text-gray-800">
                {{ accountInfo?.teacherInfo?.employeeNo }}
              </div>
            </div>

            <div class="field">
              <span class="block text-sm font-medium text-gray-700 mb-2">Full Name</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ accountInfo?.teacherInfo?.fullName }}
              </div>
            </div>

            <div class="field" v-if="accountInfo?.teacherInfo?.position">
              <span class="block text-sm font-medium text-gray-700 mb-2">Position</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ accountInfo?.teacherInfo?.position }}
              </div>
            </div>

            <div class="field" v-if="accountInfo?.teacherInfo?.email">
              <span class="block text-sm font-medium text-gray-700 mb-2">Teacher Email</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ accountInfo?.teacherInfo?.email }}
              </div>
            </div>

            <div class="field" v-if="accountInfo?.teacherInfo?.contactNo">
              <span class="block text-sm font-medium text-gray-700 mb-2">Contact Number</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ accountInfo?.teacherInfo?.contactNo }}
              </div>
            </div>

            <div class="field">
              <span class="block text-sm font-medium text-gray-700 mb-2">Teacher Since</span>
              <div class="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800">
                {{ formatDate(accountInfo?.teacherInfo?.createdDate) }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="text-center py-8">
      <i class="pi pi-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
      <p class="text-gray-600">Unable to load profile information</p>
      <Button 
        label="Try Again" 
        icon="pi pi-refresh"
        @click="loadUserProfile"
        class="mt-4"
        severity="secondary"
      />
    </div>
  </div>
</template>

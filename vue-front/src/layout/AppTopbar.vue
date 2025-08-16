<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useGlobalStore } from '@/stores/global';
import AppConfigurator from './AppConfigurator.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();


const globalStore = useGlobalStore()

</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img :src="globalStore.setupData.logoPath" alt="Logo" class="layout-topbar-logo-image" />

                <span>{{ globalStore.setupData.systemName }}</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button" class="layout-topbar-action layout-topbar-action-highlight">
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <!-- Mobile menu dropdown -->
            <div class="layout-topbar-menu lg:hidden hidden absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48 z-50">
                <div class="p-2">
                    
                    <router-link 
                        to="/settings/profile" 
                        class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <i class="pi pi-cog mr-2"></i>
                        <span>Profile Settings</span>
                    </router-link>
                    <button 
                        type="button" 
                        class="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        @click="() => { globalStore.logout() }">
                        <i class="pi pi-sign-out mr-2"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    
                    <div class="relative">
                        <button 
                            type="button" 
                            class="layout-topbar-action"
                            v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <div class="hidden absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48 z-50">
                            <div class="p-2">
                                <router-link 
                                    to="/settings/profile" 
                                    class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                                    <i class="pi pi-cog mr-2"></i>
                                    <span>Profile Settings</span>
                                </router-link>
                                <button 
                                    type="button" 
                                    class="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                    @click="() => { globalStore.logout() }">
                                    <i class="pi pi-sign-out mr-2"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-topbar-logo-image{
    width: 30px;
}
</style>
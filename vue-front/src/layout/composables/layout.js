import { computed, reactive, watch } from 'vue';

// Load saved configuration from localStorage
const getSavedConfig = () => {
    try {
        const saved = localStorage.getItem('themeConfig');
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.warn('Error loading theme config from localStorage:', error);
        return {};
    }
};

// Save configuration to localStorage
const saveConfig = (config) => {
    try {
        localStorage.setItem('themeConfig', JSON.stringify(config));
    } catch (error) {
        console.warn('Error saving theme config to localStorage:', error);
    }
};

const savedConfig = getSavedConfig();

const layoutConfig = reactive({
    preset: savedConfig.preset || 'Aura',
    primary: savedConfig.primary || 'emerald',
    surface: savedConfig.surface || null,
    darkTheme: savedConfig.darkTheme || false,
    menuMode: savedConfig.menuMode || 'static'
});

// Watch for changes and persist to localStorage
watch(
    () => ({ ...layoutConfig }),
    (newConfig) => {
        saveConfig(newConfig);
    },
    { deep: true }
);

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

export function useLayout() {
    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();
            return;
        }

        document.startViewTransition(() => executeDarkModeToggle());
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        applyDarkMode();
    };

    const applyDarkMode = () => {
        if (layoutConfig.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    };

    // Apply saved dark mode on initialization
    const initializeTheme = () => {
        applyDarkMode();
    };

    const toggleMenu = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    return {
        layoutConfig,
        layoutState,
        toggleMenu,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode,
        initializeTheme
    };
}

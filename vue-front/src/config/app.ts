// Application configuration constants
export const CONFIG = {
    // File server configuration
    FILE_SERVER_URL: import.meta.env.VITE_APP_FILE_SERVER_URL || 'http://localhost:8080',
    
    // API configuration
    API_ROOT: import.meta.env.VITE_APP_API_ROOT || 'http://localhost:8080',
};

// Helper functions for file URLs
export const getFileUrl = (path: string | null): string | null => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${CONFIG.FILE_SERVER_URL}${path}`;
};

export const getProfilePictureUrl = (photoUrl: string | null): string | null => {
    return getFileUrl(photoUrl);
};

export default CONFIG;

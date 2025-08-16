import api from './ajax';

export class FileUploadService {
    async uploadProfilePicture(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/v1/files/upload/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw error;
        }
    }

    async uploadDocument(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/v1/files/upload/document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    }

    async deleteFile(filePath: string): Promise<any> {
        try {
            const response = await api.delete('/api/v1/files/delete', {
                params: {
                    filePath: filePath
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
}

export const fileUploadService = new FileUploadService();

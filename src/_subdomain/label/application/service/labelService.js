import api from "../../../../_common/application/service/api";

const labelService = {
    getAllLabels: async () => {
        try {
            const response = await api.get('/labels/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching all teams:', error);
            return [];
        }
    },
    createLabel: async (label) => {
        try {
            const response = await api.post('/labels', label);
            return response.data;
        } catch (error) {
            console.error('Error creating label:', error);
            throw error;
        }
    },
    deleteLabel: async (labelId) => {
        try {
            await api.delete(`/labels/${labelId}`);
            return true
        } catch (error) {
            console.error('Error deleting label:', error);
            throw error;
        }
    },
    findAllByProjectId: async (projectId) => {
        try {
            const response = await api.get(`/labels/project/${projectId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching labels for project ${projectId}:`, error);
            return [];
        }
    }
}

export default labelService;
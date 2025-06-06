import api from '../../../../_common/application/service/api';

const projectBoardService = {
  getProjectBoards: async (projectId) => {
    try {
      const response = await api.get(`/boards?projectId=${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching boards for project ${projectId}:`, error);
      return [];
    }
  },
  deleteProjectBoard: async (id) => {
    try {
      await api.delete(`/boards/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
};

export default projectBoardService; 
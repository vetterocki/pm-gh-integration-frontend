import api from '../../../../_common/application/service/api';

const projectService = {
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects/all');      
      if (!response.data) {
        console.error('Response missing data property:', response);
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching all projects:', error);
      return [];
    }
  },
  
  createProject: async (project) => {
    try {
      const response = await api.post('/projects', project);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  getProjectByName: async (projectName) => {
    try {
      const response = await api.get(`/projects?projectName=${projectName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${projectName}:`, error);
      throw error;
    }
  },

  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project by id ${id}:`, error);
      throw error;
    }
  },
  
  updateProject: async (id, projectUpdateData) => {
    try {
      const response = await api.patch(`/projects/${id}`, projectUpdateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },
  
  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
};

export default projectService; 
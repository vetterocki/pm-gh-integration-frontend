import api from '../../../../_common/application/service/api';

const projectService = {
  // Get all projects
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects/all');      
      // Check if response has data property
      if (!response.data) {
        console.error('Response missing data property:', response);
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching all projects:', error);
      // Return empty array on error to avoid cascading failures
      return [];
    }
  },
  
  // Create a new project
  createProject: async (project) => {
    try {
      const response = await api.post('/projects', project);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  // Get a project by name
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
  
  // Update a project
  updateProject: async (id, projectUpdateData) => {
    try {
      const response = await api.patch(`/projects/${id}`, projectUpdateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a project
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
import api from '../../../../_common/application/service/api';

const teamMemberService = {
  createTeamMember: async (teamMember) => {
    try {
      const response = await api.post('/members', teamMember);
      return response.data;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },
  
  getTeamMemberById: async (id) => {
    try {
      const response = await api.get(`/members/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team member ${id}:`, error);
      throw error;
    }
  },
  
  findByName: async (name) => {
    try {
      if (!name) return null;
      
      const response = await api.get(`/members?teamMemberName=${encodeURIComponent(name)}`);
      
      if (response.status === 404) {
        console.warn(`Team member with name '${name}' not found`);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error finding team member by name '${name}':`, error);
      return null;
    }
  },
  
  getAllTeamMembers: async () => {
    try {
      const response = await api.get(`/members/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getTeamMembersByTeamId: async (teamId) => {
    try {
      const response = await api.get(`/members/team/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team members for team ${teamId}:`, error);
      throw error;
    }
  },
  
  updateTeamMember: async (id, teamMemberUpdateData) => {
    try {
      console.log(teamMemberUpdateData);
      const response = await api.patch(`/members/${id}`, teamMemberUpdateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating team member ${id}:`, error);
      throw error;
    }
  },
  
  deleteTeamMember: async (id) => {
    try {
      await api.delete(`/members/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting team member ${id}:`, error);
      throw error;
    }
  }
};

export default teamMemberService; 
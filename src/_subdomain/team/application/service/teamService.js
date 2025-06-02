import api from '../../../../_common/application/service/api';

const teamService = {
  getAllTeams: async () => {
    try {
      const response = await api.get('/teams/all');
      
      if (!response.data) {
        console.error('Response missing data property:', response);
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching all teams:', error);
      return [];
    }
  },
  
  findByName: async (teamName) => {
    try {
      if (!teamName) return null;
      
      const response = await api.get(`/teams?teamName=${encodeURIComponent(teamName)}`);
      
      if (response.status === 404) {
        console.warn(`Team with name '${teamName}' not found`);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error finding team by name '${teamName}':`, error);
      
      try {
        const allTeams = await teamService.getAllTeams();
        
        if (Array.isArray(allTeams)) {
          const foundTeam = allTeams.find(team => team.name === teamName);
          if (foundTeam) {
            return foundTeam;
          }
        }
      } catch (fallbackError) {
        console.error('Fallback approach failed:', fallbackError);
      }
      
      return null;
    }
  },
  
  getTeamByName: async (teamName) => {
    return teamService.findByName(teamName);
  },
  
  createTeam: async (team) => {
    try {
      if (!team.projectManagerName && team.projectManagerId) {
        console.warn('Team data using old format with projectManagerId instead of projectManagerName');
      }
      
      const response = await api.post('/teams', team);
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },
  
  getTeamById: async (id) => {
    try {
      const response = await api.get(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error);
      throw error;
    }
  },
  
  updateTeam: async (id, teamUpdateData) => {
    try {
      const response = await api.patch(`/teams/${id}`, teamUpdateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating team ${id}:`, error);
      throw error;
    }
  },
  
  deleteTeam: async (id) => {
    try {
      await api.delete(`/teams/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting team ${id}:`, error);
      throw error;
    }
  },

  deleteMember: async (id, memberId) => {
    try {
      await api.delete(`/teams/${id}/members/${memberId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting team ${id}:`, error);
      throw error;
    }
  },

};

export default teamService; 
import api from '../../../../_common/application/service/api';

const teamService = {
  // Get all teams
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
  
  // Find a team by name using the findByName endpoint
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
      
      // Try to fetch all teams and find by name as a fallback
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
  
  // For backward compatibility
  getTeamByName: async (teamName) => {
    return teamService.findByName(teamName);
  },
  
  // Create a new team
  createTeam: async (team) => {
    try {
      // Ensure team has projectManagerName field
      if (!team.projectManagerName && team.projectManagerId) {
        // This is a fallback if someone tries to use the old format
        console.warn('Team data using old format with projectManagerId instead of projectManagerName');
      }
      
      const response = await api.post('/teams', team);
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },
  
  // Get a team by ID
  getTeamById: async (id) => {
    try {
      const response = await api.get(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error);
      throw error;
    }
  },
  
  // Update a team
  updateTeam: async (id, teamUpdateData) => {
    try {
      const response = await api.patch(`/teams/${id}`, teamUpdateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating team ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a team
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
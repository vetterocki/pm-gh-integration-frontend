 import api from '../../../../_common/application/service/api';

const ticketService = {
  // Get tickets for a project board grouped by status
  
  getTicketsByBoardIdGroupedByStatus: async (projectBoardId) => {
    try {
      const response = await api.get(`/tickets/project-board/${projectBoardId}/grouped-by-status`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tickets for board ${projectBoardId}:`, error);
      return {};
    }
  },

  getAllTicketsByProjectId: async (projectId) => {
    try {
      const response = await api.get(`/tickets/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tickets for project ${projectId}:`, error);
      return {};
    }
  },

  getAllTicketsByProjectBoardId: async (projectBoardId) => {
    try {
      const response = await api.get(`/tickets/project-board/${projectBoardId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tickets for project board ${projectBoardId}:`, error);
      return {};
    }
  },

  getTicketReviewers: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/reviewers`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket reviewers for ticket ${ticketId}:`, error);
      return {};
    }
  },

  updateTicket: async (ticketId, ticket) => {
    try {
      const response = await api.patch(`/tickets/${ticketId}`, ticket);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },
  createTicket: async (ticket) => {
    try {
      const response = await api.post('/tickets', ticket);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  deleteTicket: async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting ticket by id ${id}:`, error);
      throw error;
    }
  },

  assignTicket: async (ticketId, memberName) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/assign?memberName=${encodeURIComponent(memberName)}`, {
        method: 'POST',
      });

      return response.data

    } catch (error) {
      console.error('Error assigning ticket:', error);
      throw error;
    }
  },

  unassignTicket: async (ticketId) => {
    try {
      await api.post(`/tickets/${ticketId}/unassign`);
      return true;
    } catch (error) {
      console.error(`Error unassigning ticket by id ${ticketId}:`, error);
      throw error;
    }
  }
};

export default ticketService; 
import React from 'react';
import Ticket from '../../../ticket/domain/Ticket';

const ProjectBoardColumn = ({ status, tickets = [], onTicketClick }) => (
  <div className="board-column" style={{ borderTop: `3px solid ${status.color}` }}>
    <div className="column-header" style={{ backgroundColor: `${status.color}20` }}>
      <h4 className="column-title">{status.name}</h4>
      <span className="ticket-count">{tickets.length}</span>
    </div>
    <div className="column-content">
      {tickets.map(ticket => (
        <Ticket key={ticket.id} ticket={ticket} onClick={() => onTicketClick(ticket)}/>
      ))}
    </div>
  </div>
);

export default ProjectBoardColumn;

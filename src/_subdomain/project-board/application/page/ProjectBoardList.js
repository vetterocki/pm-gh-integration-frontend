import React from 'react';
import Ticket from "../../../ticket/domain/Ticket";


function ProjectBoardList({ statuses, ticketsByStatus, onTicketClick  }) {
  return (
    <div
      className="list-view-container"
      style={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        overflowY: 'auto',
        maxHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {statuses.map((status) => (
        <div
          key={status.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            borderLeft: `6px solid ${status.color}`,
            backgroundColor: `${status.color}20`,
            borderRadius: 12,
            padding: 16,
            gap: 24,
            whiteSpace: 'nowrap',
          }}
        >
            <div
                style={{
                    width: 140,
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 4,
                    userSelect: 'none',
                    marginRight: 20,
                }}
            >

            <h5 style={{ margin: 0, fontWeight: '600', color: '#333', lineHeight: 1 }}>
                {status.name.charAt(0).toUpperCase() + status.name.slice(1).toLowerCase()}
            </h5>
            <span style={{ fontSize: 12, color: '#666', lineHeight: 1 }}>
              {ticketsByStatus[status.id]?.length || 0} ticket(s)
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexGrow: 1,
              minWidth: 0,
              gap: 12,
              overflowX: 'auto',
              alignItems: 'flex-start',
              paddingRight: 8,
            }}
          >
            {(ticketsByStatus[status.id] || []).length > 0 ? (
              ticketsByStatus[status.id].map((ticket) => (
                <Ticket key={ticket.id} ticket={ticket} style={{
                    border: 'none',
                    borderRadius: 8,
                    minWidth: 220,
                    flexShrink: 0,
                    cursor: 'pointer',
                    userSelect: 'none',
                    marginRight: 12,
                    backgroundColor: '#fff',
                    boxSizing: 'border-box',
                    padding: 12,
                    boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)',
                }} onClick={() => onTicketClick(ticket)}/>
              ))
            ) : (
              <div style={{ color: '#999', fontStyle: 'italic' }}>No tickets in this status.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectBoardList;

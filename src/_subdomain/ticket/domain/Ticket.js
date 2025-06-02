import React from 'react';
import { getPriorityClass } from '../application/service/ticketMappers';

const Ticket = ({ ticket, style, description, ghDescription, onClick }) => (
    <div className="ticket-card" style={style} onClick={onClick}>
        <div className="ticket-header">
            <span className="ticket-id">{ticket.ticketIdentifier}</span>
            <div className={`priority-indicator ${getPriorityClass(ticket.priority)}`}></div>
        </div>
        <h5 className="ticket-title">{ticket.title}</h5>

        <div
            className="ticket-meta-container"
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
            }}
        >
            <div className="ticket-meta" style={{flex: '1 1 auto'}}>
                <div></div>
                <div></div>
                <div className="ticket-assignee">
                    {ticket.assignee && (<>
                            <img src={ticket.assignee.avatar} alt={ticket.assignee.name}/>
                            <span className="assignee-name">{ticket.assignee.name}</span>
                        </>)}
                </div>
                <div className="ticket-due-date">
                    {ticket.createdAt && (<>
                            <i className="bi bi-calendar"></i>
                            <span>{ticket.createdAt}</span>
                        </>)}
                </div>
            </div>

            {description && ticket.description && (
                <div
                    className="ticket-description"
                    style={{
                        flex: '0 0 300px',
                        whiteSpace: 'normal',
                        color: '#555',
                        fontSize: 14,
                        lineHeight: 1.3,
                    }}
                >
                    Description: {ticket.description}
                </div>
            )}
            {ghDescription && ticket.githubDescription && (
                <div
                    className="ticket-description"
                    style={{
                        flex: '0 0 300px',
                        whiteSpace: 'normal',
                        color: '#555',
                        fontSize: 14,
                        lineHeight: 1.3,
                    }}
                >
                    GitHub PR`s body: {ticket.githubDescription}
                </div>
            )}
        </div>
    </div>
);

export default Ticket;

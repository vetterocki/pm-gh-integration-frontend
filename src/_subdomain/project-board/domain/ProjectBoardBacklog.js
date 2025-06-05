import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import ticketService from '../../ticket/application/service/ticketService';
import Ticket from '../../ticket/domain/Ticket';
import TicketModal from '../../ticket/domain/TicketModal';
import {filterTicketsByTextList, mapApiTicketToUiTicket} from '../../ticket/application/service/ticketMappers';
import '../../../resources/styles/Backlog.css';

const ProjectBoardBacklog = ({ projectBoardId, filterText }) => {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await ticketService.getAllTicketsByProjectBoardId(projectBoardId);
                setTickets(data);
            } catch (err) {
                setError('Failed to load backlog tickets.');
            } finally {
                setLoading(false);
            }
        };
        loadTickets();
    }, [projectBoardId]);

    const mappedTickets = tickets.map(mapApiTicketToUiTicket);
    const filteredTickets = filterTicketsByTextList(mappedTickets, filterText);

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseModal = () => {
        setSelectedTicket(null);
    };

    const handleDeleteTicket = async (ticketId) => {
        if (window.confirm(t('tickets.deleteConfirm'))) {
            try {
                await ticketService.deleteTicket(ticketId);
                setSelectedTicket(null);
                const updatedTickets = tickets.filter(t => t.id !== ticketId);
                setTickets(updatedTickets);
            } catch (err) {
                setError(t('backlog.deleteError'));
                console.error(err);
            }
        }
    };

    if (loading) return <div className="backlog-loading">{t('backlog.loading')}</div>;
    if (error) return <div className="backlog-error">{error}</div>;

    return (
        <div className="backlog-container">
            {filteredTickets.length === 0 ? (
                <div className="backlog-empty">{t('backlog.noTickets')}</div>
            ) : (
                filteredTickets.map(ticket => (
                    <div
                        key={ticket.id}
                        className="ticket-card"
                        onClick={() => handleTicketClick(ticket)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Ticket ticket={ticket} />
                    </div>
                ))
            )}

            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={handleCloseModal}
                    onDelete={() => handleDeleteTicket(selectedTicket.id)}
                />
            )}
        </div>
    );
};

export default ProjectBoardBacklog;

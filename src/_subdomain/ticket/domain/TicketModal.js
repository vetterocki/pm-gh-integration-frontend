import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import ticketService from '../application/service/ticketService';
import '../../../resources/styles/TicketModal.css';
import WorkflowRunsModal from '../../workflow-run/domain/WorkflowRunsModal';
import PullRequestsModal from '../../pull-request/domain/PullRequestsModal';
import {conclusionIcons, mapAssignee} from '../application/service/ticketMappers';

const statusColors = {
    'TO DO': '#0052cc',
    'STOP PROGRESS': '#d0454c',
    'IN PROGRESS': '#36b37e',
    'WAITING FOR REVIEW': '#ffc400',
    'WAITING FOR MERGE': '#8777d9',
    'DONE': '#8a2be2',
};

const TicketModal = ({ticket, onClose, onAssignToggle, onDelete}) => {
    const { t } = useTranslation();
    const [currentTicket, setCurrentTicket] = useState(ticket);
    const [reviewers, setReviewers] = useState([]);
    const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
    const [prModalOpen, setPrModalOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState(ticket.summary || "");
    const [editedDescription, setEditedDescription] = useState(ticket.description || "");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const currentUserEmail = currentUser.email || '';

    const lastWorkflowRun = currentTicket.linkedWorkflowRuns?.length ? currentTicket.linkedWorkflowRuns[currentTicket.linkedWorkflowRuns.length - 1] : null;

    useEffect(() => {
        if (ticket) {
            setCurrentTicket(ticket);
            console.log("Current ticket ASSIGNEE ", ticket.assignee);
            setEditedTitle(ticket.title || "");
            setEditedDescription(ticket.description || "");
            setIsEditingTitle(false);
            setIsEditingDescription(false);

            ticketService.getTicketReviewers(ticket.id)
                .then(setReviewers)
                .catch(console.error);
        }
    }, [ticket]);


    if (!currentTicket) return null;

    const statusKey = currentTicket.status?.toUpperCase() || 'TO DO';
    const statusColor = statusColors[statusKey] || '#6c757d';
    const headerBg = `${statusColor}20`;

    return (<div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3 shadow overflow-hidden ticket-modal"
                style={{
                    width: '90%',
                    height: '70%',
                    maxHeight: '75vh',
                    maxWidth: '1000px',
                    borderTop: `4px solid ${statusColor}`,
                    border: '2px solid #ddd',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="ticket-modal-header" style={{backgroundColor: headerBg}}>
                    <div className="header-left">
                        <h6 className="ticket-id text-muted mb-1" style={{fontSize: '1.25rem', fontWeight: '600'}}>
                            {currentTicket.ticketIdentifier}
                        </h6>
                    </div>
                    <div className="header-right">
                        <div className="created-at-text">
                            {t('tickets.createdAt')}: {currentTicket.createdAt}
                        </div>
                        <div className="ticket-status-badge" style={{color: statusColor, borderColor: statusColor}}>
                            {currentTicket.status}
                        </div>
                        <button className="btn-close" onClick={onClose} aria-label="Close"/>
                    </div>
                </div>

                <div className="flex-grow-1 overflow-auto px-4 py-3">
                    <div className="row">
                        <div className="col-md-7">
                            <section className="mb-3">
                                {isEditingTitle ? (<div>
                                        <textarea
                                            className="form-control"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            rows={2}
                                            style={{resize: 'none'}}
                                        />
                                        <div className="mt-2">
                                            <button
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={async () => {
                                                    try {
                                                        await ticketService.updateTicket(currentTicket.id, {summary: editedTitle});
                                                        setIsEditingTitle(false);
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                            >
                                                {t('common.save')}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => {
                                                    setEditedTitle(currentTicket.title || "");
                                                    setIsEditingTitle(false);
                                                }}
                                            >
                                                {t('common.cancel')}
                                            </button>
                                        </div>
                                    </div>) : (<div
                                        className="editable-field"
                                        onClick={() => setIsEditingTitle(true)}
                                        style={{cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold'}}
                                        title={t('tickets.clickToEdit')}
                                    >
                                        {editedTitle || t('tickets.untitledTicket')}
                                    </div>)}
                            </section>

                            <section className="mb-4">
                                <h5>{t('tickets.description')}</h5>
                                {isEditingDescription ? (<div>
                                        <textarea
                                            className="form-control ticket-description"
                                            rows="6"
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                        />
                                        <div className="mt-2">
                                            <button
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={async () => {
                                                    try {
                                                        await ticketService.updateTicket(currentTicket.id, {description: editedDescription});
                                                        setIsEditingDescription(false);
                                                    } catch (err) {
                                                        console.error(err);
                                                    } finally {
                                                    }
                                                }}
                                            >
                                                {t('common.save')}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => {
                                                    setEditedDescription(currentTicket.description || "");
                                                    setIsEditingDescription(false);
                                                }}
                                            >
                                                {t('common.cancel')}
                                            </button>
                                        </div>
                                    </div>) : (<div
                                        className="editable-field ticket-description"
                                        onClick={() => setIsEditingDescription(true)}
                                        style={{cursor: 'pointer', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}
                                        title={t('tickets.clickToEdit')}
                                    >
                                        {editedDescription || t('tickets.noDescription')}
                                    </div>)}
                            </section>

                            <section className="mb-4">
                                <h5>{t('tickets.githubPRBody')}</h5>
                                <p className="ticket-github-description">{currentTicket.githubDescription || t('tickets.noPRDescription')}</p>
                            </section>

                            <section className="mb-4">
                                <h5>{t('tickets.linkedPullRequests')}</h5>
                                {prModalOpen && (<PullRequestsModal
                                        pullRequests={currentTicket.linkedPullRequests}
                                        onClose={() => setPrModalOpen(false)}
                                    />)}
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setPrModalOpen(true)}
                                    disabled={!currentTicket.linkedPullRequests?.length}
                                >
                                    {t('tickets.viewAllPullRequests')} ({currentTicket.linkedPullRequests?.length || 0})
                                </button>
                            </section>

                            <section className="mb-4">
                                <h5>{t('tickets.linkedWorkflowRuns')}</h5>
                                {lastWorkflowRun ? (<div>
                                        <div className="d-block mb-1 fw-semibold">{t('tickets.latestWorkflowRun')}</div>
                                        <div className="mb-3 p-3 border rounded bg-light">
                                            <div>
                                                {t('tickets.conclusion')}: <strong>{conclusionIcons[lastWorkflowRun.conclusion] || '❓'} {lastWorkflowRun.conclusion || t('tickets.unknown')}</strong>
                                            </div>
                                            <div>{t('tickets.by')}: {lastWorkflowRun.actor.name} (<em>{lastWorkflowRun.actor.login}</em>)
                                            </div>
                                            <div className="text-muted">{t('tickets.repo')}: {lastWorkflowRun.repositoryName}</div>
                                        </div>
                                    </div>) : (<p>{t('tickets.noWorkflowRuns')}</p>)}
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setWorkflowModalOpen(true)}
                                    disabled={!currentTicket.linkedWorkflowRuns?.length}
                                >
                                    {t('tickets.viewAllWorkflowRuns')} ({currentTicket.linkedWorkflowRuns?.length || 0})
                                </button>
                            </section>

                            {workflowModalOpen && (<WorkflowRunsModal
                                    runs={currentTicket.linkedWorkflowRuns}
                                    onClose={() => setWorkflowModalOpen(false)}
                                />)}
                        </div>

                        <div className="col-md-5 d-flex flex-column justify-content-between" style={{height: '100%'}}>
                            <div>
                                <section className="mb-4">
                                    <h5>{t('tickets.labels')}</h5>
                                    {currentTicket.labels?.length > 0 ? (<div className="d-flex flex-wrap gap-2">
                                            {currentTicket.labels.map(label => (<span
                                                    key={label.id}
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: label.color || '#6c757d',
                                                        fontSize: '1.1rem',
                                                        padding: '0.5em 1.2em',
                                                        fontWeight: '700',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    {label.name}
                                                </span>))}
                                        </div>) : (<p>{t('tickets.noLabels')}</p>)}
                                </section>

                                <section className="mb-4">
                                    <h5>{t('tickets.assignee')}</h5>
                                    <div className="text-center p-3 bg-light rounded">
                                        {currentTicket.assignee?.avatar && (
                                            <img src={currentTicket.assignee.avatar} alt="Assignee"
                                                 className="rounded-circle mb-2" width="60" height="60"/>)}
                                        <p className="mb-1">{currentTicket.assignee?.name}</p>
                                        <button
                                            className="btn btn-outline-primary btn-sm mt-2"
                                            onClick={async () => {
                                                if (currentTicket.assignee) {
                                                    try {
                                                        await ticketService.unassignTicket(currentTicket.id);
                                                        setCurrentTicket(prev => ({ ...prev, assignee: null }));
                                                        if (onAssignToggle) onAssignToggle(null);
                                                    } catch (err) {
                                                        console.error("Failed to unassign ticket", err);
                                                    }
                                                } else {
                                                    try {
                                                        const changedTicket = await ticketService.assignTicket(currentTicket.id, currentUserEmail);
                                                        setCurrentTicket(prev => ({ ...prev, assignee: mapAssignee(changedTicket) }));
                                                        if (onAssignToggle) onAssignToggle(changedTicket);
                                                    } catch (err) {
                                                        console.error("Failed to assign ticket", err);
                                                    }
                                                }
                                            }}
                                        >
                                            {currentTicket.assignee ? t('tickets.unassign') : t('tickets.assignToMe')}
                                        </button>
                                    </div>
                                </section>

                                <section className="mb-4">
                                    <h5>{t('tickets.reporter')}</h5>
                                    <div className="text-center p-3 bg-light rounded">
                                        {currentTicket.reporter?.avatar && (
                                            <img src={currentTicket.reporter.avatar} alt="Reporter"
                                                 className="rounded-circle mb-2" width="60" height="60"/>)}
                                        <p className="mb-1">{currentTicket.reporter?.name}</p>
                                    </div>
                                </section>

                                <section className="mb-4">
                                    <h5>{t('tickets.reviewers')}</h5>
                                    {reviewers.length > 0 ? (<div className="d-flex flex-column gap-2">
                                            {reviewers.map((r) => (<div key={r.id}
                                                                        className="d-flex align-items-center gap-3 bg-light p-2 rounded">
                                                    {r.avatarUrl && (<img src={r.avatarUrl} alt={r.firstName}
                                                                          className="rounded-circle" width="40"
                                                                          height="40"/>)}
                                                    <div>
                                                        <strong>{r.firstName} {r.lastName}</strong>
                                                        <div className="text-muted">@{r.loginInGithub}</div>
                                                    </div>
                                                </div>))}
                                        </div>) : (<p>{t('tickets.noReviewers')}</p>)}
                                </section>
                            </div>

                            <div className="d-flex justify-content-end align-items-center">
                                <div className="created-at-button text-end">
                                    {/*{t('tickets.createdAt')}: {currentTicket.createdAt}*/}
                                    {onDelete && (<button
                                            className="btn btn-danger btn-sm ms-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete();
                                            }}
                                            aria-label="Delete"
                                            title={t('tickets.deleteTicket')}
                                        >
                                            {t('common.delete')}
                                        </button>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default TicketModal;

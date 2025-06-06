import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {projectBoardService, projectService, ticketService} from '../../../_common/application/service';
import LoadingSpinner from '../../../_common/application/page/LoadingSpinner';

import ProjectBoardColumn from '../../project-board/application/page/ProjectBoardColumn';
import ProjectHeader from '../application/page/ProjectHeader';
import ProjectSidebar from '../application/page/ProjectSidebar';
import ProjectBoardList from '../../project-board/application/page/ProjectBoardList';
import ProjectBoardBacklog from '../../project-board/domain/ProjectBoardBacklog';
import {filterTicketsByText, mapApiTicketToUiTicket} from '../../ticket/application/service/ticketMappers';

import "../../../resources/styles/ProjectDetail.css";
import ProjectLabelsList from "../../label/application/page/ProjectLabelsList";
import labelService from "../../label/application/service/labelService";
import TicketModal from "../../ticket/domain/TicketModal";

const Project = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [project, setProject] = useState(null);
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [tickets, setTickets] = useState({});
    const [labels, setLabels] = useState({});
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('board');
    const [filterText, setFilterText] = useState('');
    const [selectedMenu, setSelectedMenu] = useState('boards');
    const [selectedTicket, setSelectedTicket] = useState(null);


    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseModal = () => {
        setSelectedTicket(null);
    };

    const handleDeleteBoard = async () => {
        if (!selectedBoard) return;

        if (window.confirm(t('boards.deleteBoardConfirm', { boardName: selectedBoard.name }))) {
            try {
                await projectBoardService.deleteProjectBoard(selectedBoard.id);

                const updatedBoards = boards.filter(board => board.id !== selectedBoard.id);
                setBoards(updatedBoards);

                if (updatedBoards.length > 0) {
                    setSelectedBoard(updatedBoards[0]);
                } else {
                    setSelectedBoard(null);
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };


    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);

                const projectData = await projectService.getProjectById(id);
                setProject(projectData);

                const boardsData = await projectBoardService.getProjectBoards(id);
                setBoards(boardsData || []);

                const projectLabels = await labelService.findAllByProjectId(id)
                setLabels(projectLabels);

                if (boardsData && boardsData.length > 0) {
                    const defaultBoard = boardsData.find(board => board.default) || boardsData[0];
                    setSelectedBoard(defaultBoard);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error loading project:', err);
                setLoading(false);
            }
        };

        loadProject();
    }, [id]);

    useEffect(() => {
        if (!selectedBoard) return;

        const loadTickets = async (boardId) => {
            try {
                const ticketsGroupedApi = await ticketService.getTicketsByBoardIdGroupedByStatus(boardId);

                const ticketsGroupedUi = {};
                const statusColors = {
                    'TO DO': '#0052cc',
                    'STOP PROGRESS': '#d0454c',
                    'IN PROGRESS': '#36b37e',
                    'WAITING FOR REVIEW': '#ffc400',
                    'WAITING FOR MERGE': '#8777d9',
                    'DONE': '#8a2be2',
                };

                const statusesFromApi = Object.keys(ticketsGroupedApi).map((key) => {
                    ticketsGroupedUi[key] = ticketsGroupedApi[key].map(mapApiTicketToUiTicket);
                    const upperKey = key.toUpperCase();
                    return {
                        id: key,
                        name: upperKey,
                        color: statusColors[upperKey] || '#f0f1f2',
                    };
                });

                setStatuses(statusesFromApi);
                setTickets(ticketsGroupedUi);
            } catch (err) {
                console.error('Error loading tickets:', err);
            }
        };

        loadTickets(selectedBoard.id);
    }, [selectedBoard]);

    const handleFilterChange = (e) => setFilterText(e.target.value);

    const filteredTickets = filterTicketsByText(tickets, filterText);

    const handleDelete = async () => {
        if (window.confirm(t('projects.deleteConfirm'))) {
            try {
                await projectService.deleteProject(id);
                navigate('/projects/');
            } catch (err) {
                console.error(err);
                console.warn(err.status)
            }
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (window.confirm(t('tickets.deleteConfirm'))) {
            try {
                await ticketService.deleteTicket(ticketId);
                navigate(`/projects/${project.id}`);
                handleCloseModal()
                window.location.reload()
            } catch (err) {
                console.error(err);
            }
        }
    };



    if (loading) return <LoadingSpinner/>;

    if (!project) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    {t('projects.projectNotFound')} <Link to="/projects">{t('projects.backToProjects')}</Link>
                </div>
            </div>
        );
    }

    const statusOrder = [
        "TO DO",
        "STOP PROGRESS",
        "IN PROGRESS",
        "WAITING FOR REVIEW",
        "WAITING FOR MERGE",
        "DONE"
    ];

    const orderedStatuses = statusOrder
        .map(name => statuses.find(s => s.name === name))
        .filter(Boolean);

    return (
        <div className="project-detail-container">
            <ProjectHeader
                project={project}
                projectBoard={selectedBoard}
                onDelete={handleDelete}
                selectedMenu={selectedMenu}
            />


            <div className="project-content">
                <ProjectSidebar
                    boards={boards}
                    selectedBoard={selectedBoard}
                    onSelectBoard={setSelectedBoard}
                    selectedMenu={selectedMenu}
                    onSelectMenu={setSelectedMenu}
                />

                <div className="project-board">
                    {selectedMenu === 'boards' && (
                        <>
                            <div className="board-header">
                                <h2 className="board-title">{selectedBoard ? selectedBoard.name : t('sidebar.boards')}</h2>
                                <div className="board-controls">
                                    <div className="board-filter" style={{maxWidth: 300}}>
                                        <input
                                            type="text"
                                            placeholder={t('project.filterTicketsPlaceholder')}
                                            className="form-control"
                                            value={filterText}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    <div className="board-view-options">
                                        <button
                                            className={`btn btn-outline-secondary ${viewMode === 'board' ? 'active' : ''}`}
                                            onClick={() => setViewMode('board')}
                                        >
                                            <i className="bi bi-kanban"></i> {t('project.boardView')}
                                        </button>
                                        <button
                                            className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
                                            onClick={() => setViewMode('list')}
                                        >
                                            <i className="bi bi-list"></i> {t('project.listView')}
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={handleDeleteBoard}
                                            disabled={!selectedBoard}
                                            title={selectedBoard ? t('boards.deleteBoardConfirm', { boardName: selectedBoard.name }) : t('project.noBoardSelected')}
                                        >
                                            <i className="bi bi-trash"></i> {t('boards.deleteBoard')}
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div className="board-content">
                                {viewMode === 'board' ? (
                                    orderedStatuses.map(status => (
                                        <ProjectBoardColumn
                                            key={status.id}
                                            status={status}
                                            tickets={filteredTickets[status.id] || []}
                                            onTicketClick={handleTicketClick}
                                        />
                                    ))
                                ) : (
                                    <ProjectBoardList
                                        statuses={orderedStatuses}
                                        ticketsByStatus={filteredTickets}
                                        onTicketClick={handleTicketClick}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {selectedMenu === 'backlog' && (
                        <>
                            <div className="board-header">
                                <h2 className="board-title">{t('sidebar.backlog')}</h2>
                                <div className="board-filter" style={{maxWidth: 300}}>
                                    <input
                                        type="text"
                                        placeholder={t('project.filterTicketsPlaceholder')}
                                        className="form-control"
                                        value={filterText}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                            <ProjectBoardBacklog projectBoardId={selectedBoard.id} filterText={filterText}/>
                        </>
                    )}

                    {selectedMenu === 'labels' && (
                        <>
                            <div className="board-header">
                                <h2 className="board-title">{t('sidebar.labels')}</h2>
                            </div>
                            <ProjectLabelsList labels={labels || []} filterText={filterText} project={project} setSelectedMenu={setSelectedMenu} />
                        </>
                    )}
                </div>
            </div>
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

export default Project;

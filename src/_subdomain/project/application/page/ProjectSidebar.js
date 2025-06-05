import React from 'react';
import { useTranslation } from 'react-i18next';

const ProjectSidebar = ({ boards, selectedBoard, onSelectBoard, selectedMenu, onSelectMenu }) => {
    const { t } = useTranslation();
    
    return (
        <div className="project-sidebar">
            <div className="sidebar-header">
                <h3>{t('sidebar.projectNavigation')}</h3>
            </div>
            <ul className="sidebar-menu">
                <li
                    className={`sidebar-menu-item ${selectedMenu === 'boards' ? 'active' : ''}`}
                    onClick={() => onSelectMenu('boards')}
                >
                    <i className="bi bi-kanban"></i> {t('sidebar.boards')}
                </li>
                <li
                    className={`sidebar-menu-item ${selectedMenu === 'backlog' ? 'active' : ''}`}
                    onClick={() => onSelectMenu('backlog')}
                >
                    <i className="bi bi-list-ul"></i> {t('sidebar.backlog')}
                </li>
                <li
                    className={`sidebar-menu-item ${selectedMenu === 'labels' ? 'active' : ''}`}
                    onClick={() => onSelectMenu('labels')}
                >
                    <i className="bi bi-tags"></i> {t('sidebar.labels')}
                </li>
            </ul>
            <>
                <div className="sidebar-header">
                    <h3>{t('sidebar.boardsList')}</h3>
                </div>
                <ul className="sidebar-boards">
                    {boards.length === 0 ? (
                        <li className="board-item">{t('sidebar.noBoardsAvailable')}</li>
                    ) : (
                        boards.map(board => (
                            <li
                                key={board.id}
                                className={`board-item ${selectedBoard && selectedBoard.id === board.id ? 'active' : ''}`}
                                onClick={() => onSelectBoard(board)}
                            >
                                <i className="bi bi-kanban"></i> {board.name}
                            </li>
                        ))
                    )}
                </ul>
            </>
        </div>
    );
};

export default ProjectSidebar;

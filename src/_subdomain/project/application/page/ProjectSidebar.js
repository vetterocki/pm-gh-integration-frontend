import React from 'react';

const ProjectSidebar = ({ boards, selectedBoard, onSelectBoard, selectedMenu, onSelectMenu }) => (
    <div className="project-sidebar">
        <div className="sidebar-header">
            <h3>Project Navigation</h3>
        </div>
        <ul className="sidebar-menu">
            <li
                className={`sidebar-menu-item ${selectedMenu === 'boards' ? 'active' : ''}`}
                onClick={() => onSelectMenu('boards')}
            >
                <i className="bi bi-kanban"></i> Boards
            </li>
            <li
                className={`sidebar-menu-item ${selectedMenu === 'backlog' ? 'active' : ''}`}
                onClick={() => onSelectMenu('backlog')}
            >
                <i className="bi bi-list-ul"></i> Backlog
            </li>
            <li
                className={`sidebar-menu-item ${selectedMenu === 'labels' ? 'active' : ''}`}
                onClick={() => onSelectMenu('labels')}
            >
                <i className="bi bi-tags"></i> Labels
            </li>
        </ul>
        <>
            <div className="sidebar-header">
                <h3>Boards</h3>
            </div>
            <ul className="sidebar-boards">
                {boards.length === 0 ? (
                    <li className="board-item">No boards available</li>
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

export default ProjectSidebar;

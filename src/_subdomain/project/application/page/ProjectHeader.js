import React from 'react';
import {Link} from 'react-router-dom';

const ProjectHeader = ({project, projectBoard, onDelete, selectedMenu}) => (
    <header
        className="project-header"
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#f9fafb',
        }}
    >
        <div>
            <h2 style={{margin: 0, fontSize: 24, fontWeight: 600}}>{project.fullName} [{project.key}]</h2>
            {/*<div style={{ color: '#888', fontSize: 20 }}>Key: {project.key}</div>*/}
        </div>

        <div style={{display: 'flex', gap: 12}}>
            <Link to={`/projects/edit/${project.id}`} className="btn btn-outline-warning">
                <i className="bi bi-pencil"></i> Edit
            </Link>

            <button onClick={onDelete} className="btn btn-outline-danger">
                <i className="bi bi-trash"></i> Delete
            </button>

            {selectedMenu !== 'labels' &&  (
                <Link to={`/tickets/new?projectId=${project.id}&projectBoardId=${projectBoard.id}`} className="btn btn-outline-primary">
                    <i className="bi bi-plus-circle"></i> Create Ticket
                </Link>
            )}
        </div>

    </header>
);

export default ProjectHeader;

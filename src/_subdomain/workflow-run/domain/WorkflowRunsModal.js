import React from 'react';
import {conclusionIcons} from "../../ticket/application/service/ticketMappers";

const WorkflowRunsModal = ({ runs, onClose }) => {
    if (!runs) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center z-1050"
            onClick={onClose}
            style={{ overflowY: 'auto' }}
        >
            <div
                className="bg-white rounded-3 shadow p-4"
                style={{ maxHeight: '80vh', width: '600px', overflowY: 'auto', position: 'relative' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="m-0">All Linked Workflow Runs</h4>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={onClose}
                    />
                </div>

                {runs.length === 0 ? (
                    <p>No workflow runs found.</p>
                ) : (
                    <ul className="list-unstyled mt-3">
                        {runs.map((run, idx) => (
                            <li key={idx} className="mb-3 p-3 border rounded bg-light">
                                <a href={run.htmlUrl} target="_blank" rel="noreferrer" className="d-block mb-1">
                                    View Workflow Run
                                </a>
                                <div>
                                    Conclusion: <strong>
                                    {conclusionIcons[run.conclusion] || '❓'} {run.conclusion || 'unknown'}
                                </strong>
                                </div>
                                <div>By: {run.actor.name} (<em>{run.actor.login}</em>)</div>
                                <div className="text-muted">Repo: {run.repositoryName}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default WorkflowRunsModal;

import React from 'react';

const PullRequestsModal = ({ pullRequests, onClose }) => {
  if (!pullRequests) return null;

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
            <h4 className="m-0">All Linked Pull Requests</h4>
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
            />
          </div>

          {pullRequests.length === 0 ? (
              <p>No pull requests found.</p>
          ) : (
              <ul className="list-unstyled mt-3">
                {pullRequests.map((pr, idx) => (
                    <li key={idx} className="mb-3 p-3 border rounded bg-light">
                      <a href={pr.htmlUrl} target="_blank" rel="noreferrer" className="d-block mb-1 fw-semibold">
                        {pr.title}
                      </a>
                      <div>Branch: <code>{pr.pullRequestStatus.branchRef}</code></div>
                      <div>Status: {pr.pullRequestStatus.status.replace('STATUS_', '')}</div>
                      <div>By: {pr.actor.name} (<em>{pr.actor.login}</em>)</div>
                      <div className="text-muted">Repo: {pr.repositoryName}</div>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </div>
  );
};

export default PullRequestsModal;

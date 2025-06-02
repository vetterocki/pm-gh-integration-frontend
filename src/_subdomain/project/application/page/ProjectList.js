import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../../../_common/application/service';
import LoadingSpinner from '../../../../_common/application/page/LoadingSpinner';
import Alert from '../../../../_common/application/page/Alert';
import '../../../../resources/styles/ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await projectService.getAllProjects();
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
      <div className="container">
        <div className="card w-100 mx-auto mt-4 shadow">
          <div className="project-card-header">
            <h2>
              <i className="bi bi-kanban-fill"></i> Projects
            </h2>
            <Link to="/projects/new" className="create-project-btn">
              <i className="bi bi-plus-lg"></i> Create New Project
            </Link>
          </div>
          <div className="card-body">
            {projects.length === 0 ? (
                <div className="alert alert-info alert-info-center">
                  <i className="bi bi-info-circle"></i> No projects found.
                </div>
            ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                      <th>Name</th>
                      <th>Key</th>
                      <th>Team</th>
                      <th>Owner</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                          <td>
                            <Link to={`/projects/${project.id}`} className="project-link">
                              {project.fullName}
                            </Link>
                          </td>
                          <td>{project.key || <em className="placeholder-text">Not specified</em>}</td>
                          <td>
                            {project.teamName ? (
                                <Link to={`/teams/name/${encodeURIComponent(project.teamName)}`} className="project-link">
                                  {project.teamName}
                                </Link>
                            ) : (
                                <em className="placeholder-text">Not specified</em>
                            )}
                          </td>
                          <td>
                            {project.projectOwnerName ? (
                                <Link to={`/members/name/${encodeURIComponent(project.projectOwnerName)}`} className="project-link">
                                  {project.projectOwnerName}
                                </Link>
                            ) : (
                                <em className="placeholder-text">Not specified</em>
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ProjectList;

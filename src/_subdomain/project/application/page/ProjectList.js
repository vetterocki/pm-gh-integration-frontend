import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {projectService} from '../../../../_common/application/service';
import LoadingSpinner from '../../../../_common/application/page/LoadingSpinner';
import '../../../../resources/styles/ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getAllProjects();
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error('Error loading projects:', err);
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
              <i className="bi bi-kanban-fill"></i> {t('projects.title')}
            </h2>
            <Link to="/projects/new" className="create-project-btn">
              <i className="bi bi-plus-lg"></i> {t('projects.createNew')}
            </Link>
          </div>
          <div className="card-body">
            {projects.length === 0 ? (
                <div className="alert alert-info alert-info-center">
                  <i className="bi bi-info-circle"></i> {t('projects.noProjects')}
                </div>
            ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                      <th>{t('projects.name')}</th>
                      <th>{t('projects.key')}</th>
                      <th>{t('projects.team')}</th>
                      <th>{t('projects.owner')}</th>
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
                          <td>{project.key || <em className="placeholder-text">{t('common.notSpecified')}</em>}</td>
                          <td>
                            {project.teamName ? (
                                <Link to={`/teams/name/${encodeURIComponent(project.teamName)}`} className="project-link">
                                  {project.teamName}
                                </Link>
                            ) : (
                                <em className="placeholder-text">{t('common.notSpecified')}</em>
                            )}
                          </td>
                          <td>
                            {project.projectOwnerName ? (
                                <Link to={`/members/name/${encodeURIComponent(project.projectOwnerName)}`} className="project-link">
                                  {project.projectOwnerName}
                                </Link>
                            ) : (
                                <em className="placeholder-text">{t('common.notSpecified')}</em>
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

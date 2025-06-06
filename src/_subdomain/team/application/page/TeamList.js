import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {teamService} from '../../../../_common/application/service';
import LoadingSpinner from '../../../../_common/application/page/LoadingSpinner';
import '../../../../resources/styles/TeamList.css';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const teamsData = await teamService.getAllTeams();
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderProjectManager = (team) => {
    if (team.projectManagerName) {
      return (
          <Link to={`/members/name/${encodeURIComponent(team.projectManagerName)}`} className="team-link">
            {team.projectManagerName}
          </Link>
      );
    }
    return <em className="placeholder-text">{t('common.notSpecified')}</em>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
      <div className="container">
        <div className="card w-100 mx-auto mt-4 shadow">
          <div className="team-card-header">
            <h2>
              <i className="bi bi-people-fill"></i> {t('teams.title')}
            </h2>
            <Link to="/teams/new" className="create-team-btn">
              <i className="bi bi-plus-lg"></i> {t('teams.createNew')}
            </Link>
          </div>
          <div className="card-body">
            {teams.length === 0 ? (
                <div className="alert alert-info alert-info-center">
                  <i className="bi bi-info-circle"></i> {t('teams.noTeams')}
                </div>
            ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                      <th>{t('teams.name')}</th>
                      <th>{t('teams.projectManager')}</th>
                      <th>{t('teams.members')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map((team) => (
                        <tr key={team.id}>
                          <td>
                            <Link to={`/teams/${team.id}`} className="team-link">
                              {team.name || t('teams.unnamedTeam')}
                            </Link>
                          </td>
                          <td>{renderProjectManager(team)}</td>
                          <td>{team.teamMemberIds?.length || 0}</td>
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

export default TeamList;

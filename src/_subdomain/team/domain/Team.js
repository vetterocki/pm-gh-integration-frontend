import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {teamMemberService, teamService} from '../../../_common/application/service';
import LoadingSpinner from '../../../_common/application/page/LoadingSpinner';
import "../../../resources/styles/TeamDetail.css"

const Team = () => {
  const { id, teamName } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (!id && !teamName) {
      setLoading(false);
      return;
    }
    loadTeamDetails();
  }, [id, teamName]);

  const loadTeamDetails = async () => {
    try {
      setLoading(true);
      let teamData;

      if (id) {
        teamData = await teamService.getTeamById(id);
      } else if (teamName) {
        teamData = await teamService.findByName(teamName);
        if (teamData && teamData.id) {
          navigate(`/teams/${teamData.id}`, { replace: true });
        }
      }

      if (!teamData) {
        setLoading(false);
        return;
      }

      setTeam(teamData);

      if (teamData.teamMemberIds?.length > 0) {
        try {
          const teamMembersData = await Promise.all(
              teamData.teamMemberIds.map(memberId => teamMemberService.getTeamMemberById(memberId))
          );
          setTeamMembers(teamMembersData.filter(Boolean));
        } catch (memberErr) {
          console.error('Error fetching team members:', memberErr);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!team?.id || !memberId) return;

    const confirmed = window.confirm(t('teamMembers.deleteConfirm'));
    if (!confirmed) return;

    try {
      await teamService.deleteMember(team.id, memberId);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (err) {
      console.error('Error deleting team member:', err);
    }
  };

  const handleDelete = async () => {
    if (!team?.id) return;
    if (window.confirm(t('teams.deleteConfirm'))) {
      try {
        await teamService.deleteTeam(team.id);
        navigate('/teams');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!team) {
    return (
        <div className="container mt-4">
          <div className="alert alert-warning">
            {t('teams.teamNotFound')} <Link to="/teams" className="team-link">{t('teams.backToTeams')}</Link>
          </div>
        </div>
    );
  }

  return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="team-title">{team.name || t('teams.unnamedTeam')}</h1>
          <div>
            <Link to={`/teams/edit/${team.id}`} className="btn btn-warning me-2">
              {t('common.edit')}
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              {t('common.delete')}
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{t('teams.teamDetails')}</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">{t('teams.projectManager')}:</div>
              <div className="col-md-9">
                {team.projectManagerName ? (
                    <Link
                        to={`/members/name/${encodeURIComponent(team.projectManagerName)}`}
                        className="team-link"
                    >
                      {team.projectManagerName}
                    </Link>
                ) : (
                    <em className="placeholder-text">{t('common.notSpecified')}</em>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{t('teams.teamMembers')}</h5>
            <Link to={`/members/new?teamId=${team.id}`} className="btn btn-sm btn-success">
              {t('teams.addTeamMember')}
            </Link>
          </div>
          <div className="card-body">
            {teamMembers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                    <tr>
                      <th>{t('teamMembers.avatar')}</th>
                      <th>{t('teamMembers.fullName')}</th>
                      <th>{t('teamMembers.email')}</th>
                      <th>{t('teamMembers.position')}</th>
                      <th>{t('teamMembers.githubAccount')}</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {teamMembers.map(member => (
                        <tr key={member.id}>
                          <td>
                            {member.avatarUrl && (
                                <img
                                    src={member.avatarUrl}
                                    alt="Avatar preview"
                                    className="avatar-preview-img"
                                    style={{width: '40px', height: '40px', borderRadius: '50%'}}
                                />
                            )}
                          </td>
                          <td>
                            <Link to={`/members/${member.id}`} className="team-link">
                              {member.firstName} {member.lastName}
                            </Link>
                            <br />
                            <small className="text-muted">@{member.loginInGithub}</small>
                          </td>
                          <td>{member.email || <em className="placeholder-text">{t('common.notSpecified')}</em>}</td>
                          <td>{member.position || <em className="placeholder-text">{t('common.notSpecified')}</em>}</td>
                          <td>
                            {member.loginInGithub ? (
                                <a
                                    href={`https://github.com/${member.loginInGithub}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="team-link"
                                >
                                  {member.loginInGithub}
                                </a>
                            ) : (
                                <em className="placeholder-text">{t('common.notSpecified')}</em>
                            )}
                          </td>
                          <td>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteMember(member.id)}
                            >
                              {t('common.remove')}
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>

                </div>
            ) : (
                <div className="alert alert-info">
                  {t('teams.noMembers')}
                </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Link to="/teams" className="btn btn-secondary">
            {t('teams.backToTeams')}
          </Link>
        </div>
      </div>
  );
};

export default Team;

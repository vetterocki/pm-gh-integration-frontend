import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {teamMemberService, teamService} from '../../../_common/application/service';
import LoadingSpinner from '../../../_common/application/page/LoadingSpinner';
import "../../../resources/styles/TeamDetail.css"

const Team = () => {
  const { id, teamName } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id && !teamName) {
      setLoading(false);
      setError('No team identifier provided');
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
        setError('Team not found');
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
      setError('Failed to load team details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!team?.id || !memberId) return;

    const confirmed = window.confirm("Are you sure you want to remove this team member?");
    if (!confirmed) return;

    try {
      await teamService.deleteMember(team.id, memberId);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (err) {
      console.error('Error deleting team member:', err);
      setError('Failed to remove team member. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!team?.id) return;
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamService.deleteTeam(team.id);
        navigate('/teams');
      } catch (err) {
        setError('Failed to delete team. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!team) {
    return (
        <div className="container mt-4">
          <div className="alert alert-warning">
            Team not found. <Link to="/teams" className="team-link">Back to teams</Link>
          </div>
        </div>
    );
  }

  return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="team-title">{team.name || "Unnamed Team"}</h1>
          <div>
            <Link to={`/teams/edit/${team.id}`} className="btn btn-warning me-2">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Team Details</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Project Manager:</div>
              <div className="col-md-9">
                {team.projectManagerName ? (
                    <Link
                        to={`/members/name/${encodeURIComponent(team.projectManagerName)}`}
                        className="team-link"
                    >
                      {team.projectManagerName}
                    </Link>
                ) : (
                    <em className="placeholder-text">Not specified</em>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Team Members</h5>
            <Link to={`/members/new?teamId=${team.id}`} className="btn btn-sm btn-success">
              Add Team Member
            </Link>
          </div>
          <div className="card-body">
            {teamMembers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Position</th>
                      <th>GitHub account link</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {teamMembers.map(member => (
                        <tr key={member.id}>
                          <td style={{ width: 60 }}>
                            {member.avatarUrl ? (
                                <img
                                    src={member.avatarUrl}
                                    alt={`${member.firstName} ${member.lastName} avatar`}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '50%',
                                      objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '50%',
                                      backgroundColor: '#ccc',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#666',
                                      fontSize: 14,
                                      userSelect: 'none',
                                    }}
                                    title="No avatar"
                                >
                                  ?
                                </div>
                            )}
                          </td>
                          <td>
                            <Link to={`/members/${member.id}`} className="team-link">
                              {member.firstName} {member.lastName}
                            </Link>
                            <br />
                            <small className="text-muted">@{member.loginInGithub}</small>
                          </td>
                          <td>{member.email || <em className="placeholder-text">Not specified</em>}</td>
                          <td>{member.position || <em className="placeholder-text">Not specified</em>}</td>
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
                                <em className="placeholder-text">Not specified</em>
                            )}
                          </td>
                          <td>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteMember(member.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>

                </div>
            ) : (
                <div className="alert alert-info">
                  No team members found.
                </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Link to="/teams" className="btn btn-secondary">
            Back to Teams
          </Link>
        </div>
      </div>
  );
};

export default Team;

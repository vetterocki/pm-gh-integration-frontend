import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teamMemberService, teamService } from '../../../_common/application/service';
import LoadingSpinner from '../../../_common/application/page/LoadingSpinner';
import Alert from '../../../_common/application/page/Alert';
import "../../../resources/styles/TeamMemberDetail.css";

const TeamMember = () => {
  const { id, memberName } = useParams();
  const navigate = useNavigate();
  const [teamMember, setTeamMember] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id || memberName) {
      loadTeamMemberDetails();
    } else {
      setLoading(false);
      setError('No team member identifier provided');
    }
  }, [id, memberName]);

  const loadTeamMemberDetails = async () => {
    try {
      setLoading(true);
      let memberData;

      if (id) {
        memberData = await teamMemberService.getTeamMemberById(id);
      } else if (memberName) {
        memberData = await teamMemberService.findByName(memberName);
        if (memberData && memberData.id) {
          navigate(`/members/${memberData.id}`, { replace: true });
        }
      }

      if (!memberData) {
        setError('Team member not found');
        setLoading(false);
        return;
      }

      setTeamMember(memberData);

      if (memberData && memberData.teamId) {
        try {
          const teamData = await teamService.getTeamById(memberData.teamId);
          setTeam(teamData);
        } catch (teamErr) {
          console.error(`Error fetching team ${memberData.teamId}:`, teamErr);
        }
      }
    } catch (err) {
      setError('Failed to load team member details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!teamMember || !teamMember.id) return;

    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamMemberService.deleteTeamMember(teamMember.id);
        navigate(`/teams/${team.id}`);
      } catch (err) {
        setError('Failed to delete team member. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!teamMember) {
    return (
        <div className="container mt-4">
          <div className="alert alert-warning">
            Team member not found. <Link to="/teams" className="team-link">Back to teams</Link>
          </div>
        </div>
    );
  }

  return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="team-title">{teamMember.firstName} {teamMember.lastName}</h1>
          <div>
            <Link to={`/members/edit/${teamMember.id}`} className="btn btn-warning me-2">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Team Member Details</h5>
          </div>
          <div className="card-body">
            {/* Avatar row */}
            {teamMember.avatarUrl && (
                <div className="row mb-4">
                  <div className="col-md-3 fw-bold">Avatar:</div>
                  <div className="col-md-9">
                    <img
                        src={teamMember.avatarUrl}
                        alt={`${teamMember.firstName} ${teamMember.lastName} avatar`}
                        className="avatar-img"
                    />
                  </div>
                </div>
            )}

            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Email:</div>
              <div className="col-md-9">
                <a href={`mailto:${teamMember.email}`} className="team-link">{teamMember.email}</a>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Position:</div>
              <div className="col-md-9">{teamMember.position}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Team:</div>
              <div className="col-md-9">
                {team ? (
                    <Link to={`/teams/${team.id}`} className="team-link">{team.name}</Link>
                ) : (
                    teamMember.teamId || <span className="placeholder-text">Not assigned</span>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3 fw-bold">GitHub Login:</div>
              <div className="col-md-9">{teamMember.loginInGithub || <span className="placeholder-text">N/A</span>}</div>
            </div>
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

export default TeamMember;

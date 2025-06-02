import React, {useState, useEffect} from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import {teamMemberService, teamService} from '../../../../_common/application/service';
import LoadingSpinner from '../../../../_common/application/page/LoadingSpinner';
import Alert from '../../../../_common/application/page/Alert';
import useForm from '../../../../_common/useForm';

import '../../../../resources/styles/TeamMemberForm.css';

const TeamMemberForm = () => {
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Get teamId from query params if present
    const searchParams = new URLSearchParams(location.search);
    const teamIdFromQuery = searchParams.get('teamId');

    const [loading, setLoading] = useState(isEditMode);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
    const [teams, setTeams] = useState([]);

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        teamId: teamIdFromQuery || '',
        avatarUrl: '',
        loginInGithub: ''
    };

    const {values, errors, handleChange, resetForm, setFieldValue} = useForm(initialValues);

    useEffect(() => {
        loadTeams();

        if (isEditMode) {
            loadTeamMember();
        } else {
            // In create mode, reset to initialValues (especially if params change)
            resetForm(initialValues);
        }
    }, [id]);

    const loadTeams = async () => {
        try {
            const teamsData = await teamService.getAllTeams();
            if (Array.isArray(teamsData)) {
                setTeams(teamsData);
            }
        } catch (err) {
            console.error('Error loading teams:', err);
        }
    };

    const loadTeamMember = async () => {
        try {
            setLoading(true);
            const member = await teamMemberService.getTeamMemberById(id);

            if (member) {
                resetForm({
                    firstName: member.firstName || '',
                    lastName: member.lastName || '',
                    email: member.email || '',
                    position: member.position || '',
                    teamId: member.teamId || '',
                    avatarUrl: member.avatarUrl || '',
                    loginInGithub: member.loginInGithub || ''
                });
            }
        } catch (err) {
            setError('Failed to load team member details. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!values.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        if (!values.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        if (!values.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(values.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!values.position.trim()) {
            newErrors.position = 'Position is required';
            isValid = false;
        }

        if (!values.teamId) {
            newErrors.teamId = 'Team is required';
            isValid = false;
        }

        return {isValid, errors: newErrors};
    };

    const prepareFormData = () => {
        return {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            position: values.position.trim(),
            teamId: values.teamId || null,
            avatarUrl: values.avatarUrl?.trim() || null,
            loginInGithub: values.loginInGithub.trim() || ''
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {isValid, errors: validationErrors} = validateForm();

        if (!isValid) {
            Object.keys(validationErrors).forEach(key => {
                setFieldValue(key, validationErrors[key]);
            });
            return;
        }

        try {
            setSubmitLoading(true);
            setError(null);

            const formData = prepareFormData();

            if (isEditMode) {
                await teamMemberService.updateTeamMember(id, formData);
            } else {
                await teamMemberService.createTeamMember(formData);
            }

            navigate(`/teams/${formData.teamId}`);
        } catch (err) {
            setError(`Failed to ${isEditMode ? 'update' : 'create'} team member. Please try again.`);
            console.error(err);
        } finally {
            setSubmitLoading(false);
        }
    };

    const isValidUrl = (urlString) => {
        try {
            return Boolean(new URL(urlString));
        } catch (e) {
            return false;
        }
    };

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <div className="team-member-form-container mt-4">
            <h1>{isEditMode ? 'Edit Team Member' : 'Create New Team Member'}</h1>
            <form onSubmit={handleSubmit} className="team-member-form mt-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">First Name*</label>
                        <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            id="firstName"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            required
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name*</label>
                        <input
                            type="text"
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            id="lastName"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            required
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email*</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="loginInGithub" className="form-label">Login in Github</label>
                    <input
                        type="text"
                        className={`form-control ${errors.loginInGithub ? 'is-invalid' : ''}`}
                        id="loginInGithub"
                        name="loginInGithub"
                        value={values.loginInGithub}
                        onChange={handleChange}
                    />
                    {errors.loginInGithub && <div className="invalid-feedback">{errors.loginInGithub}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="position" className="form-label">Position*</label>
                    <input
                        type="text"
                        className={`form-control ${errors.position ? 'is-invalid' : ''}`}
                        id="position"
                        name="position"
                        value={values.position}
                        onChange={handleChange}
                        placeholder="e.g., Developer, Designer, Manager"
                        required
                    />
                    {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="teamId" className="form-label">Team*</label>
                    <select
                        className={`form-select ${errors.teamId ? 'is-invalid' : ''}`}
                        id="teamId"
                        name="teamId"
                        value={values.teamId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a team</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                    {errors.teamId && <div className="invalid-feedback">{errors.teamId}</div>}
                </div>

                {isEditMode && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="avatarUrl" className="form-label">Avatar URL</label>
                            <input
                                type="url"
                                className="form-control"
                                id="avatarUrl"
                                name="avatarUrl"
                                value={values.avatarUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>

                        <div className="row mb-3">
                            {values.avatarUrl && isValidUrl(values.avatarUrl) && (
                                <div className="col-md-6 d-flex flex-column align-items-start avatar-preview-wrapper">
                                    <label className="form-label mb-2">Avatar Preview:</label>
                                    <img
                                        src={values.avatarUrl}
                                        alt="Avatar preview"
                                        className="avatar-preview-img"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="team-member-form-buttons">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate(`/teams/${teamIdFromQuery || ''}`)}
                        disabled={submitLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitLoading}
                    >
                        {submitLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"
                                      aria-hidden="true"></span>
                                {isEditMode ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            isEditMode ? 'Update Team Member' : 'Create Team Member'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeamMemberForm;

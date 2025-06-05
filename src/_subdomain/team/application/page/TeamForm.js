import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {teamMemberService, teamService} from '../../../../_common/application/service';
import LoadingSpinner from '../../../../_common/application/page/LoadingSpinner';
import useForm from '../../../../_common/useForm';
import "../../../../resources/styles/TeamForm.css";

const TeamForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [submitLoading, setSubmitLoading] = useState(false);

    const initialValues = {
        name: '',
        projectManagerName: '',
        teamMemberIds: []
    };

    const { values, errors, handleChange, resetForm, setFieldValue } = useForm(initialValues);

    useEffect(() => {
        if (isEditMode) {
            loadTeam();
        }
    }, [id]);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allMembers, setAllMembers] = useState([]);

    useEffect(() => {
        const loadTeamMembers = async () => {
            try {
                const members = await teamMemberService.getAllTeamMembers();
                setAllMembers(members);
            } catch (err) {
                console.error('Failed to load team members:', err);
            }
        };
        loadTeamMembers();
    }, []);

    const handleManagerInputChange = (e) => {
        const inputValue = e.target.value;
        handleChange(e);
        if (inputValue.length > 0) {
            const filtered = allMembers.filter(member =>
                `${member.firstName} ${member.lastName}`.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (member) => {
        const fullName = `${member.firstName} ${member.lastName}`;
        setFieldValue('projectManagerName', fullName);
        setShowSuggestions(false);
    };

    const loadTeam = async () => {
        try {
            setLoading(true);
            const team = await teamService.getTeamById(id);

            if (team) {
                let projectManagerName = '';

                if (team.projectManagerName) {
                    projectManagerName = team.projectManagerName;
                } else if (team.projectManagerId) {
                    try {
                        const manager = await teamMemberService.getTeamMemberById(team.projectManagerId);
                        if (manager) {
                            projectManagerName = `${manager.firstName} ${manager.lastName}`.trim();
                        }
                    } catch (err) {
                        console.error('Failed to fetch manager details:', err);
                    }
                }

                resetForm({
                    name: team.name || '',
                    projectManagerName: projectManagerName,
                    teamMemberIds: team.teamMemberIds || []
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!values.name.trim()) {
            newErrors.name = t('validation.teamNameRequired');
            isValid = false;
        }

        return { isValid, errors: newErrors };
    };

    const prepareFormData = () => {
        return {
            name: values.name.trim(),
            projectManagerName: values.projectManagerName.trim() || null,
            teamMemberIds: values.teamMemberIds && values.teamMemberIds.length > 0 ? values.teamMemberIds : []
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { isValid, errors: validationErrors } = validateForm();

        if (!isValid) {
            Object.keys(validationErrors).forEach(key => {
                setFieldValue(key, validationErrors[key]);
            });
            return;
        }

        try {
            setSubmitLoading(true);
            const formData = prepareFormData();

            let result
            if (isEditMode) {
                result = await teamService.updateTeam(id, formData);
            } else {
                result = await teamService.createTeam(formData);
            }

            navigate(`/teams/${result.id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mt-4">
            <h1 className="team-title">{isEditMode ? t('teams.editTeam') : t('teams.createTeam')}</h1>

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">{t('teams.teamName')}*</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3 position-relative">
                    <label htmlFor="projectManagerName" className="form-label">{t('teams.projectManager')}</label>
                    <input
                        type="text"
                        className={`form-control ${errors.projectManagerName ? 'is-invalid' : ''}`}
                        id="projectManagerName"
                        name="projectManagerName"
                        value={values.projectManagerName}
                        onChange={handleManagerInputChange}
                        placeholder={t('teamMembers.enterProjectManagerName')}
                        autoComplete="off"
                    />
                    {errors.projectManagerName && <div className="invalid-feedback">{errors.projectManagerName}</div>}

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="list-group suggestion-dropdown">
                            {suggestions.map(member => (
                                <li
                                    key={member.id}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleSelectSuggestion(member)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {member.firstName} {member.lastName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitLoading}
                    >
                        {submitLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {isEditMode ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            isEditMode ? 'Update Team' : 'Create Team'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeamForm;

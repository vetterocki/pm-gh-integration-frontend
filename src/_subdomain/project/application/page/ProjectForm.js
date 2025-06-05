import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {projectService, teamMemberService, teamService} from '../../../../_common/application/service';
import LoadingSpinner from '../../../../_common/application/page/LoadingSpinner';
import useForm from '../../../../_common/useForm';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [submitLoading, setSubmitLoading] = useState(false);

  const initialValues = {
    fullName: '',
    key: '',
    teamName: '',
    projectOwnerName: ''
  };

  const { values, errors, handleChange, resetForm, setFieldValue } = useForm(initialValues);

  const [teamSuggestions, setTeamSuggestions] = useState([]);
  const [showTeamSuggestions, setShowTeamSuggestions] = useState(false);
  const [allTeams, setAllTeams] = useState([]);

  const [ownerSuggestions, setOwnerSuggestions] = useState([]);
  const [showOwnerSuggestions, setShowOwnerSuggestions] = useState(false);
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      loadProject();
    }
  }, [id]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teams = await teamService.getAllTeams();
        setAllTeams(teams);
      } catch (err) {
        console.error('Failed to load teams:', err);
      }
    };

    const loadMembers = async () => {
      try {
        const members = await teamMemberService.getAllTeamMembers();
        setAllMembers(members);
      } catch (err) {
        console.error('Failed to load team members:', err);
      }
    };

    loadTeams();
    loadMembers();
  }, []);

  const loadProject = async () => {
    try {
      setLoading(true);
      const project = await projectService.getProjectById(id)

      Object.keys(project).forEach((key) => {
        if (key in initialValues) {
          setFieldValue(key, project[key]);
        }
      });

      resetForm({
        fullName: project.fullName.trim(),
        key: project.key.trim(),
        teamName: project.teamName.trim(),
        projectOwnerName: project.projectOwnerName.trim()
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamInputChange = (e) => {
    const inputValue = e.target.value;
    handleChange(e);

    if (inputValue.length > 0) {
      const filtered = allTeams.filter((team) =>
          team.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setTeamSuggestions(filtered);
      setShowTeamSuggestions(true);
    } else {
      setTeamSuggestions([]);
      setShowTeamSuggestions(false);
    }
  };

  const handleSelectTeamSuggestion = (team) => {
    setFieldValue('teamName', team.name);
    setShowTeamSuggestions(false);
  };

  const handleOwnerInputChange = (e) => {
    const inputValue = e.target.value;
    handleChange(e);

    if (inputValue.length > 0) {
      const filtered = allMembers.filter((member) =>
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(inputValue.toLowerCase())
      );
      setOwnerSuggestions(filtered);
      setShowOwnerSuggestions(true);
    } else {
      setOwnerSuggestions([]);
      setShowOwnerSuggestions(false);
    }
  };

  const handleSelectOwnerSuggestion = (member) => {
    const fullName = `${member.firstName} ${member.lastName}`;
    setFieldValue('projectOwnerName', fullName);
    setShowOwnerSuggestions(false);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!values.fullName.trim()) {
      newErrors.fullName = t('validation.projectNameRequired');
      isValid = false;
    }

    if (!values.key.trim()) {
      newErrors.key = t('validation.projectKeyRequired');
      isValid = false;
    }

    if (!values.teamName.trim()) {
      newErrors.teamName = t('validation.teamNameRequired');
      isValid = false;
    }

    if (!values.projectOwnerName.trim()) {
      newErrors.projectOwnerName = t('validation.projectOwnerRequired');
      isValid = false;
    }

    return { isValid, errors: newErrors };
  };

  const prepareFormData = () => {
    return {
      fullName: values.fullName.trim(),
      key: values.key.trim(),
      teamName: values.teamName.trim(),
      projectOwnerName: values.projectOwnerName.trim()
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateForm();

    if (!isValid) {
      Object.keys(validationErrors).forEach((key) => {
        setFieldValue(key, validationErrors[key]);
      });
      return;
    }

    try {
      setSubmitLoading(true);

      const formData = prepareFormData();

      if (isEditMode) {
        await projectService.updateProject(id, formData);
      } else {
        await projectService.createProject(formData);
      }

      navigate(`/projects`);
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
        <h1>{isEditMode ? t('projects.editProject') : t('projects.createProject')}</h1>
        <form onSubmit={handleSubmit} className="mt-4" autoComplete="off">
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              {t('projects.projectName')}*
            </label>
            <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                id="fullName"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                required
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="key" className="form-label">
              {t('projects.projectKey')}*
            </label>
            <input
                type="text"
                className={`form-control ${errors.key ? 'is-invalid' : ''}`}
                id="key"
                name="key"
                value={values.key}
                onChange={handleChange}
                placeholder="e.g., PROJ"
                required
            />
            {errors.key && <div className="invalid-feedback">{errors.key}</div>}
            <small className="form-text text-muted">
              {t('projects.projectKeyHint')}
            </small>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="teamName" className="form-label">
              {t('projects.teamName')}*
            </label>
            <input
                type="text"
                className={`form-control ${errors.teamName ? 'is-invalid' : ''}`}
                id="teamName"
                name="teamName"
                value={values.teamName}
                onChange={handleTeamInputChange}
                required
                autoComplete="off"
            />
            {errors.teamName && <div className="invalid-feedback">{errors.teamName}</div>}
            {showTeamSuggestions && teamSuggestions.length > 0 && (
                <ul
                    className="list-group suggestion-dropdown"
                    style={{ position: 'absolute', zIndex: 1000, width: '100%' }}
                >
                  {teamSuggestions.map((team) => (
                      <li
                          key={team.id}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSelectTeamSuggestion(team)}
                          style={{ cursor: 'pointer' }}
                      >
                        {team.name}
                      </li>
                  ))}
                </ul>
            )}
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="projectOwnerName" className="form-label">
              {t('projects.projectOwnerName')}*
            </label>
            <input
                type="text"
                className={`form-control ${errors.projectOwnerName ? 'is-invalid' : ''}`}
                id="projectOwnerName"
                name="projectOwnerName"
                value={values.projectOwnerName}
                onChange={handleOwnerInputChange}
                required
                autoComplete="off"
            />
            {errors.projectOwnerName && <div className="invalid-feedback">{errors.projectOwnerName}</div>}
            {showOwnerSuggestions && ownerSuggestions.length > 0 && (
                <ul
                    className="list-group suggestion-dropdown"
                    style={{ position: 'absolute', zIndex: 1000, width: '100%' }}
                >
                  {ownerSuggestions.map((member) => (
                      <li
                          key={member.id}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSelectOwnerSuggestion(member)}
                          style={{ cursor: 'pointer' }}
                      >
                        {member.firstName} {member.lastName}
                      </li>
                  ))}
                </ul>
            )}
          </div>

          <button
              type="submit"
              className="btn btn-primary"
              disabled={submitLoading}
          >
            {submitLoading ? t('common.saving') : (isEditMode ? t('projects.updateProject') : t('projects.createProject'))}
          </button>
        </form>
      </div>
  );
};

export default ProjectForm;

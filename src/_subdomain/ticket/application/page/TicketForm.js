import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {labelService, teamMemberService, ticketService} from '../../../../_common/application/service';
import LoadingSpinner from '../../../../_common/application/page/LoadingSpinner';
import useForm from '../../../../_common/useForm';
import "../../../../resources/styles/TicketForm.css";

const priorities = ['LOW', 'MEDIUM', 'MAJOR', 'CRITICAL'];


const TicketForm = () => {
    const navigate = useNavigate();

    const initialValues = {
        summary: '',
        description: '',
        assigneeName: '',
        assigneeId: null,
        priority: 'MEDIUM',
        labelIds: []
    };

    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');
    const projectBoardId = searchParams.get('projectBoardId');

    const {values, errors, handleChange, setFieldValue} = useForm(initialValues);

    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [, setAllMembers] = useState([]);

    const [allLabels, setAllLabels] = useState([]);
    const [labelSuggestions, setLabelSuggestions] = useState([]);
    const [showLabelSuggestions, setShowLabelSuggestions] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const members = await teamMemberService.getAllTeamMembers();
                setAllMembers(members);
                const labels = await labelService.getAllLabels();
                setAllLabels(labels);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleLabelInputChange = (e) => {
        const val = e.target.value;
        if (val.length > 0) {
            const filtered = allLabels.filter(label => label.name.toLowerCase().includes(val.toLowerCase()) && !values.labelIds.includes(label.id));
            setLabelSuggestions(filtered);
            setShowLabelSuggestions(true);
        } else {
            setLabelSuggestions([]);
            setShowLabelSuggestions(false);
        }
    };

    const handleAddLabel = (label) => {
        setFieldValue('labelIds', [...values.labelIds, label.id]);
        setShowLabelSuggestions(false);
    };

    const handleRemoveLabel = (labelId) => {
        setFieldValue('labelIds', values.labelIds.filter(id => id !== labelId));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!values.summary.trim()) {
            newErrors.summary = 'Summary is required';
            isValid = false;
        }

        return {isValid, errors: newErrors};
    };

    const prepareFormData = () => ({
        summary: values.summary.trim(),
        description: values.description.trim(),
        assigneeId: values.assigneeId,
        priority: values.priority,
        labelIds: values.labelIds,
        projectId,
        projectBoardId,
    });



    const handleSubmit = async (e) => {
        e.preventDefault();

        const {isValid, errors: validationErrors} = validateForm();
        if (!isValid) {
            Object.keys(validationErrors).forEach(key => setFieldValue(key, validationErrors[key]));
            return;
        }

        try {
            setSubmitLoading(true);

            const formData = prepareFormData();
            console.log(formData)
            await ticketService.createTicket(formData);
            navigate('/tickets');
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <LoadingSpinner/>;

    return (<div className="container mt-4">
            <h1 className="ticket-title-form">Create New Ticket</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="summary" className="form-label">Summary*</label>
                    <input
                        type="text"
                        className={`form-control ${errors.summary ? 'is-invalid' : ''}`}
                        id="summary"
                        name="summary"
                        value={values.summary}
                        onChange={handleChange}
                        required
                    />
                    {errors.summary && <div className="invalid-feedback">{errors.summary}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="5"
                        value={values.description}
                        onChange={handleChange}
                    />
                </div>


                <div className="mb-3">
                    <label htmlFor="priority" className="form-label">Priority</label>
                    <select
                        className="form-select"
                        id="priority"
                        name="priority"
                        value={values.priority}
                        onChange={handleChange}
                    >
                        {priorities.map(p => (<option key={p} value={p}>{p}</option>))}
                    </select>
                </div>


                {/* Labels multi-select */}
                <div className="mb-3 position-relative">
                    <label htmlFor="labelInput" className="form-label">Labels</label>
                    <input
                        type="text"
                        className="form-control"
                        id="labelInput"
                        placeholder="Type to search and add labels"
                        onChange={handleLabelInputChange}
                        autoComplete="off"
                    />
                    {showLabelSuggestions && labelSuggestions.length > 0 && (
                        <ul className="list-group suggestion-dropdown">
                            {labelSuggestions.map(label => (<li
                                    key={label.id}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleAddLabel(label)}
                                    style={{cursor: 'pointer'}}
                                >
                  <span
                      style={{
                          display: 'inline-block',
                          width: '14px',
                          height: '14px',
                          backgroundColor: label.color,
                          marginRight: '8px',
                          borderRadius: '3px'
                      }}
                  />
                                    {label.name}
                                </li>))}
                        </ul>)}
                    <div className="selected-labels mt-2">
                        {values.labelIds.map(id => {
                            const label = allLabels.find(l => l.id === id);
                            if (!label) return null;
                            return (<span
                                    key={id}
                                    className="badge bg-secondary me-1"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => handleRemoveLabel(id)}
                                    title="Click to remove"
                                >
                  {label.name} &times;
                </span>);
                        })}
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/tickets')}
                        disabled={submitLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitLoading}
                    >
                        {submitLoading ? (<>
                                <span className="spinner-border spinner-border-sm me-2" role="status"
                                      aria-hidden="true"></span>
                                Creating...
                            </>) : ('Create Ticket')}
                    </button>
                </div>
            </form>
        </div>);
};

export default TicketForm;

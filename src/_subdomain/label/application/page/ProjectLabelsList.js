import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import ProjectLabel from '../../domain/ProjectLabel';
import { labelService } from '../../../../_common/application/service';

const LabelCreator = ({ project, onLabelCreated }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#36b37e');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newLabel = {
            name,
            color,
            description,
            projectId: project.id,
        };

        try {
            const createdLabel = await labelService.createLabel(newLabel);
            onLabelCreated(createdLabel);
            setName('');
            setColor('#36b37e');
            setDescription('');
        } catch (error) {
            console.error('Label creation failed:', error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: 24,
                border: '1px solid #ddd',
                borderRadius: 10,
                backgroundColor: '#fafafa',
                minWidth: 320,       // увеличена ширина
                minHeight: 480,      // высота увеличена для комфорта
                userSelect: 'none',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)', // лёгкая тень для глубины
            }}
        >
            <h4 style={{ margin: 0, alignSelf: 'flex-start', fontSize: 20, fontWeight: '600' }}>
                Create New Label
            </h4>

            <input
                type="text"
                placeholder="Label name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                    padding: 12,
                    fontSize: 16,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    width: '100%',
                    maxWidth: 280,
                    boxSizing: 'border-box',
                }}
            />

            <div
                style={{
                    marginTop: 8,
                    marginBottom: 12,
                    width: 280,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <ChromePicker
                    color={color}
                    onChangeComplete={(color) => setColor(color.hex)}
                    disableAlpha={true}
                    styles={{
                        default: {
                            picker: {
                                boxShadow: 'none',
                                width: '100%',
                            },
                        },
                    }}
                />
            </div>

            <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5} // чуть больше строк
                style={{
                    padding: 12,
                    fontSize: 16,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    resize: 'vertical',
                    width: '100%',
                    maxWidth: 280,
                    boxSizing: 'border-box',
                }}
            />
            <button
                type="submit"
                style={{
                    padding: '12px 0',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: 18,
                    transition: 'background-color 0.3s ease',
                    width: '100%',
                    maxWidth: 280,
                    boxSizing: 'border-box',
                    userSelect: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
            >
                Create Label
            </button>
        </form>
    );
};

const ProjectLabelsList = ({ labels: initialLabels = [], project }) => {
    const [labels, setLabels] = React.useState(initialLabels);

    const handleLabelCreated = (newLabel) => {
        setLabels((prevLabels) => [...prevLabels, newLabel]);
    };

    const handleDeleteLabel = async (labelId) => {
        if (!window.confirm('Are you sure you want to delete this label?')) return;

        try {
            await labelService.deleteLabel(labelId);
            setLabels((prevLabels) => prevLabels.filter((label) => label.id !== labelId));
        } catch (error) {
            console.error('Failed to delete label:', error);
        }
    };

    const grouped = labels.reduce((acc, label) => {
        const color = label.color || 'Uncategorized';
        if (!acc[color]) acc[color] = [];
        acc[color].push(label);
        return acc;
    }, {});

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                padding: 24,
                gap: 24,
                boxSizing: 'border-box',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            {/* Labels List */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    overflowY: 'auto',
                    paddingRight: 12,
                }}
            >
                {Object.entries(grouped).length > 0 ? (
                    Object.entries(grouped).map(([color, group]) => (
                        <div key={color} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {group.map((label) => (
                                    <ProjectLabel key={label.id} label={label} onDelete={handleDeleteLabel} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ color: '#999', fontStyle: 'italic' }}>No labels available.</div>
                )}
            </div>

            {/* Label Creator */}
            <LabelCreator project={project} onLabelCreated={handleLabelCreated} />
        </div>
    );
};

export default ProjectLabelsList;

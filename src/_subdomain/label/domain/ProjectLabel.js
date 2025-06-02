import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import '../../../resources/styles/ProjectLabel.css';

const ProjectLabel = ({ label, onDelete, style }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [locked, setLocked] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState({});
    const tooltipRef = useRef(null);
    const labelRef = useRef(null);

    const isNode = (obj) => obj && typeof obj.contains === 'function';

    const handleMouseEnter = () => {
        if (!locked) setShowTooltip(true);
    };

    const handleMouseLeave = (e) => {
        if (locked) return;

        const related = e.relatedTarget;

        const tooltipNode = tooltipRef.current;
        const labelNode = labelRef.current;

        if (
            related &&
            tooltipNode instanceof Node &&
            tooltipNode.contains(related)
        ) {
            return;
        }

        if (
            related &&
            labelNode instanceof Node &&
            labelNode.contains(related)
        ) {
            return;
        }

        setShowTooltip(false);
    };

    const handleClick = () => {
        setLocked((prev) => {
            const newLocked = !prev;
            setShowTooltip(newLocked);
            return newLocked;
        });
    };

    useEffect(() => {
        if (!locked) return;

        const handleOutsideClick = (e) => {
            const target = e.target;
            if (
                tooltipRef.current &&
                isNode(tooltipRef.current) &&
                labelRef.current &&
                isNode(labelRef.current) &&
                target instanceof Node &&
                !tooltipRef.current.contains(target) &&
                !labelRef.current.contains(target)
            ) {
                setLocked(false);
                setShowTooltip(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [locked]);

    useLayoutEffect(() => {
        if (showTooltip && tooltipRef.current && labelRef.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const labelRect = labelRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const MIN_LEFT_GAP = 320;

            let left = labelRect.left + labelRect.width / 2 - tooltipRect.width / 2 - 50;

            if (left < MIN_LEFT_GAP) left = MIN_LEFT_GAP;

            if (left + tooltipRect.width > viewportWidth - 8) {
                left = viewportWidth - tooltipRect.width - 8;
            }

            let top = labelRect.top - tooltipRect.height - 8;

            if (top < 8) {
                top = labelRect.bottom + 8;
            }

            setTooltipStyle({
                position: 'fixed',
                left: `${left}px`,
                top: `${top}px`,
                bottom: 'auto',
                zIndex: 1000,
                maxWidth: '700px',
            });
        }
    }, [showTooltip]);

    return (
        <>
      <span
          ref={labelRef}
          className="project-label"
          style={{ backgroundColor: label.color || '#36b37e', ...style }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
              }
          }}
          aria-pressed={locked}
          aria-label={`Label: ${label.name}, click to toggle description tooltip`}
      >
        <i className="bi bi-tag-fill me-2 icon"></i>
        <span>{label.name}</span>
      </span>

            {showTooltip && label.description &&
                ReactDOM.createPortal(
                    <div
                        ref={tooltipRef}
                        className="tooltip-popup"
                        style={tooltipStyle}
                        onMouseEnter={handleMouseEnter}
                        // onMouseLeave={handleMouseLeave}
                    >
                        <div className="tooltip-text">{label.description}</div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(label.id);
                            }}
                            className="tooltip-delete-btn"
                            aria-label={`Delete label ${label.name}`}
                        >
                            ×
                        </button>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default ProjectLabel;

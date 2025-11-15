import React, { useState } from 'react';
import AdminVariant from './AdminVariant';

const AdminComponent = ({ component, onUpdate, onEditComponent, onEditVariant, csrfToken }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        const response = await fetch(`/api/v1/components/${component.id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': csrfToken
          }
        });
        if (!response.ok) throw new Error('Failed to delete component');
        onUpdate();
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    }
  };

  return (
    <div className="admin-component-card">
      <div className="admin-component-header">
        <div className="d-flex align-items-center flex-grow-1">
          <button
            className="admin-expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
          </button>
          <div className="admin-component-info">
            <h4 className="admin-component-name">{component.name}</h4>
            <div className="admin-component-meta">
              <span className={`admin-meta-badge ${component.active ? 'active' : 'inactive'}`}>
                {component.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <div className="admin-component-actions">
          <button onClick={() => onEditComponent(component)} className="admin-action-btn" title="Edit component">
            <i className="fas fa-pen"></i>
          </button>
          <button onClick={handleDelete} className="admin-action-btn admin-action-delete" title="Delete component">
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      {isExpanded && component.variants && component.variants.length > 0 && (
        <div className="admin-component-variants">
          {component.variants.map(variant => (
            <AdminVariant
              key={variant.id}
              variant={variant}
              onUpdate={onUpdate}
              onEditVariant={onEditVariant}
              csrfToken={csrfToken}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComponent;
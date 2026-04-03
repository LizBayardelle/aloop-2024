import React, { useState } from 'react';
import AdminVariant from './AdminVariant';

const AdminComponent = ({ component, onUpdate, onEditComponent, onAddVariant, onEditVariant, csrfToken }) => {
  const [showVariants, setShowVariants] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Delete component "${component.name}" and all its variants?`)) {
      try {
        const response = await fetch(`/api/v1/components/${component.id}`, {
          method: 'DELETE',
          headers: { 'X-CSRF-Token': csrfToken }
        });
        if (!response.ok) throw new Error('Failed to delete component');
        onUpdate();
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    }
  };

  const variantCount = component.variants?.length || 0;

  return (
    <div className="ac-card">
      <div className="ac-header">
        <div className="ac-header-left">
          <button
            className="ac-toggle-btn"
            onClick={() => setShowVariants(!showVariants)}
          >
            <i className={`fas fa-chevron-${showVariants ? 'down' : 'right'}`}></i>
          </button>
          <span className="ac-name">{component.name}</span>
          <span className="ac-count">{variantCount}</span>
          {!component.active && <span className="ap-badge ap-badge--inactive">Inactive</span>}
        </div>
        <div className="ac-actions">
          <button onClick={() => onAddVariant(component)} className="ac-add-btn" title="Add variant">
            <i className="fas fa-plus"></i>
          </button>
          <button onClick={() => onEditComponent(component)} className="ap-action-btn" title="Edit component">
            <i className="fas fa-pen"></i>
          </button>
          <button onClick={handleDelete} className="ap-action-btn ap-action-btn--danger" title="Delete component">
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      {showVariants && (
        <div className="ac-variants">
          {variantCount > 0 ? (
            component.variants.map(variant => (
              <AdminVariant
                key={variant.id}
                variant={variant}
                onUpdate={onUpdate}
                onEditVariant={onEditVariant}
                csrfToken={csrfToken}
              />
            ))
          ) : (
            <div className="ac-empty-hint">No variants yet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminComponent;

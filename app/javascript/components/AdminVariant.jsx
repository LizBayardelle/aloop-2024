import React from 'react';

const AdminVariant = ({ variant, onUpdate, onEditVariant, csrfToken }) => {
  const handleDelete = async () => {
    if (window.confirm(`Delete variant "${variant.name}"?`)) {
      try {
        const response = await fetch(`/api/v1/variants/${variant.id}`, {
          method: 'DELETE',
          headers: { 'X-CSRF-Token': csrfToken }
        });
        if (!response.ok) throw new Error('Failed to delete variant');
        onUpdate();
      } catch (error) {
        console.error('Error deleting variant:', error);
      }
    }
  };

  const priceNum = parseFloat(variant.price) || 0;

  return (
    <div className="av-row">
      <div className="av-info">
        <span className="av-name">{variant.name}</span>
        {priceNum > 0 && <span className="av-price">+${priceNum.toFixed(2)}</span>}
        {variant.sku && <span className="av-sku">{variant.sku}</span>}
        {!variant.active && <span className="ap-badge ap-badge--inactive">Inactive</span>}
      </div>
      <div className="av-actions">
        <button onClick={() => onEditVariant(variant)} className="ap-action-btn ap-action-btn--sm" title="Edit variant">
          <i className="fas fa-pen"></i>
        </button>
        <button onClick={handleDelete} className="ap-action-btn ap-action-btn--sm ap-action-btn--danger" title="Delete variant">
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default AdminVariant;

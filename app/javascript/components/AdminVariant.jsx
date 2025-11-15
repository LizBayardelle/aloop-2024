import React from 'react';

const AdminVariant = ({ variant, onUpdate, onEditVariant, csrfToken }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        const response = await fetch(`/api/v1/variants/${variant.id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': csrfToken
          }
        });
        if (!response.ok) throw new Error('Failed to delete variant');
        onUpdate();
      } catch (error) {
        console.error('Error deleting variant:', error);
      }
    }
  };

  return (
    <div className="admin-variant-card">
      <div className="admin-variant-header">
        <div className="admin-variant-name">{variant.name}</div>
        <div className="admin-variant-actions">
          <button onClick={() => onEditVariant(variant)} className="admin-action-btn" title="Edit variant">
            <i className="fas fa-pen"></i>
          </button>
          <button onClick={handleDelete} className="admin-action-btn admin-action-delete" title="Delete variant">
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <div className="admin-variant-details">
        <span className="admin-variant-detail-inline">
          <strong>SKU:</strong> {variant.sku || '—'}
        </span>
        <span className="admin-variant-detail-inline">
          <strong>Price:</strong> ${variant.price || '0.00'}
        </span>
        <span className="admin-variant-detail-inline">
          <strong>Photos:</strong> {variant.photos_count || 0}
        </span>
        <span className="admin-variant-detail-inline">
          <strong>Status:</strong>
          <span className={`admin-meta-badge ${variant.active ? 'active' : 'inactive'}`}>
            {variant.active ? 'Active' : 'Inactive'}
          </span>
        </span>
        <span className="admin-variant-detail-inline">
          <strong>Vendor:</strong> {variant.vendor || '—'}
        </span>
        <span className="admin-variant-detail-inline">
          <strong>Vendor Part #:</strong> {variant.vendor_parts_number || '—'}
        </span>
        <span className="admin-variant-detail-inline">
          <strong>Bike Models:</strong>
          {variant.bike_models?.length > 0
            ? variant.bike_models.map(model => model.name).join(', ')
            : '—'}
        </span>
      </div>
    </div>
  );
};

export default AdminVariant;
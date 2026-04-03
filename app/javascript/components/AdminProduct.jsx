import React, { useState } from 'react';
import AdminComponent from './AdminComponent';

const AdminProduct = ({ product, onUpdate, onEditProduct, onAddComponent, onEditComponent, onAddVariant, onEditVariant, csrfToken }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Delete "${product.name}"? This will also delete all its components and variants.`)) {
      try {
        const response = await fetch(`/api/v1/products/${product.id}`, {
          method: 'DELETE',
          headers: { 'X-CSRF-Token': csrfToken }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        onUpdate();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const componentCount = product.components?.length || 0;
  const variantCount = product.components?.reduce((sum, c) => sum + (c.variants?.length || 0), 0) || 0;

  return (
    <div className={`ap-card ${!product.active ? 'ap-card--inactive' : ''}`}>
      {/* Product Header */}
      <div className="ap-header">
        <div className="ap-header-left">
          <div className="ap-title-row">
            <h3 className="ap-name">{product.name}</h3>
            {!product.active && <span className="ap-badge ap-badge--inactive">Inactive</span>}
          </div>
          <div className="ap-meta">
            {product.price && (
              <span className="ap-meta-item">
                <i className="fas fa-tag"></i> {product.price}
              </span>
            )}
            <span className="ap-meta-item">
              <i className="fas fa-puzzle-piece"></i> {componentCount} component{componentCount !== 1 ? 's' : ''}
            </span>
            <span className="ap-meta-item">
              <i className="fas fa-layer-group"></i> {variantCount} variant{variantCount !== 1 ? 's' : ''}
            </span>
            <span className="ap-meta-item">
              <i className="fas fa-image"></i> {product.main_photos_count || 0}
            </span>
            {product.weight > 0 && (
              <span className="ap-meta-item">
                <i className="fas fa-weight-hanging"></i> {product.weight} lbs
              </span>
            )}
          </div>
        </div>
        <div className="ap-actions">
          <button onClick={() => onEditProduct(product)} className="ap-action-btn" title="Edit product">
            <i className="fas fa-pen"></i>
          </button>
          <button onClick={handleDelete} className="ap-action-btn ap-action-btn--danger" title="Delete product">
            <i className="fas fa-trash-alt"></i>
          </button>
          <button
            className="ap-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'down'}`}></i>
          </button>
        </div>
      </div>

      {/* Components (shown by default) */}
      {!isCollapsed && (
        <div className="ap-body">
          {componentCount > 0 ? (
            <div className="ap-components">
              {product.components.map(component => (
                <AdminComponent
                  key={component.id}
                  component={component}
                  onUpdate={onUpdate}
                  onEditComponent={onEditComponent}
                  onAddVariant={onAddVariant}
                  onEditVariant={onEditVariant}
                  csrfToken={csrfToken}
                />
              ))}
            </div>
          ) : (
            <div className="ap-empty-hint">
              <i className="fas fa-info-circle"></i> No components yet
            </div>
          )}
          <button
            className="ap-add-child-btn"
            onClick={() => onAddComponent(product)}
          >
            <i className="fas fa-plus"></i> Add Component
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;

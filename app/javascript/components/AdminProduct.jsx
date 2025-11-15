import React, { useState } from 'react';
import AdminComponent from './AdminComponent';

const AdminProduct = ({ product, onUpdate, onEditProduct, onEditComponent, onEditVariant, csrfToken }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/v1/products/${product.id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': csrfToken
          }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        onUpdate();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="admin-product-card">
      <div className="admin-product-header">
        <div className="d-flex align-items-center flex-grow-1">
          <button
            className="admin-expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
          </button>
          <div className="admin-product-info">
            <h3 className="admin-product-name">{product.name}</h3>
            <div className="admin-product-meta">
              <span className="admin-meta-item">
                <i className="fas fa-image me-1"></i>
                {product.main_photos_count || 0} photos
              </span>
              <span className={`admin-meta-badge ${product.active ? 'active' : 'inactive'}`}>
                {product.active ? 'Active' : 'Inactive'}
              </span>
              {product.price && (
                <span className="admin-meta-item">
                  <i className="fas fa-tag me-1"></i>
                  {product.price}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="admin-product-actions">
          <button onClick={() => onEditProduct(product)} className="admin-action-btn" title="Edit product">
            <i className="fas fa-pen"></i>
          </button>
          <button onClick={handleDelete} className="admin-action-btn admin-action-delete" title="Delete product">
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      {isExpanded && product.components && product.components.length > 0 && (
        <div className="admin-product-components">
          {product.components.map(component => (
            <AdminComponent
              key={component.id}
              component={component}
              onUpdate={onUpdate}
              onEditComponent={onEditComponent}
              onEditVariant={onEditVariant}
              csrfToken={csrfToken}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
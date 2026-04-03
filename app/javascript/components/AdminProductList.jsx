import React from 'react';
import AdminProduct from './AdminProduct';

const AdminProductList = ({ products, onUpdate, onEditProduct, onAddComponent, onEditComponent, onAddVariant, onEditVariant, csrfToken }) => {
  return (
    <div className="admin-product-list">
      {products.length === 0 ? (
        <div className="admin-empty-state">
          <i className="fas fa-box-open"></i>
          <p>No products yet. Create your first one above.</p>
        </div>
      ) : (
        products.map(product => (
          <AdminProduct
            key={product.id}
            product={product}
            onUpdate={onUpdate}
            onEditProduct={onEditProduct}
            onAddComponent={onAddComponent}
            onEditComponent={onEditComponent}
            onAddVariant={onAddVariant}
            onEditVariant={onEditVariant}
            csrfToken={csrfToken}
          />
        ))
      )}
    </div>
  );
};

export default AdminProductList;

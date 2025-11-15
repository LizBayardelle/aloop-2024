import React from 'react';
import AdminProduct from './AdminProduct';

const AdminProductList = ({ products, onUpdate, onEditProduct, onEditComponent, onEditVariant, csrfToken }) => {
  return (
    <div className="admin-product-list">
      {products.map(product => (
        <AdminProduct
          key={product.id}
          product={product}
          onUpdate={onUpdate}
          onEditProduct={onEditProduct}
          onEditComponent={onEditComponent}
          onEditVariant={onEditVariant}
          csrfToken={csrfToken}
        />
      ))}
    </div>
  );
};

export default AdminProductList;
import React from 'react';
import AdminProduct from './AdminProduct';
import AdminComponent from './AdminComponent';
import AdminVariant from './AdminVariant';

const AdminProductList = ({ products, onUpdate, onEditProduct, onEditComponent, onEditVariant, csrfToken }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Photos</th>
          <th>Active</th>
          <th>Price</th>
          <th>Vendor</th>
          <th>Vendor Parts Number</th>
          <th>Bike Models</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <React.Fragment key={product.id}>
            <AdminProduct 
              product={product} 
              onUpdate={onUpdate} 
              onEdit={onEditProduct}
              csrfToken={csrfToken}
            />
            {product.components.map(component => (
              <React.Fragment key={component.id}>
                <AdminComponent 
                  component={component} 
                  onUpdate={onUpdate} 
                  onEdit={onEditComponent}
                  csrfToken={csrfToken}
                />
                {component.variants.map(variant => (
                  <AdminVariant
                    key={variant.id}
                    variant={variant}
                    onUpdate={onUpdate}
                    onEdit={onEditVariant}
                    csrfToken={csrfToken}
                  />
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default AdminProductList;
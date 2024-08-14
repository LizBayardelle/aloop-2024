import React from 'react';
import AdminProduct from './AdminProduct';
import AdminComponent from './AdminComponent';
import AdminVariant from './AdminVariant';

const AdminProductList = ({ products, onUpdate, onEdit, csrfToken }) => {
  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover table-small">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Photos</th>
            <th>Active</th>
            <th>Price</th>
            <th>Vendor</th>
            <th>Parts&nbsp;#</th>
            <th>Bike&nbsp;Model(s)</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <React.Fragment key={product.id}>
              <AdminProduct 
                product={product} 
                onUpdate={onUpdate} 
                onEdit={onEdit} 
                csrfToken={csrfToken} 
              />
              {product.components && product.components.map(component => (
                <React.Fragment key={component.id}>
                  <AdminComponent 
                    component={component} 
                    onUpdate={onUpdate} 
                    onEdit={onEdit} 
                    csrfToken={csrfToken} 
                  />
                  {component.variants && component.variants.map(variant => (
                    <AdminVariant 
                      key={variant.id} 
                      variant={variant} 
                      onUpdate={onUpdate} 
                      onEdit={onEdit} 
                      csrfToken={csrfToken} 
                    />
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductList;
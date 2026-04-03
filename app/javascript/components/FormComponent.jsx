import React, { useState, useEffect } from 'react';

const FormComponent = ({ onSubmit, onCancel, products, initialData, prefillProductId, prefillProductName, csrfToken }) => {
  const [component, setComponent] = useState({
    name: '',
    product_id: '',
    description: '',
    active: true
  });

  useEffect(() => {
    if (initialData) {
      const { id, created_at, updated_at, variants, ...rest } = initialData;
      setComponent({
        ...rest,
        product_id: rest.product_id ? rest.product_id.toString() : ''
      });
    } else if (prefillProductId) {
      setComponent(prev => ({ ...prev, product_id: prefillProductId.toString() }));
    }
  }, [initialData, prefillProductId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setComponent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = initialData ? `/api/v1/components/${initialData.id}` : '/api/v1/components';
    const method = initialData ? 'PUT' : 'POST';

    const { id, created_at, updated_at, variants, ...submittableComponent } = component;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ component: submittableComponent }),
      });
      if (!response.ok) throw new Error(`Failed to ${initialData ? 'update' : 'create'} component`);
      const data = await response.json();
      onSubmit(data);
    } catch (error) {
      console.error(`Error ${initialData ? 'updating' : 'creating'} component:`, error);
    }
  };

  const isProductLocked = !initialData && prefillProductId;
  const title = initialData ? 'Edit Component' : (prefillProductName ? `Add Component to ${prefillProductName}` : 'New Component');

  return (
    <form onSubmit={handleSubmit} className="modal-content">
      <div className="modal-body">
        <h4 className="modal-form-title">{title}</h4>
        <div className="form-inputs spaced">

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" name="name" value={component.name} onChange={handleChange} required />
          </div>

          {isProductLocked ? (
            <input type="hidden" name="product_id" value={component.product_id} />
          ) : (
            <div className="form-group">
              <label htmlFor="product_id">Product</label>
              <select className="form-control" id="product_id" name="product_id" value={component.product_id} onChange={handleChange} required>
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id.toString()}>{product.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" name="description" value={component.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="active" name="active" checked={component.active} onChange={handleChange} />
              <label className="form-check-label" htmlFor="active">Display on Website</label>
            </div>
          </div>

        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn">{initialData ? 'Update' : 'Create'} Component</button>
      </div>
    </form>
  );
};

export default FormComponent;

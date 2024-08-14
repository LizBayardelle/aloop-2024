import React, { useState, useEffect } from 'react';

const FormVariant = ({ onSubmit, onCancel, bikeModels, components, initialData, csrfToken }) => {
  const [variant, setVariant] = useState({
    name: '',
    component_id: '',
    price: '',
    sku: '',
    vendor: '',
    vendor_parts_number: '',
    description: '',
    active: false,
    bike_model_ids: [],
    photos: []
  });

  useEffect(() => {
    if (initialData) {
      setVariant(prevVariant => ({
        ...prevVariant,
        ...initialData,
        active: initialData.active ?? false,
        bike_model_ids: initialData.bike_model_ids || []
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setVariant(prev => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setVariant(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleBikeModelChange = (e) => {
    const { value, checked } = e.target;
    setVariant(prev => ({
      ...prev,
      bike_model_ids: checked
        ? [...(prev.bike_model_ids || []), value]
        : (prev.bike_model_ids || []).filter(id => id !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = initialData ? `/api/v1/variants/${initialData.id}` : '/api/v1/variants';
    const method = initialData ? 'PUT' : 'POST';
  
    const formData = new FormData();
    Object.keys(variant).forEach(key => {
      // Exclude id, created_at, and updated_at
      if (!['id', 'created_at', 'updated_at'].includes(key)) {
        if (key === 'photos') {
          variant[key].forEach(photo => formData.append('variant[photos][]', photo));
        } else if (key === 'bike_model_ids') {
          (variant[key] || []).forEach(id => formData.append('variant[bike_model_ids][]', id));
        } else {
          formData.append(`variant[${key}]`, variant[key]);
        }
      }
    });
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          'X-CSRF-Token': csrfToken
        },
        body: formData,
      });
      if (!response.ok) throw new Error(`Failed to ${initialData ? 'update' : 'create'} variant`);
      const data = await response.json();
      onSubmit(data);
    } catch (error) {
      console.error(`Error ${initialData ? 'updating' : 'creating'} variant:`, error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-content">
      <div className="modal-body">
        <div className="row form-inputs spaced">
          <div className="form-group col-8">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" name="name" value={variant.name} onChange={handleChange} required />
          </div>
          <div className="form-group col-4">
            <label htmlFor="component_id">Component</label>
            <select className="form-control" id="component_id" name="component_id" value={variant.component_id} onChange={handleChange} required>
              <option value="">Select a component</option>
              {components.map(component => (
                <option key={component.id} value={component.id}>{component.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="price">Price</label>
            <input type="number" step="0.01" className="form-control" id="price" name="price" value={variant.price} onChange={handleChange} required />
          </div>
          <div className="form-group col-4">
            <label htmlFor="sku">Aloop Product Number</label>
            <input type="text" className="form-control" id="sku" name="sku" value={variant.sku} onChange={handleChange} />
          </div>
          <div className="form-group col-4">
            <label htmlFor="vendor">Vendor</label>
            <input type="text" className="form-control" id="vendor" name="vendor" value={variant.vendor} onChange={handleChange} />
          </div>
          <div className="form-group col-4">
            <label htmlFor="vendor_parts_number">Vendor Parts Number</label>
            <input type="text" className="form-control" id="vendor_parts_number" name="vendor_parts_number" value={variant.vendor_parts_number} onChange={handleChange} />
          </div>
          <div className="form-group col-12">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" name="description" value={variant.description} onChange={handleChange}></textarea>
          </div>
          <div className="form-group col-6">
            <label>Bike Models</label>
            {bikeModels.map(model => (
              <div key={model.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`bike_model_${model.id}`}
                  name="bike_model_ids"
                  value={model.id}
                  checked={(variant.bike_model_ids || []).includes(model.id.toString())}
                  onChange={handleBikeModelChange}
                />
                <label className="form-check-label" htmlFor={`bike_model_${model.id}`}>{model.name}</label>
              </div>
            ))}
          </div>
          <div className="form-group col-12">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="active" name="active" checked={variant.active} onChange={handleChange} />
              <label className="form-check-label" htmlFor="active">Display on Website</label>
            </div>
          </div>
          <div className="form-group col-12">
            <label htmlFor="photos">Variant Images</label>
            <input type="file" className="form-control" id="photos" name="photos" onChange={handleChange} multiple />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn me-2" onClick={onCancel}>Close</button>
        <button type="submit" className="btn">{initialData ? 'Update' : 'Create'} Variant</button>
      </div>
    </form>
  );
};

export default FormVariant;
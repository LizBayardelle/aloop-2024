import React, { useState, useEffect } from 'react';

const FormVariant = ({ onSubmit, onCancel, bikeModels, components, initialData, csrfToken }) => {
  console.log("FormVariant rendered with initialData:", initialData);

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
    photos_urls: [],
    new_photos: []
  });

  useEffect(() => {
    if (initialData) {
      setVariant(prevVariant => {
        const updatedVariant = {
          ...prevVariant,
          ...initialData,
          component_id: initialData.component_id ? initialData.component_id.toString() : '',
          active: initialData.active ?? false,
          bike_model_ids: initialData.bike_model_ids || [],
          photos_urls: initialData.photos_urls || [],
          new_photos: []
        };
        return updatedVariant;
      });
    } else {
      console.log("No initial data provided");
    }
  }, [initialData]);

  useEffect(() => {
  }, [variant]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      console.log("File input changed:", files);
      setVariant(prev => {
        const updatedVariant = { ...prev, new_photos: [...prev.new_photos, ...Array.from(files)] };
        console.log("Updated variant with new photos:", updatedVariant);
        return updatedVariant;
      });
    } else {
      setVariant(prev => {
        const updatedVariant = {
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        };
        console.log(`Input changed - ${name}:`, updatedVariant[name]);
        return updatedVariant;
      });
    }
  };

  const removeExistingPhoto = async (photoId, index) => {
    try {
      const response = await fetch(`/api/v1/variants/${initialData.id}/remove_photo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ photo_id: photoId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      setVariant(prev => ({
        ...prev,
        photos_urls: prev.photos_urls.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const removeNewPhoto = (index) => {
    setVariant(prev => ({
      ...prev,
      new_photos: prev.new_photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(variant).forEach(key => {
      if (key !== 'new_photos' && key !== 'photos_urls') {
        formData.append(`variant[${key}]`, variant[key]);
      }
    });
    variant.new_photos.forEach(photo => formData.append('variant[photos][]', photo));

    try {
      const url = initialData ? `/api/v1/variants/${initialData.id}` : '/api/v1/variants';
      const method = initialData ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: { 'X-CSRF-Token': csrfToken },
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
                <option key={component.id} value={component.id.toString()}>{component.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group col-12">
            <label htmlFor="photos">Variant Image</label>
            <input type="file" className="form-control" id="photos" name="photos" onChange={handleChange} multiple accept="image/*" />
            <div className="mt-2 d-flex flex-wrap">
              {console.log("Rendering photos_urls:", variant.photos_urls)}
              {variant.photos_urls && variant.photos_urls.length > 0 ? (
                variant.photos_urls.map((photo, index) => (
                  <div key={`existing-${photo.id}`} className="position-relative me-2 mb-2">
                    <img 
                      src={photo.url} 
                      alt={`Variant ${index + 1}`} 
                      style={{width: '100px', height: '100px', objectFit: 'cover'}} 
                    />
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger position-absolute top-0 end-0" 
                      onClick={() => removeExistingPhoto(photo.id, index)}
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p></p>
              )}
              {console.log("Rendering new_photos:", variant.new_photos)}
              {variant.new_photos && variant.new_photos.length > 0 ? (
                variant.new_photos.map((file, index) => (
                  <div key={`new-${index}`} className="position-relative me-2 mb-2">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`New Upload ${index + 1}`} 
                      style={{width: '100px', height: '100px', objectFit: 'cover'}} 
                    />
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger position-absolute top-0 end-0" 
                      onClick={() => removeNewPhoto(index)}
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>
          </div>

          <div className="form-group col-6">
            <label htmlFor="price">Additional Price</label>
            <input type="number" step="0.01" className="form-control" id="price" name="price" value={variant.price} onChange={handleChange} required />
            <small className="form-text text-muted">This amount will be added to the product's base price.</small>
          </div>

          <div className="form-group col-6">
            <label htmlFor="sku">Aloop Product Number</label>
            <input type="text" className="form-control" id="sku" name="sku" value={variant.sku} onChange={handleChange} />
          </div>
          
          <div className="form-group col-6">
            <label htmlFor="vendor">Vendor</label>
            <input type="text" className="form-control" id="vendor" name="vendor" value={variant.vendor} onChange={handleChange} />
          </div>

          <div className="form-group col-6">
            <label htmlFor="vendor_parts_number">Vendor Parts Number</label>
            <input type="text" className="form-control" id="vendor_parts_number" name="vendor_parts_number" value={variant.vendor_parts_number} onChange={handleChange} />
          </div>

          <div className="form-group col-12">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" name="description" value={variant.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group col-12">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="active" name="active" checked={variant.active} onChange={handleChange} />
              <label className="form-check-label" htmlFor="active">Display on Website</label>
            </div>
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
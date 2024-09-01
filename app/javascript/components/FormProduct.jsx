import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const FormProduct = ({ onSubmit, onCancel, categories, initialData, csrfToken }) => {
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    active: true,
    meta_title: '',
    meta_keywords: '',
    height: '',
    width: '',
    depth: '',
    subtitle: '',
    price: '',
    size: '',
    application_notes: '',
    product_category_ids: [],
    main_photos_urls: [],
    new_photo_files: []
  });




  useEffect(() => {
    if (initialData) {
      setProduct(prevProduct => ({
        ...prevProduct,
        ...Object.fromEntries(
          Object.entries(initialData).map(([key, value]) => {
            if (key === 'price') {
              return [key, parseFloat(value.replace(/[^0-9.-]+/g,""))];
            }
            return [key, value ?? ''];
          })
        ),
        product_category_ids: initialData.product_category_ids?.map(String) || [],
        main_photos_urls: initialData.main_photos_urls || [],
        new_photo_files: []
      }));
    }
  }, [initialData]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditorChange = (content, editor) => {
    setProduct(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      product_category_ids: checked
        ? [...new Set([...prev.product_category_ids, value])]
        : prev.product_category_ids.filter(id => id !== value)
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct(prev => ({
      ...prev,
      new_photo_files: [...prev.new_photo_files, ...files]
    }));
  };

  const removeExistingPhoto = async (photoId, index) => {
    try {
      const response = await fetch(`/api/v1/products/${initialData.id}/remove_photo`, {
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

      setProduct(prev => ({
        ...prev,
        main_photos_urls: prev.main_photos_urls.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error deleting photo:', error);
      // Optionally, show an error message to the user
    }
  };

  const removeNewPhoto = (index) => {
    setProduct(prev => ({
      ...prev,
      new_photo_files: prev.new_photo_files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = initialData ? `/api/v1/products/${initialData.id}` : '/api/v1/products';
      const method = initialData ? 'PUT' : 'POST';
  
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'main_photos_urls') {
          // We don't need to send this to the server
        } else if (key === 'new_photo_files') {
          value.forEach(file => formData.append('product[main_photos][]', file));
        } else if (key === 'product_category_ids') {
          value.forEach(id => formData.append(`product[${key}][]`, id));
        } else {
          formData.append(`product[${key}]`, value);
        }
      });
  
      const response = await fetch(url, {
        method: method,
        headers: { 
          'X-CSRF-Token': csrfToken
        },
        body: formData,
      });
      if (!response.ok) throw new Error(`Failed to ${initialData ? 'update' : 'create'} product`);
      const updatedProduct = await response.json();
      onSubmit(updatedProduct);
    } catch (error) {
      console.error(`Error ${initialData ? 'updating' : 'creating'} product:`, error);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="modal-content">
      <div className="row modal-body">


        <div className="form-group col-sm-8 pb-4">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={handleChange} required />
        </div>

        <div className="form-group col-sm-4 pb-4">
          <label htmlFor="price">Price</label>
          <input 
            type="number" 
            step="0.01" 
            className="form-control" 
            id="price" 
            name="price" 
            value={product.price} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group pb-4">
          <label htmlFor="subtitle">Subtitle</label>
          <input type="text" className="form-control" id="subtitle" name="subtitle" value={product.subtitle} onChange={handleChange} />
        </div>

        <div className="form-group pb-4">
          <label htmlFor="main_photos">Main Photos</label>
          <input 
            type="file" 
            className="form-control" 
            id="main_photos" 
            name="main_photos" 
            onChange={handleFileChange} 
            multiple 
            accept="image/*"
          />
          <div className="mt-2 d-flex flex-wrap">
            {product.main_photos_urls.map((photo, index) => (
              <div key={`existing-${photo.id}`} className="position-relative me-2 mb-2">
                <img 
                  src={photo.url} 
                  alt={`Product ${index + 1}`} 
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
            ))}
            {product.new_photo_files.map((file, index) => (
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
            ))}
          </div>
        </div>
        
        <div className="form-group pb-4">
          <label htmlFor="description">Description</label>
          <Editor
            apiKey={window.TINY_MCE_API_KEY}
            initialValue={product.description}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help'
            }}
            onEditorChange={handleEditorChange}
          />
        </div>
        
        <div className="form-group pb-4">
          <label htmlFor="application_notes">Application Notes</label>
          <textarea className="form-control" id="application_notes" name="application_notes" value={product.application_notes} onChange={handleChange}></textarea>
        </div>
        
        
        <div className="form-group col-sm-4 pb-4">
          <label htmlFor="height">Height</label>
          <input type="number" className="form-control" id="height" name="height" value={product.height} onChange={handleChange} />
        </div>
        
        <div className="form-group col-sm-4 pb-4">
          <label htmlFor="width">Width</label>
          <input type="number" className="form-control" id="width" name="width" value={product.width} onChange={handleChange} />
        </div>
        
        <div className="form-group col-sm-4 pb-4">
          <label htmlFor="depth">Depth</label>
          <input type="number" className="form-control" id="depth" name="depth" value={product.depth} onChange={handleChange} />
        </div>
        
        <div className="form-group pb-4">
          <label htmlFor="size">Size</label>
          <input type="text" className="form-control" id="size" name="size" value={product.size} onChange={handleChange} />
        </div>
        
        <div className="form-group pb-4">
          <label htmlFor="meta_title">Meta Title</label>
          <input type="text" className="form-control" id="meta_title" name="meta_title" value={product.meta_title} onChange={handleChange} />
        </div>
        
        <div className="form-group pb-4">
          <label htmlFor="meta_keywords">Meta Keywords</label>
          <input type="text" className="form-control" id="meta_keywords" name="meta_keywords" value={product.meta_keywords} onChange={handleChange} />
        </div>
        
        <div className="form-group pb-4">
          <label>Categories</label>
          {categories.map(category => (
            <div key={category.id} className="form-check">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                name="product_category_ids"
                value={category.id.toString()}
                checked={product.product_category_ids.includes(category.id.toString())}
                onChange={handleCategoryChange}
                className="form-check-input"
              />
              <label htmlFor={`category-${category.id}`} className="form-check-label">{category.name}</label>
            </div>
          ))}
        </div>
      

        <div className="form-group pb-4">
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="active" name="active" checked={product.active} onChange={handleChange} />
            <label className="form-check-label" htmlFor="active">Active</label>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn me-2" onClick={onCancel}>Close</button>
        <button type="submit" className="btn">{initialData ? 'Update' : 'Create'} Product</button>
      </div>
    </form>
  );
};

export default FormProduct;
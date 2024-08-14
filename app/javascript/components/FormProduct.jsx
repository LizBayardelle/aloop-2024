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
    product_category_ids: []
  });

  useEffect(() => {
    if (initialData) {
      setProduct(prevProduct => ({
        ...prevProduct,
        ...Object.fromEntries(
          Object.entries(initialData).map(([key, value]) => [key, value ?? ''])
        ),
        product_category_ids: initialData.product_category_ids?.map(String) || []
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = initialData ? `/api/v1/products/${initialData.id}` : '/api/v1/products';
      const method = initialData ? 'PUT' : 'POST';
  
      const productData = {
        name: product.name,
        description: product.description,
        active: product.active,
        meta_title: product.meta_title,
        meta_keywords: product.meta_keywords,
        height: product.height,
        width: product.width,
        depth: product.depth,
        subtitle: product.subtitle,
        price: product.price,
        size: product.size,
        application_notes: product.application_notes,
        product_category_ids: product.product_category_ids
      };
  
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ product: productData }),
      });
      if (!response.ok) throw new Error(`Failed to ${initialData ? 'update' : 'create'} product`);
      const data = await response.json();
      onSubmit(data);
    } catch (error) {
      console.error(`Error ${initialData ? 'updating' : 'creating'} product:`, error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-content">
      <div className="row modal-body">
        
        <div className="form-group pb-4">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={handleChange} required />
        </div>
        
        <div className="form-group pb-4">
          <label htmlFor="subtitle">Subtitle</label>
          <input type="text" className="form-control" id="subtitle" name="subtitle" value={product.subtitle} onChange={handleChange} />
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
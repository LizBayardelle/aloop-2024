import React, { useState, useEffect } from 'react';
import AdminProductList from './AdminProductList';
import FormProduct from './FormProduct';
import FormComponent from './FormComponent';
import FormVariant from './FormVariant';
import Modal from './Modal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bikeModels, setBikeModels] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBikeModels();
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    setCsrfToken(token);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/v1/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/product_categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBikeModels = async () => {
    try {
      const response = await fetch('/api/v1/bike_models');
      if (!response.ok) throw new Error('Failed to fetch bike models');
      const data = await response.json();
      setBikeModels(data);
    } catch (error) {
      console.error('Error fetching bike models:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingItem(product);
    setShowProductForm(true);
  };

  const handleEditComponent = (component) => {
    setEditingItem(component);
    setShowComponentForm(true);
  };

  const handleEditVariant = (variant) => {
    const variantWithComponent = {
      ...variant,
      component_id: variant.component_id || variant.component?.id
    };
    setEditingItem(variantWithComponent);
    setShowVariantForm(true);
  };

  const handleFormSubmit = () => {
    fetchProducts();
    closeAllForms();
  };

  const closeAllForms = () => {
    setShowProductForm(false);
    setShowComponentForm(false);
    setShowVariantForm(false);
    setEditingItem(null);
  };

  return (
    <div className="container py-5">
      <header className="text-center mb-3">
        <button className="btn btn-primary me-2" onClick={() => setShowProductForm(true)}>
          Add a New Product
        </button>
        <button className="btn btn-secondary me-2" onClick={() => setShowComponentForm(true)}>
          Add a New Component
        </button>
        <button className="btn btn-info" onClick={() => setShowVariantForm(true)}>
          Add a New Variant
        </button>
      </header>

      <AdminProductList 
        products={products} 
        onUpdate={fetchProducts} 
        onEditProduct={handleEditProduct}
        onEditComponent={handleEditComponent}
        onEditVariant={handleEditVariant}
        csrfToken={csrfToken}
      />

      <Modal isOpen={showProductForm} onClose={closeAllForms}>
        <FormProduct 
          onSubmit={handleFormSubmit} 
          onCancel={closeAllForms} 
          categories={categories}
          initialData={editingItem}
          csrfToken={csrfToken}
        />
      </Modal>

      <Modal isOpen={showComponentForm} onClose={closeAllForms}>
        <FormComponent 
          onSubmit={handleFormSubmit} 
          onCancel={closeAllForms} 
          products={products}
          initialData={editingItem}
          csrfToken={csrfToken}
        />
      </Modal>

      <Modal isOpen={showVariantForm} onClose={closeAllForms}>
        <FormVariant 
          onSubmit={handleFormSubmit} 
          onCancel={closeAllForms} 
          bikeModels={bikeModels}
          components={products.flatMap(p => p.components || [])}
          initialData={editingItem}
          csrfToken={csrfToken}
        />
      </Modal>
    </div>
  );
};

export default AdminProducts;
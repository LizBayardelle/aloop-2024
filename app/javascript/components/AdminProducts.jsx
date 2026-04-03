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

  const handleAddComponentToProduct = (product) => {
    setEditingItem({ _prefillProductId: product.id, _prefillProductName: product.name });
    setShowComponentForm(true);
  };

  const handleEditComponent = (component) => {
    setEditingItem(component);
    setShowComponentForm(true);
  };

  const handleAddVariantToComponent = (component) => {
    setEditingItem({ _prefillComponentId: component.id, _prefillComponentName: component.name });
    setShowVariantForm(true);
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

  const activeCount = products.filter(p => p.active).length;

  return (
    <div>
      <div className="admin-products-header">
        <div className="admin-products-stats">
          <span className="admin-stat">{products.length} product{products.length !== 1 ? 's' : ''}</span>
          <span className="admin-stat-sep">/</span>
          <span className="admin-stat-subtle">{activeCount} active</span>
        </div>
        <button className="admin-btn-primary" onClick={() => { setEditingItem(null); setShowProductForm(true); }}>
          <i className="fas fa-plus me-2"></i>New Product
        </button>
      </div>

      <AdminProductList
        products={products}
        onUpdate={fetchProducts}
        onEditProduct={handleEditProduct}
        onAddComponent={handleAddComponentToProduct}
        onEditComponent={handleEditComponent}
        onAddVariant={handleAddVariantToComponent}
        onEditVariant={handleEditVariant}
        csrfToken={csrfToken}
      />

      <Modal isOpen={showProductForm} onClose={closeAllForms}>
        <FormProduct
          onSubmit={handleFormSubmit}
          onCancel={closeAllForms}
          categories={categories}
          initialData={editingItem?._prefillProductId ? null : editingItem}
          csrfToken={csrfToken}
        />
      </Modal>

      <Modal isOpen={showComponentForm} onClose={closeAllForms}>
        <FormComponent
          onSubmit={handleFormSubmit}
          onCancel={closeAllForms}
          products={products}
          initialData={editingItem?._prefillProductId ? null : editingItem}
          prefillProductId={editingItem?._prefillProductId}
          prefillProductName={editingItem?._prefillProductName}
          csrfToken={csrfToken}
        />
      </Modal>

      <Modal isOpen={showVariantForm} onClose={closeAllForms}>
        <FormVariant
          onSubmit={handleFormSubmit}
          onCancel={closeAllForms}
          bikeModels={bikeModels}
          components={products.flatMap(p => p.components || [])}
          initialData={editingItem?._prefillComponentId ? null : editingItem}
          prefillComponentId={editingItem?._prefillComponentId}
          prefillComponentName={editingItem?._prefillComponentName}
          csrfToken={csrfToken}
        />
      </Modal>
    </div>
  );
};

export default AdminProducts;

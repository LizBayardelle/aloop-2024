import React from 'react';

const AdminProduct = ({ product, onUpdate, onEdit, csrfToken }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/v1/products/${product.id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': csrfToken
          }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        onUpdate();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const cells = [
    <td key="name" className="bg-grey-darker text-nowrap"><strong>{product.name}</strong></td>,
    <td key="sku" className="bg-grey-darker"></td>,
    <td key="photos" className="bg-grey-darker">--</td>,
    <td key="active" className="bg-grey-darker">{product.active ? 'Yes' : 'No'}</td>,
    <td key="price" className="bg-grey-darker">${product.price}</td>,
    <td key="vendor" className="bg-grey-darker"></td>,
    <td key="vendor-parts" className="bg-grey-darker"></td>,
    <td key="bike-models" className="bg-grey-darker"></td>,
    <td key="actions" className="bg-grey-darker text-end">
      <button onClick={() => onEdit(product)} className="me-2 bg-transparent p-0">
        <i className="fas fa-pen color-black bg-transparent p-0"></i>
      </button>
      <button onClick={handleDelete} className="bg-transparent p-0">
        <i className="fas fa-trash-alt color-black bg-transparent p-0"></i>
      </button>
    </td>
  ];

  return <tr>{cells}</tr>;
};

export default AdminProduct;
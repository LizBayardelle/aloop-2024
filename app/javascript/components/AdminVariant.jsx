import React from 'react';

const AdminVariant = ({ variant, onUpdate, onEdit, csrfToken }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        const response = await fetch(`/api/v1/variants/${variant.id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': csrfToken
          }
        });
        if (!response.ok) throw new Error('Failed to delete variant');
        onUpdate();
      } catch (error) {
        console.error('Error deleting variant:', error);
      }
    }
  };

  return (
    <tr>
      <td>
        <i className="fa-solid fa-angles-right color-red" style={{ marginRight: "10px", marginLeft: "30px" }}></i>
        {variant.name}
      </td>
      <td>{variant.sku}</td>
      <td>*pics*</td>
      <td>{variant.active ? 'Yes' : 'No'}</td>
      <td>${variant.price}</td>
      <td>{variant.vendor}</td>
      <td>{variant.vendor_parts_number}</td>
      <td>{variant.bike_models?.map(model => model.name).join(', ')}</td>
      <td className="text-end">
        <button onClick={() => onEdit(variant)} className="me-2 bg-white">
          <i className="fas fa-pen color-red bg-white p-0"></i>
        </button>
        <button onClick={handleDelete}>
          <i className="fas fa-trash-alt color-red bg-white p-0"></i>
        </button>
      </td>
    </tr>
  );
};

export default AdminVariant;
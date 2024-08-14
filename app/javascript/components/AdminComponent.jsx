import React from 'react';

const AdminComponent = ({ component, onUpdate, onEdit, csrfToken }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        const response = await fetch(`/api/v1/components/${component.id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': csrfToken
          }
        });
        if (!response.ok) throw new Error('Failed to delete component');
        onUpdate();
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    }
  };

  const cells = [
    <td key="name" className="bg-grey">
      <i className="fa-solid fa-angles-right color-blue" style={{ marginRight: "10px", marginLeft: "10px" }}></i>
      {component.name}
    </td>,
    <td key="sku" className="bg-grey"></td>,
    <td key="photos" className="bg-grey"></td>,
    <td key="active" className="bg-grey"></td>,
    <td key="price" className="bg-grey"></td>,
    <td key="vendor" className="bg-grey"></td>,
    <td key="vendor-parts" className="bg-grey"></td>,
    <td key="bike-models" className="bg-grey"></td>,
    <td key="actions" className="text-end bg-grey">
      <button onClick={() => onEdit(component)} className="me-2 bg-transparent">
        <i className="fas fa-pen color-blue bg-transparent p-0"></i>
      </button>
      <button onClick={handleDelete} className="bg-transparent">
        <i className="fas fa-trash-alt color-blue bg-transparent p-0"></i>
      </button>
    </td>
  ];

  return <tr>{cells}</tr>;
};

export default AdminComponent;
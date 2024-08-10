import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProductDetails = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    initializeVariantsAndPrice();
  }, [product]);

  const initializeVariantsAndPrice = () => {
    const initialVariants = {};
    let initialPrice = 0;
    product.components.forEach(component => {
      if (component.variants.length > 0) {
        // Select the cheapest variant by default
        const cheapestVariant = component.variants.reduce((min, variant) => 
          (parseFloat(variant.price) || 0) < (parseFloat(min.price) || 0) ? variant : min
        );
        initialVariants[component.id] = cheapestVariant.id;
        initialPrice += parseFloat(cheapestVariant.price) || 0;
      }
    });
    setSelectedVariants(initialVariants);
    setTotalPrice(initialPrice);
  };

  const handleVariantChange = (componentId, variantId) => {
    setSelectedVariants(prev => ({ ...prev, [componentId]: variantId }));
    calculateTotalPrice({ ...selectedVariants, [componentId]: variantId });
  };

  const calculateTotalPrice = (variants = selectedVariants) => {
    let price = 0;
    Object.entries(variants).forEach(([componentId, variantId]) => {
      const component = product.components.find(c => c.id === parseInt(componentId));
      const variant = component.variants.find(v => v.id === variantId);
      price += parseFloat(variant.price) || 0;
    });
    setTotalPrice(price);
  };

  const handleAddToCart = () => {
    const orderItem = {
      product_id: product.id,
      quantity: 1,
      specs: Object.entries(selectedVariants).map(([componentId, variantId]) => {
        const component = product.components.find(c => c.id === parseInt(componentId));
        const variant = component.variants.find(v => v.id === variantId);
        return `${component.name}: ${variant.name}`;
      }).join('\n'),
      notes: notes,
      total_price: totalPrice
    };
    // Here you would typically dispatch an action or call a function to add the item to the cart
    console.log('Adding to cart:', orderItem);
    setShowModal(false);
  };

  // Helper function to format price
  const formatPrice = (price) => {
    const number = parseFloat(price);
    return isNaN(number) ? 'N/A' : `$${number.toFixed(2)}`;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-sm-6">
          {/* Image gallery component goes here */}
          <p className="h2 mt-4">{formatPrice(totalPrice)}</p>
        </div>
        <div className="col-sm-6">
          <h1 className="pb-2">{product.name}</h1>
          <p className="h4" dangerouslySetInnerHTML={{ __html: product.description }} />
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Customize and Add to Cart
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Customize Your {product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="text-center">Total Price: {formatPrice(totalPrice)}</h3>
          {product.components.map(component => (
            <div key={component.id}>
              <h4 className="mt-3">Choose a <span className="font-weight-bold">{component.name}</span></h4>
              <div className="row">
                {component.variants.map(variant => (
                  <div key={variant.id} className="col-6 mb-3">
                    <div 
                      className={`selectbox ${selectedVariants[component.id] === variant.id ? 'active' : ''}`}
                      onClick={() => handleVariantChange(component.id, variant.id)}
                    >
                      <div className="row">
                        <div className="col-4">
                          {variant.photos && variant.photos.length > 0 && (
                            <img src={variant.photos[0]} alt={variant.name} style={{ height: '70px', width: 'auto' }} />
                          )}
                        </div>
                        <div className="col-8 text-left">
                          <strong>{variant.name}</strong>
                          <p>{formatPrice(variant.price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Form.Group className="mb-3">
            <Form.Label>Tell Us About Your Project!</Form.Label>
            <Form.Control 
              as="textarea" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDetails;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const PLACEHOLDER_IMAGE_URL = '/assets/placeholder.jpg';

const CheckoutCart = ({ order, onUpdateOrder, onNext }) => {
  const [itemImages, setItemImages] = useState({});

  useEffect(() => {
    fetchImages();
  }, [order]);

  const fetchImages = async () => {
    if (order && order.order_items) {
      const variantIds = order.order_items.flatMap(item => item.selected_variant_ids);
      
      try {
        const response = await axios.get('/api/v1/variants/images', {
          params: { variant_ids: variantIds.join(',') }
        });
        
        const newItemImages = {};
        order.order_items.forEach(item => {
          const variantImage = item.selected_variant_ids
            .map(id => response.data[id])
            .find(url => url);
          newItemImages[item.id] = variantImage || PLACEHOLDER_IMAGE_URL;
        });
        
        setItemImages(newItemImages);
      } catch (error) {
        console.error('Error fetching variant images:', error);
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`/api/v1/order_items/${itemId}`);
      const updatedOrder = {
        ...order,
        order_items: order.order_items.filter(item => item.id !== itemId)
      };
      onUpdateOrder(updatedOrder);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const calculateTotalItems = () => {
    return order.order_items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  const calculateTotalPrice = () => {
    return order.order_items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Your Cart</h1>
      {!order || !order.order_items || order.order_items.length === 0 ? (
        <div className="text-center">
          <p className="lead">Your cart is empty.</p>
          <a href="/products" className="btn btn-primary">Continue Shopping</a>
        </div>
      ) : (
        <>
          <div className="card shadow-sm">
            <div className="card-body">
              {order.order_items.map(item => (
                <div key={item.id} className="row mb-4 align-items-center">
                  <div className="col-md-6">
                    <h5 className="mb-1">{item.product.name}</h5>
                    {item.specs && (
                      <p
                        className="mb-0 text-muted small"
                        dangerouslySetInnerHTML={{ __html: item.specs.replace(/\n/g, '<br />') }}
                      />
                    )}
                    {item.notes && <p className="mb-0"><small className="text-muted"><em>{item.notes}</em></small></p>}
                  </div>
                  <div className="col-md-2 text-center">
                    <span className="badge bg-secondary">{item.quantity || 1}</span>
                  </div>
                  <div className="col-md-2 text-center">
                    <strong>${formatPrice(item.total_price)}</strong>
                  </div>
                  <div className="col-md-2 text-end">
                    <button onClick={() => handleRemoveItem(item.id)} className="btn btn-outline-danger btn-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Total Items: {calculateTotalItems()}</h5>
                </div>
                <div className="col-md-6 text-end">
                  <h4 className="mb-0">Total: ${formatPrice(calculateTotalPrice())}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="text-end mt-4">
            <button onClick={onNext} className="btn btn-primary btn-lg">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutCart;
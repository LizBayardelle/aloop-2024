import React from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const CheckoutCart = ({ order, onUpdateOrder, onNext }) => {
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

  const parsePrice = (price) => {
    if (typeof price === 'string' && price.includes('e')) {
      return parseFloat(price);
    }
    return parseFloat(price) || 0;
  };

  const formatPrice = (price) => {
    const numPrice = parsePrice(price);
    return numPrice.toFixed(2);
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + parsePrice(item.total_price), 0);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Your Cart</h1>
      {order.order_items.length === 0 ? (
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
                    <p className="mb-0 text-muted" dangerouslySetInnerHTML={{ __html: item.specs }} />
                    <p className="mb-0"><small className="text-muted"><em>{item.notes}</em></small></p>
                  </div>
                  <div className="col-md-2 text-center">
                    <span className="badge bg-secondary">{item.quantity}</span>
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
                  <h5 className="mb-0">Total Items: {order.order_items.reduce((sum, item) => sum + (item.quantity || 0), 0)}</h5>
                </div>
                <div className="col-md-6 text-end">
                  <h4 className="mb-0">Total: ${formatPrice(calculateTotal(order.order_items))}</h4>
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
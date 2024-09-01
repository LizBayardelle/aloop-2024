import React from 'react';

const CheckoutConfirmation = ({ order }) => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Thank you for your order!</h1>
      <p className="text-center text-muted mb-5">Order #{order.id.toString().padStart(6, '0')}</p>

      <div className="row">
        {/* Order Info */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h4 className="card-title mb-4">Order Summary</h4>
              {order.order_items.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>{item.product.name}</span>
                  <span className="font-weight-bold">${parseFloat(item.total_price).toFixed(2)}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between border-top pt-2 mt-2">
                <span>Shipping</span>
                <span className="font-weight-bold">${parseFloat(order.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between border-top pt-3 mt-3">
                <span className="h5">Total</span>
                <span className="h5 font-weight-bold">${parseFloat(order.final_price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h4 className="card-title mb-4">Shipping Information</h4>
              <address>
                <p className="font-weight-bold mb-1">{order.ship_to_name}</p>
                <p className="mb-1">{order.address_line_1}</p>
                {order.address_line_2 && <p className="mb-1">{order.address_line_2}</p>}
                <p className="mb-1">{order.city}, {order.state} {order.postal_code}</p>
                <p className="mb-0">{order.country}</p>
              </address>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body text-center">
          <p className="mb-2">We've sent a confirmation email to <strong>{order.customer_email}</strong>.</p>
          <p className="mb-0">Thank you for shopping with us!</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
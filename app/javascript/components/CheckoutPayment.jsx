import React, { useEffect, useState, useCallback } from 'react';

const CheckoutPayment = ({ order, onUpdateOrder, onNext, onBack }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const calculateTotalPrice = useCallback(() => {
    const itemsTotal = order.order_items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
    const shippingCost = parseFloat(order.shipping_cost || 0);
    return Math.max(itemsTotal + shippingCost, 0.01).toFixed(2);
  }, [order]);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [calculateTotalPrice]);

  const initializePayPalButton = useCallback(() => {
    if (window.paypal && !document.querySelector('#paypal-button-container button')) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          if (parseFloat(totalPrice) <= 0) {
            setError("Total price must be greater than zero.");
            return Promise.reject(new Error("Total price must be greater than zero."));
          }
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalPrice
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          return actions.order.capture().then(async function(details) {
            const paypalDetails = {
              paypal_order_id: details.id,
              paypal_payer_id: details.payer.payer_id,
              paypal_payer_email: details.payer.email_address,
              paypal_payment_status: details.status,
              paypal_payment_amount: details.purchase_units[0].amount.value,
              paypal_payment_currency: details.purchase_units[0].amount.currency_code,
              paypal_transaction_id: details.purchase_units[0].payments.captures[0].id,
            };
            const updatedOrder = { 
              ...order, 
              paid: true,
              final_price: paypalDetails.paypal_payment_amount,
              shipping_method_name: order.shipping_method_name,
              ...paypalDetails
            };
            await onUpdateOrder(updatedOrder);
            await sendAdminNotification(updatedOrder);
            onNext();
          });
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          setError("An error occurred with PayPal. Please try again.");
        }
      }).render('#paypal-button-container');
    }
  }, [totalPrice, order, onUpdateOrder, onNext]);

  useEffect(() => {
    if (!paypalLoaded) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=ATJK2vV0aAd9g8iShFQ2LccUACGyFaKJ0fn0nj9skdi506uCQFDrMF5mAil5P7JSBGGaIDUQcbFQkULD&currency=USD`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [paypalLoaded]);

  useEffect(() => {
    if (paypalLoaded && totalPrice > 0) {
      initializePayPalButton();
    }
  }, [paypalLoaded, totalPrice, initializePayPalButton]);

  const sendAdminNotification = async (orderDetails) => {
    try {
      const response = await fetch('/api/v1/notify_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ order: orderDetails })
      });

      if (!response.ok) {
        throw new Error('Failed to send admin notification');
      }
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Complete Your Payment</h1>
      <p className="text-center text-muted mb-5">Order #{order.id.toString().padStart(6, '0')}</p>

      <div className="row">
        {/* Order Summary */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h4 className="card-title mb-4">Order Summary</h4>
              {order.order_items.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>{item.product.name}</span>
                  <span className="font-weight-bold">${parseFloat(item.total_price || 0).toFixed(2)}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between border-top pt-2 mt-2">
                <span>Shipping</span>
                <span className="font-weight-bold">${parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between border-top pt-3 mt-3">
                <span className="h5">Total</span>
                <span className="h5 font-weight-bold">${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
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
              {order.shipping_method_name && (
                <p className="mt-3 mb-0">
                  <strong>Shipping Method:</strong> {order.shipping_method_name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger my-4" role="alert">
          {error}
        </div>
      )}

      <div id="paypal-button-container" className="my-4"></div>

      <div className="d-flex justify-content-between mt-4">
        <button onClick={onBack} className="btn btn-secondary">
          Back
        </button>
      </div>
    </div>
  );
};

export default CheckoutPayment;
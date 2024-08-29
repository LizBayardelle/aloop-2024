import React, { useEffect, useState, useCallback } from 'react';

const CheckoutPayment = ({ order, onUpdateOrder, onNext, onBack }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const calculateTotalPrice = useCallback(() => {
    const itemsTotal = order.order_items.reduce((sum, item) => {
      const itemPrice = parseFloat(item.total_price || 0);
      console.log(`Item: ${item.product.name}, Price: ${itemPrice}`);
      return sum + itemPrice;
    }, 0);
    const shippingCost = parseFloat(order.shipping_cost || 0);
    console.log(`Items Total: ${itemsTotal}, Shipping Cost: ${shippingCost}`);
    const calculatedTotal = itemsTotal + shippingCost;
    console.log(`Calculated Total: ${calculatedTotal}`);
    return Math.max(calculatedTotal, 0.01).toFixed(2);
  }, [order]);

  useEffect(() => {
    const newTotalPrice = calculateTotalPrice();
    setTotalPrice(newTotalPrice);
    console.log('Total price set:', newTotalPrice);
  }, [calculateTotalPrice]);

  const initializePayPalButton = useCallback(() => {
    if (window.paypal && !document.querySelector('#paypal-button-container button')) {
      console.log('Initializing PayPal button with total:', totalPrice);
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          if (parseFloat(totalPrice) <= 0) {
            const errorMsg = "Total price must be greater than zero.";
            console.error(errorMsg);
            setError(errorMsg);
            return Promise.reject(new Error(errorMsg));
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
          console.log('PayPal order approved');
          return actions.order.capture().then(async function(details) {
            console.log('Transaction completed by ' + details.payer.name.given_name);
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
      script.onload = () => {
        console.log('PayPal SDK script loaded');
        setPaypalLoaded(true);
      };
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

  useEffect(() => {
    console.log('Order received:', order);
    console.log('Shipping cost:', order.shipping_cost);
    console.log('Shipping price:', order.shipping_price);
  }, [order]);

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
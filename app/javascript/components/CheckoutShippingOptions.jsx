import React, { useState, useEffect } from 'react';

const CheckoutShippingOptions = ({ order, shippingRates, updateOrder, onNext, onBack }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('updateOrder type:', typeof updateOrder);
  }, [updateOrder]);

  const handleShippingChoice = async (rate) => {
    setIsLoading(true);
    setError(null);

    const updatedOrder = {
      ...order,
      shipping_chosen: true,
      shipping_choice: rate.provider,
      shipping_choice_img: rate.provider_image_75,
      shipping_method_name: `${rate.provider} - ${rate.service_level}`,
      shipping_cost: rate.amount,
      final_price: (parseFloat(order.price) + parseFloat(rate.amount)).toFixed(2)
    };

    console.log('Sending update:', JSON.stringify(updatedOrder, null, 2));

    try {
      if (typeof updateOrder !== 'function') {
        throw new Error('updateOrder is not a function');
      }
      await updateOrder(updatedOrder);
      onNext();
    } catch (err) {
      console.error('Error updating order:', err);
      setError(`Failed to update shipping choice. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!updateOrder) {
    return <div className="alert alert-danger">Error: updateOrder function is not provided</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Shipping Options</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {shippingRates.map((rate) => (
          <div key={rate.id} className="col">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <img 
                    src={rate.provider_image_75 || `https://cdn2.goshippo.com/providers/75/${rate.provider}.png`}
                    alt={rate.provider} 
                    className="me-3"
                    style={{ width: '75px', height: '75px', objectFit: 'contain' }}
                  />
                  <div>
                    <h4 className="card-title">${parseFloat(rate.amount).toFixed(2)}</h4>
                    <p className="card-text">
                      <strong>{rate.provider}, {rate.service_level}</strong>
                      <br />
                      <small className="text-muted">{rate.duration_terms}</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button 
                  onClick={() => handleShippingChoice(rate)} 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Choose This Option'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button 
          onClick={onBack} 
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CheckoutShippingOptions;
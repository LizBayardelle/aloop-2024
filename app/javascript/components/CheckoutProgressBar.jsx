import React from 'react';

const CheckoutProgressBar = ({ currentStep, totalSteps }) => {
  const steps = [
    'Cart',
    'Shipping Info',
    'Shipping Options',
    'Payment',
    'Confirmation'
  ];

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  return (
    <div className="mb-4">
      <div className="progress" style={{ height: '20px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${getProgressPercentage()}%` }}
          aria-valuenow={getProgressPercentage()}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {`${Math.round(getProgressPercentage())}%`}
        </div>
      </div>
      <div className="d-flex justify-content-between mt-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-center fw-light uppercase ${index < currentStep ? 'text-blue fw-bold' : 'text-muted'}`}
            style={{ flex: 1 }}
          >
            <small>{step}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgressBar;
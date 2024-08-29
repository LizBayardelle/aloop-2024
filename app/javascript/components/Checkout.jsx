import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CheckoutCart from './CheckoutCart';
import CheckoutShippingInfo from './CheckoutShippingInfo';
import CheckoutShippingOptions from './CheckoutShippingOptions';
import CheckoutPayment from './CheckoutPayment';
import CheckoutConfirmation from './CheckoutConfirmation';
import CheckoutProgressBar from './CheckoutProgressBar';

const Checkout = ({ initialOrder }) => {
	const [order, setOrder] = useState(initialOrder || {});
	const [step, setStep] = useState(1);
	const [shippingRates, setShippingRates] = useState([]);

	useEffect(() => {
		if (step === 3) {
		fetchShippingRates();
		}
	}, [step]);

	const fetchShippingRates = async () => {
		try {
			const response = await axios.get(`/api/v1/orders/${order.id}/shipping_rates`);
			setShippingRates(response.data);
		} catch (error) {
			console.error('Error fetching shipping rates:', error);
		}
	};

	const updateOrder = async (updatedData) => {
		try {
		  const response = await axios.patch(`/api/v1/orders/${order.id}`, { order: updatedData });
		  setOrder(response.data);
		} catch (error) {
		  console.error('Error updating order:', error);
		}
	};

	const handleNext = () => {
		setStep(step + 1);
	};

	const handleBack = () => {
		setStep(step - 1);
	};

	const renderStep = () => {
		switch (step) {
		case 1:
			return <CheckoutCart order={order} onUpdateOrder={updateOrder} onNext={handleNext} />;
		case 2:
			return <CheckoutShippingInfo order={order} onUpdateOrder={updateOrder} onNext={handleNext} onBack={handleBack} />;
		case 3:
			return <CheckoutShippingOptions order={order} shippingRates={shippingRates} updateOrder={updateOrder} onNext={handleNext} onBack={handleBack} />;
		case 4:
			return <CheckoutPayment order={order} onUpdateOrder={updateOrder} onNext={handleNext} onBack={handleBack} />;
		case 5:
			return <CheckoutConfirmation order={order} />;
		default:
			return <div>Invalid step</div>;
		}
	};

	return (
		<div className="container py-5">
			<div className="pb-3">
				<CheckoutProgressBar currentStep={step} totalSteps={5} />
			</div>
			{renderStep()}
		</div>
	);
};

export default Checkout;